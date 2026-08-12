import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { translations, Lang } from "@/lib/i18n";
import { InstrumentsLab } from "@/components/InstrumentsLab";
import { DuckAIChat } from "@/components/DuckAIChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Search, Music, Radio, Sparkles, Shield, ArrowRight, Volume2, Disc3 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Lang>("pt");
  const t = translations[lang];

  const [phase, setPhase] = useState<"purple" | "green">("purple");
  const [genreFilter, setGenreFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tracksQuery = trpc.duck.getTracks.useQuery({ genre: genreFilter, search: searchQuery });
  const singlesQuery = trpc.duck.getSingles.useQuery();
  const auditQuery = trpc.duck.getAuditLogs.useQuery();

  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setPhase("green");
      } else {
        setPhase("purple");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${phase === "purple" ? "bg-[#0f0518] text-[#f2ecff]" : "bg-[#04100b] text-[#ebfff4]"}`}>
      {/* Background ambient glowing */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className={`absolute w-[70vw] h-[70vw] rounded-full blur-[140px] transition-all duration-1000 ${phase === "purple" ? "bg-[#b884ff]/15 -top-[20vw] -left-[10vw]" : "bg-[#34e08c]/15 -top-[20vw] -left-[10vw]"}`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-unbounded font-black text-black text-base shadow-lg">
            D
          </div>
          <div>
            <span className="font-unbounded font-bold text-lg tracking-wider">DUCK4X</span>
            <span className="font-mono text-[9px] text-dim tracking-widest block uppercase">Aracaju · Sergipe · Brasil</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 font-mono text-xs tracking-wider text-dim">
          <a href="#about" className="hover:text-foreground transition-colors">001. SOBRE</a>
          <a href="#portfolio" className="hover:text-foreground transition-colors">002. DISCOGRAFIA</a>
          <a href="#singles" className="hover:text-foreground transition-colors">003. SINGLES</a>
          <a href="#studio" className="hover:text-foreground transition-colors">004. ESTÚDIO</a>
          <a href="#services" className="hover:text-foreground transition-colors">005. SERVIÇOS</a>
          <a href="#instruments" className="hover:text-foreground transition-colors">006. INSTRUMENTOS</a>
          <a href="#admin" className="hover:text-foreground transition-colors">007. GESTÃO</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-surface2/80 border border-border rounded-lg p-0.5 text-xs font-mono">
            {(["pt", "es", "en", "fr", "it"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded uppercase transition-colors ${lang === l ? "bg-accent text-black font-bold" : "text-dim hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>

          {!isAuthenticated ? (
            <Button onClick={() => startLogin()} size="sm" className="font-mono text-xs bg-accent text-black hover:bg-accent2">
              Login
            </Button>
          ) : (
            <Badge variant="outline" className="font-mono text-xs border-accent text-accent">
              {user?.name || "Duck"}
            </Badge>
          )}
        </div>
      </nav>

      {/* HERO SECTION WITH REAL ASSET BACKGROUND */}
      <header className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 lg:px-16 pt-32 pb-16 relative">
        <div className="lg:col-span-7 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent uppercase border border-accent/30 px-3 py-1.5 rounded-full bg-accent/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> {t.heroKicker}
          </div>
          <h1 className="font-unbounded font-black text-6xl sm:text-8xl tracking-tight leading-none drop-shadow-2xl">
            DUCK<span className="text-accent">4X</span>
          </h1>
          <p className="font-mono text-sm tracking-wider text-accent2">
            {t.roles}
          </p>
          <p className="font-manrope text-dim text-base sm:text-lg max-w-2xl leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href="#portfolio">
              <Button size="lg" className="bg-accent text-black font-mono font-bold tracking-wider hover:bg-accent2">
                {t.projectsBtn} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#services">
              <Button size="lg" variant="outline" className="border-border text-foreground font-mono tracking-wider hover:bg-surface2">
                {t.hireBtn}
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-border">
            <div>
              <span className="font-unbounded font-bold text-2xl sm:text-3xl">36M+</span>
              <span className="font-mono text-[10px] text-dim block tracking-widest mt-1">{t.streams}</span>
            </div>
            <div>
              <span className="font-unbounded font-bold text-2xl sm:text-3xl">40+</span>
              <span className="font-mono text-[10px] text-dim block tracking-widest mt-1">{t.releases}</span>
            </div>
            <div>
              <span className="font-unbounded font-bold text-2xl sm:text-3xl">1400+</span>
              <span className="font-mono text-[10px] text-dim block tracking-widest mt-1">{t.followers}</span>
            </div>
            <div>
              <span className="font-unbounded font-bold text-2xl sm:text-3xl">2012</span>
              <span className="font-mono text-[10px] text-dim block tracking-widest mt-1">{t.experience}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl relative group">
            <img
              src="/manus-storage/capa-1920x1080_40bb2b50.jpg"
              alt="Duck Studio Session"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent tracking-widest">DUCK.46GRAUS.COM // ARCHIVE</span>
              <h3 className="font-unbounded font-bold text-xl text-white mt-1">"Duck que beat é esse?"</h3>
              <p className="font-mono text-xs text-dim mt-1">@check_match · Aracaju, Sergipe</p>
            </div>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-border h-64">
              <img src="/manus-storage/mix-3-1920x1280_e312aa60.jpg" alt="Mix Station" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-64 mt-8">
              <img src="/manus-storage/setup-2-1920x1280_ec85dbe9.jpg" alt="Home Studio" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="space-y-6">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">// 001 — SOBRE O PRODUTOR</span>
            <h2 className="font-unbounded font-extrabold text-3xl sm:text-4xl leading-tight">
              {t.aboutTitle}
            </h2>
            <p className="font-manrope text-dim text-base leading-relaxed">
              {t.aboutLead}
            </p>
            <div className="space-y-4 pt-2 font-mono text-xs text-dim">
              <div className="flex items-center gap-3 border-l-2 border-accent pl-4 py-1">
                <span className="font-bold text-foreground">Conservatório de Música de Sergipe</span> — Fundamentos teóricos y lectura armónica profunda.
              </div>
              <div className="flex items-center gap-3 border-l-2 border-accent2 pl-4 py-1">
                <span className="font-bold text-foreground">Selo Santa Cena & Colectivos</span> — Producción activa para artistas independientes de Brasil.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="font-mono text-xs text-accent uppercase tracking-widest">// 002 — DISCOGRAFIA REAL (41+ TRACKS)</span>
              <h2 className="font-unbounded font-extrabold text-3xl sm:text-5xl mt-2">{t.discTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {["all", "pop", "trap", "mpb"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenreFilter(g)}
                  className={`px-4 py-2 rounded-lg border uppercase transition-colors ${genreFilter === g ? "bg-accent text-black border-accent font-bold" : "border-border text-dim hover:text-foreground"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-card/60 border border-border p-3 rounded-xl max-w-md">
            <Search className="w-4 h-4 text-dim" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por artista o track..."
              className="border-0 bg-transparent text-foreground focus-visible:ring-0 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracksQuery.data?.map((track) => (
              <div
                key={track.id}
                onClick={() => setPlayingTrackId(track.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${playingTrackId === track.id ? "border-accent2 bg-accent2/10 shadow-lg" : "border-border bg-card/40 hover:border-accent hover:bg-card"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg grid place-items-center font-unbounded font-black text-sm ${track.genre === 'trap' ? 'bg-emerald-500/20 text-emerald-400' : track.genre === 'mpb' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-accent'}`}>
                    {track.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-unbounded font-bold text-sm tracking-wide">{track.title}</h4>
                    <p className="font-mono text-xs text-dim mt-0.5">{track.artist}</p>
                    <div className="flex gap-2 mt-2 font-mono text-[10px]">
                      <span className="bg-surface2 px-2 py-0.5 rounded border border-border text-dim">{track.genre}</span>
                      <span className="bg-surface2 px-2 py-0.5 rounded border border-border text-dim">{track.credits}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface2 group-hover:bg-accent group-hover:text-black grid place-items-center transition-colors">
                  {playingTrackId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SINGLES SECTION */}
      <section id="singles" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest">// 003 — SINGLES OFICIAIS DUCK4X</span>
            <h2 className="font-unbounded font-extrabold text-3xl sm:text-5xl mt-2">{t.singlesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {singlesQuery.data?.map((single) => (
                <div key={single.id} className="p-5 rounded-xl border border-border bg-card/60 flex items-center justify-between hover:border-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 text-accent grid place-items-center font-unbounded font-black text-lg">
                      🦆
                    </div>
                    <div>
                      <h4 className="font-unbounded font-bold text-base">{single.title}</h4>
                      <p className="font-mono text-xs text-dim mt-1">{single.artist} · {single.bpm} BPM · {single.duration}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-border text-foreground font-mono text-xs hover:bg-accent hover:text-black">
                    Play
                  </Button>
                </div>
              ))}
            </div>

            <div className="border border-border bg-card/80 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center relative">
              <div className="w-48 h-64 bg-black rounded-3xl border-4 border-zinc-700 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-zinc-800 rounded-full" />
                <div className="text-center pt-4">
                  <span className="font-mono text-[10px] text-accent tracking-widest">SMARTWATCH OS</span>
                  <h5 className="font-unbounded font-bold text-xs mt-1 text-white">Eu Que Mando</h5>
                </div>
                <div className="flex justify-center items-end gap-1 h-20 my-auto">
                  {[40, 80, 50, 90, 30, 70, 60].map((h, i) => (
                    <div key={i} className="w-2 bg-accent rounded-t animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="text-center font-mono text-[10px] text-dim pb-2">
                  02:41 · 100 BPM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDIO GALLERY */}
      <section id="studio" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest">// 004 — GALERÍA DEL ESTUDIO & INSTAGRAM</span>
            <h2 className="font-unbounded font-extrabold text-3xl sm:text-5xl mt-2">{t.studioTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden border border-border h-80 relative group">
              <img src="/manus-storage/mix-3-1920x1280_e312aa60.jpg" alt="Mix Station" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-6 flex flex-col justify-end">
                <span className="font-mono text-xs text-accent">MIX STATION</span>
                <h4 className="font-unbounded font-bold text-white text-base">Consola & Monitores</h4>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-80 relative group">
              <img src="/manus-storage/setup-2-1920x1280_ec85dbe9.jpg" alt="Home Studio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-6 flex flex-col justify-end">
                <span className="font-mono text-xs text-accent">HOME STUDIO</span>
                <h4 className="font-unbounded font-bold text-white text-base">Aracaju, Sergipe</h4>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-80 relative group">
              <img src="/manus-storage/capa-1920x1080_40bb2b50.jpg" alt="Duck Producer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-6 flex flex-col justify-end">
                <span className="font-mono text-xs text-accent">DUCK4S</span>
                <h4 className="font-unbounded font-bold text-white text-base">Sesión Activa</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest">// 005 — SERVIÇOS</span>
            <h2 className="font-unbounded font-extrabold text-3xl sm:text-5xl mt-2">{t.servicesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "01 — Beatmaking & Produção", desc: "Criação do zero com leitura harmónica profunda. Universos sonoros onde cada acorde e groove servem à narrativa." },
              { title: "02 — Gravação", desc: "Sessões no estúdio com tratamento acústico profissional e direção criativa para extrair a performance mais autêntica." },
              { title: "03 — Mixagem", desc: "EQ dinâmico, compressão paralela y espacialización con mirada de productor y oído de ingeniero." },
              { title: "04 — Masterización", desc: "Polimento final competitivo y optimizado para Spotify, Apple Music y todas las plataformas." },
              { title: "05 — Arranjos", desc: "Transformo ideias simples em produções completas, instrumentação e direção criativa." },
              { title: "06 — Som para Vídeo", desc: "Trilhas sonoras, sound design e mixagem para conteúdo audiovisual de alto impacto." },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card/40 hover:border-accent transition-all space-y-3">
                <h4 className="font-unbounded font-bold text-base text-accent">{s.title}</h4>
                <p className="font-manrope text-dim text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUMENTS LAB */}
      <section id="instruments" className="py-16 px-6 lg:px-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <InstrumentsLab />
        </div>
      </section>

      {/* ADMIN & AUDIT SECTION */}
      <section id="admin" className="py-24 px-6 lg:px-16 border-t border-border">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <span className="font-mono text-xs text-accent uppercase tracking-widest">// 007 — GESTÃO FULLSTACK</span>
              <h2 className="font-unbounded font-extrabold text-3xl mt-1">{t.adminTitle}</h2>
            </div>
            {!isAuthenticated && (
              <Button onClick={() => startLogin()} className="bg-accent text-black font-mono">
                Acceder Panel Duck
              </Button>
            )}
          </div>

          {isAuthenticated ? (
            <div className="border border-border bg-card/60 p-6 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-unbounded font-bold text-lg">Sesión Activa: {user?.name}</h3>
                  <p className="font-mono text-xs text-dim">Rol: {user?.role} · S3 Storage Conectado</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 font-mono">ONLINE</Badge>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs text-accent uppercase tracking-widest">Auditoría Forense de Versiones</h4>
                <div className="bg-surface2 rounded-lg border border-border divide-y divide-border font-mono text-xs max-h-60 overflow-y-auto">
                  {auditQuery.data?.map((log) => (
                    <div key={log.id} className="p-3 flex justify-between items-center">
                      <span className="text-accent font-bold">{log.action}</span>
                      <span className="text-foreground">{log.details}</span>
                      <span className="text-dim text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border bg-card/40 p-12 rounded-xl text-center space-y-4">
              <Shield className="w-12 h-12 text-accent mx-auto opacity-60" />
              <h3 className="font-unbounded font-bold text-xl">Panel Privado de Duck</h3>
              <p className="font-manrope text-dim text-sm max-w-md mx-auto">
                Inicia sesión para auditar catálogos, gestionar proyectos y controlar stems.
              </p>
              <Button onClick={() => startLogin()} className="bg-accent text-black font-mono">
                Iniciar Sesión
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <footer className="py-24 px-6 lg:px-16 border-t border-border bg-card/20 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs text-accent uppercase tracking-widest">// CULMINACIÓN SÓNICA</span>
          <h2 className="font-unbounded font-black text-3xl sm:text-5xl tracking-tight">
            {t.ctaTitle}
          </h2>
          <blockquote className="font-mono text-accent2 text-base sm:text-lg italic border-y border-border py-4 my-6">
            "{t.ctaSub}"
          </blockquote>
          <div className="flex justify-center gap-4 pt-4">
            <a href="https://wa.me/5579996026590" target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-accent text-black font-mono font-bold tracking-wider hover:bg-accent2">
                WhatsApp Directo (+55 79 99602-6590)
              </Button>
            </a>
          </div>
        </div>
        <p className="font-mono text-xs text-dim pt-12 border-t border-border">
          {t.footerText}
        </p>
      </footer>

      {/* AI Chatbot Floating */}
      <DuckAIChat language={lang} />
    </div>
  );
}
