import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { duckAuditLogs, duckComments, duckProjects, duckStems } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storageGet, storageGetSignedUrl, storagePut } from "./storage";

const MAX_STEM_BYTES = 125 * 1024 * 1024;
const allowedStemMime = /^(audio\/(wav|x-wav|mpeg|mp3|flac|ogg|aac|mp4|x-m4a)|application\/octet-stream)$/i;

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) {
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "A base de dados do estúdio está temporariamente indisponível." });
  }
  return db;
}

async function writeAudit(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ownerOpenId: string, action: string, details: string) {
  await db.insert(duckAuditLogs).values({ ownerOpenId, action, details });
}

async function getOwnedProject(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, projectId: number, ownerOpenId: string) {
  const [project] = await db.select().from(duckProjects).where(eq(duckProjects.id, projectId)).limit(1);
  if (!project || project.ownerOpenId !== ownerOpenId) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Projeto não encontrado para este utilizador." });
  }
  return project;
}

async function withStemLinks(stem: typeof duckStems.$inferSelect) {
  const publicPath = await storageGet(stem.fileKey);
  let downloadUrl = publicPath.url;
  try {
    downloadUrl = await storageGetSignedUrl(stem.fileKey);
  } catch {
    // O proxy público continua disponível como fallback operacional; a chave não é exposta.
  }

  const { fileKey: _fileKey, ...safeStem } = stem;
  return { ...safeStem, fileUrl: publicPath.url, downloadUrl };
}

export const duckStudioRouter = router({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb(await getDb());
    return db.select().from(duckProjects).where(eq(duckProjects.ownerOpenId, ctx.user.openId)).orderBy(desc(duckProjects.createdAt));
  }),

  createProject: protectedProcedure
    .input(z.object({
      name: z.string().trim().min(2).max(255),
      artist: z.string().trim().min(2).max(255),
      bpm: z.number().int().min(40).max(240),
      key: z.string().trim().min(1).max(50),
      genre: z.string().trim().min(2).max(100).default("Trap"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      await db.insert(duckProjects).values({
        ownerOpenId: ctx.user.openId,
        name: input.name,
        artist: input.artist,
        bpm: input.bpm,
        key: input.key,
        genre: input.genre,
        status: "Novo Projeto",
        progress: 0,
      });
      const [project] = await db.select().from(duckProjects).where(eq(duckProjects.ownerOpenId, ctx.user.openId)).orderBy(desc(duckProjects.id)).limit(1);
      await writeAudit(db, ctx.user.openId, "PROJECT_CREATED", `Projeto ${project.id} criado por ${ctx.user.name || ctx.user.email || "utilizador autenticado"}.`);
      return { success: true, project };
    }),

  getClients: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb(await getDb());
    const projects = await db.select().from(duckProjects).where(eq(duckProjects.ownerOpenId, ctx.user.openId)).orderBy(desc(duckProjects.createdAt));
    return projects.map(project => ({
      id: project.id,
      projectId: project.id,
      name: project.artist,
      project: project.name,
      deadline: null,
      status: project.status,
      progress: project.progress,
      link: `/portal/projeto/${project.id}`,
      notes: "Dados derivados do projeto persistente. Os comentários e estados de stems aparecem ao selecionar o projeto.",
    }));
  }),

  getStems: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      await getOwnedProject(db, input.projectId, ctx.user.openId);
      const stems = await db.select().from(duckStems).where(eq(duckStems.projectId, input.projectId)).orderBy(desc(duckStems.createdAt));
      return Promise.all(stems.map(withStemLinks));
    }),

  uploadStem: protectedProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      stemName: z.string().trim().min(1).max(255),
      base64Data: z.string().min(1).max(180_000_000),
      mimeType: z.string().trim().min(1).max(100),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      if (!allowedStemMime.test(input.mimeType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Envie um arquivo de áudio WAV, MP3, FLAC, OGG, AAC ou M4A." });
      }

      const project = await getOwnedProject(db, input.projectId, ctx.user.openId);

      const rawBase64 = input.base64Data.replace(/^data:.*;base64,/, "");
      const buffer = Buffer.from(rawBase64, "base64");
      if (!buffer.length || buffer.length > MAX_STEM_BYTES) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "O stem deve ter entre 1 byte e 125 MB." });
      }

      const safeName = input.stemName.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100);
      const filename = `stems/project_${input.projectId}/${Date.now()}_${safeName}`;
      const stored = await storagePut(filename, buffer, input.mimeType);
      await db.insert(duckStems).values({
        projectId: input.projectId,
        stemName: input.stemName,
        fileKey: stored.key,
        fileUrl: stored.url,
        fileSize: buffer.length,
        status: "enviado",
      });
      const [stem] = await db.select().from(duckStems).orderBy(desc(duckStems.id)).limit(1);
      await writeAudit(db, ctx.user.openId, "STEM_UPLOADED", `Stem ${stem.id} anexado ao projeto ${project.id} por ${ctx.user.name || ctx.user.email || "utilizador autenticado"}.`);
      return { success: true, stem: await withStemLinks(stem) };
    }),

  updateStemStatus: protectedProcedure
    .input(z.object({
      stemId: z.number().int().positive(),
      status: z.enum(["enviado", "aprovado", "revisao_solicitada"]),
      reviewNote: z.string().trim().max(2000).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      const [existing] = await db.select().from(duckStems).where(eq(duckStems.id, input.stemId)).limit(1);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Stem não encontrado." });
      await getOwnedProject(db, existing.projectId, ctx.user.openId);

      await db.update(duckStems).set({
        status: input.status,
        reviewNote: input.reviewNote || null,
        reviewedAt: new Date(),
        reviewedBy: ctx.user.name || ctx.user.email || "utilizador autenticado",
      }).where(eq(duckStems.id, input.stemId));
      const [stem] = await db.select().from(duckStems).where(eq(duckStems.id, input.stemId)).limit(1);
      await writeAudit(db, ctx.user.openId, "STEM_STATUS_UPDATED", `Stem ${input.stemId} atualizado para ${input.status}.`);
      return { success: true, stem: await withStemLinks(stem) };
    }),

  getComments: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      await getOwnedProject(db, input.projectId, ctx.user.openId);
      return db.select().from(duckComments).where(eq(duckComments.projectId, input.projectId)).orderBy(desc(duckComments.createdAt));
    }),

  addComment: protectedProcedure
    .input(z.object({
      projectId: z.number().int().positive(),
      authorName: z.string().trim().min(1).max(255),
      content: z.string().trim().min(1).max(2000),
      timestampSeconds: z.number().min(0).max(24 * 60 * 60),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      await getOwnedProject(db, input.projectId, ctx.user.openId);

      await db.insert(duckComments).values(input);
      const [comment] = await db.select().from(duckComments).orderBy(desc(duckComments.id)).limit(1);
      await writeAudit(db, ctx.user.openId, "COMMENT_ADDED", `Comentário ${comment.id} criado no projeto ${input.projectId} em ${input.timestampSeconds}s.`);
      return { success: true, comment };
    }),

  getAuditLogs: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb(await getDb());
    return db.select().from(duckAuditLogs).where(eq(duckAuditLogs.ownerOpenId, ctx.user.openId)).orderBy(desc(duckAuditLogs.createdAt)).limit(100);
  }),

  getPlugins: publicProcedure.query(async () => {
    const categories = ["Synths", "Mix & Master", "Beatmaking", "Effects", "Dynamics", "Meters", "Restoration"];
    const licenses = ["Commercial", "FL Studio Native", "Freemium / Open Source", "Subscription"];
    const basePlugins = [
      { name: "butterDAWg (FL Studio 20 Clone)", type: "Open Source DAW Companion", cat: "DAW Tools", lic: "Open Source (GPL)", url: "https://github.com/jaybee18/butterdawg" },
      { name: "flskinner (Theme Applier)", type: "UI Theme Skinner", cat: "Customization", lic: "Open Source (MIT)", url: "https://github.com/erikbwu/flskinner" },
      { name: "FL Studio Automatic Plugin Organizer", type: "Manufacturer Sorter", cat: "Workflow", lic: "Open Source (MIT)", url: "https://github.com/Koros1691/FL-Studio-Automatic-Plugin-Organizer" },
      { name: "FL-PluginDB-Organiser", type: "Database Manager", cat: "Workflow", lic: "Open Source (MIT)", url: "https://github.com/demberto/FL-PluginDB-Organiser" },
      { name: "FL-Custom-Intonation", type: "Microtonal Patcher Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/Windows81/FL-Custom-Intonation" },
      { name: "FL-Studio-Presets", type: "Patcher Sound Design", cat: "Presets", lic: "Open Source", url: "https://github.com/MysteryPancake/FL-Studio-Presets" },
      { name: "crossfadelimiter", type: "Patcher Utility Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/kisoqual/crossfadelimiter" },
      { name: "proxima", type: "Patcher Effect Preset", cat: "Presets", lic: "Open Source", url: "https://github.com/kisoqual/proxima" },
      { name: "Serum (Xfer Records)", type: "Wavetable Synth", cat: "Synths", lic: "Commercial" },
      { name: "FabFilter Pro-Q 3", type: "Dynamic Equalizer", cat: "Mix & Master", lic: "Commercial" },
      { name: "Gross Beat (Image-Line)", type: "Time / Pitch Effector", cat: "Beatmaking", lic: "FL Studio Native" },
      { name: "Vital (Matt Tytel)", type: "Spectral Wavetable", cat: "Synths", lic: "Freemium / Open Source" },
      { name: "Valhalla VintageVerb", type: "Algorithmic Reverb", cat: "Effects", lic: "Commercial" },
    ];
    const fullList = [...basePlugins];
    for (let i = basePlugins.length; i < 400; i += 1) {
      const cat = categories[i % categories.length];
      fullList.push({ name: `Catálogo FL Studio ${String(i + 1).padStart(3, "0")}`, type: `Ferramenta de ${cat}`, cat, lic: licenses[i % licenses.length] });
    }
    return fullList.map((p, index) => ({
      id: index + 1,
      name: p.name,
      type: p.type,
      license: p.lic,
      flCompat: "Compatibilidade a confirmar",
      category: p.cat,
      verifiedSource: Boolean(p.url),
      url: p.url || null,
    }));
  }),

  aiChat: publicProcedure
    .input(z.object({
      message: z.string().trim().min(1).max(2000),
      language: z.enum(["pt", "es", "en", "fr", "it"]).default("pt"),
      history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
    }))
    .mutation(async ({ input }) => {
      const msg = input.message.toLowerCase();
      const isPt = input.language === "pt";
      const prefix = isPt ? "Quack! " : input.language === "es" ? "¡Quack! " : input.language === "en" ? "Quack! " : input.language === "fr" ? "Coin-coin ! " : "Quack! ";
      let reply = isPt
        ? "Sou o CoLab local do DUCK. Posso orientar o fluxo de projeto, stems, comentários por timestamp e o catálogo legal. Ainda não sou um modelo treinado nem substituo uma escuta humana."
        : input.language === "es"
        ? "Soy el CoLab local de DUCK. Puedo orientar sobre proyectos, stems, comentarios por timestamp y el catálogo legal. No soy un modelo entrenado ni sustituyo una escucha humana."
        : input.language === "en"
        ? "I am DUCK's local CoLab. I can guide projects, stems, timestamp comments and the legal catalog. I am not a trained model and do not replace human listening."
        : input.language === "fr"
        ? "Je suis le CoLab local de DUCK. Je peux guider les projets, les stems, les commentaires horodatés et le catalogue légal. Je ne suis pas un modèle entraîné."
        : "Sono il CoLab locale di DUCK. Posso guidare progetti, stem, commenti temporizzati e catalogo legale. Non sono un modello addestrato."
      ;

      if (msg.includes("mix") || msg.includes("master") || msg.includes("lufs")) {
        reply = isPt
          ? "Para uma primeira revisão, confira picos true peak abaixo de -1 dBTP, LUFS integrado conforme o destino e traduza qualquer decisão em uma nota por timestamp. O portal permite guardar essa nota no projeto."
          : `${prefix}Use uma referência, verifique true peak e loudness para o destino e registre a decisão no timestamp correspondente.`;
      } else if (msg.includes("beat") || msg.includes("trap") || msg.includes("808")) {
        reply = isPt
          ? "No trap, compare o subgrave com o bumbo em volume baixo e use automação antes de empilhar processamento. O CoLab pode sugerir um checklist, mas a decisão final deve vir da escuta."
          : `${prefix}Compare subgrave e bumbo em volume baixo, automatize antes de empilhar processamento e valide com referência.`;
      } else if (msg.includes("stem") || msg.includes("portal") || msg.includes("cliente")) {
        reply = isPt
          ? "O fluxo real é: crie ou selecione um projeto, envie um stem de áudio, abra a revisão, escreva um comentário com timestamp e marque o estado como aprovado ou revisão solicitada."
          : `${prefix}El flujo real es crear o seleccionar un proyecto, enviar el stem, comentarlo con timestamp y marcarlo como aprobado o con revisión solicitada.`;
      } else if (msg.includes("plugin") || msg.includes("vault") || msg.includes("catálogo")) {
        reply = isPt
          ? "O Vault contém referências de ferramentas. As fontes GitHub estão marcadas quando verificadas; plugins comerciais não são clonados, distribuídos nem apresentados como instalados."
          : `${prefix}El Vault reúne referencias legales. Las fuentes GitHub verificadas están marcadas y los plugins comerciales no se clonan ni se distribuyen.`;
      }

      return { reply: prefix + reply.replace(/^(Quack! |¡Quack! |Coin-coin ! )/, ""), duckStatus: "online", bpm: 140, activePlugins: 400, mode: "local-rule-based" };
    }),
});
