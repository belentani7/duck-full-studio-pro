import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DuckAIChat } from "@/components/DuckAIChat";
import { Sliders, Disc, FolderArchive, Users, Radio, Cpu, Sparkles, CheckCircle2, Play, Pause, Upload, Shield, HardDrive, FileAudio } from "lucide-react";
import { startLogin } from "@/const";

export default function DuckFullStudioWorkspace() {
  const { user, isAuthenticated } = useAuth();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"dashboard" | "clients" | "assets" | "mastering" | "settings">("dashboard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProject, setActiveProject] = useState({ name: "Trap Aracaju 140BPM", bpm: 140, key: "C# Minor", status: "Mixagem & Vocal Tuning" });

  const projects = [
    { id: 1, name: "Trap Aracaju 140BPM", artist: "Kvyn MC", bpm: 140, key: "C#m", status: "Mixagem", progress: 75 },
    { id: 2, name: "Pop Summer Hit", artist: "Belentani", bpm: 118, key: "F# Major", status: "Masterização", progress: 90 },
    { id: 3, name: "Drill Sergipe", artist: "Dlok", bpm: 142, key: "Em", status: "Beatmaking", progress: 40 },
  ];

  const clients = [
    { id: 1, name: "Kvyn MC", project: "Trap Aracaju", deadline: "15 Ago 2026", status: "Aguardando Aprovação V2", link: "duckstudio.local/client/kvyn" },
    { id: 2, name: "Belentani", project: "Pop Summer Hit", deadline: "18 Ago 2026", status: "Stems Enviados", link: "duckstudio.local/client/belen" },
  ];

  const assetsSummary = {
    oneShots: "1,420 arquivos (808s, Snares, HiHats)",
    presets: "850 patches (Serum, Sylenth1, Vital)",
    stems: "42 projetos multitrack compactados",
    totalSize: "14.2 GB locais"
  };

  return (
    <div className="min-h-screen bg-[#060a06] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Workspace Header */}
      <header className="sticky top-0 z-50 bg-[#060a06]/95 backdrop-blur-md border-b border-emerald-500/20 px-6 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black font-mono tracking-tight shadow-md shadow-emerald-500/20">
            D4X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-unbounded font-black text-xs text-white">DUCK FULL STUDIO WORKSPACE</span>
              <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-500/30">LOCAL MODE · NO CMD</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">FL Studio Engine Sincronizado · {activeProject.name} ({activeProject.bpm} BPM)</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <button onClick={() => setActiveWorkspaceTab("dashboard")} className={`hover:text-emerald-400 transition-colors ${activeWorkspaceTab === 'dashboard' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-0.5' : ''}`}>DASHBOARD</button>
          <button onClick={() => setActiveWorkspaceTab("clients")} className={`hover:text-emerald-400 transition-colors ${activeWorkspaceTab === 'clients' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-0.5' : ''}`}>PORTAL CLIENTES</button>
          <button onClick={() => setActiveWorkspaceTab("assets")} className={`hover:text-emerald-400 transition-colors ${activeWorkspaceTab === 'assets' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-0.5' : ''}`}>ASSETS & VSTS</button>
          <button onClick={() => setActiveWorkspaceTab("mastering")} className={`hover:text-emerald-400 transition-colors ${activeWorkspaceTab === 'mastering' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-0.5' : ''}`}>MASTER LAB</button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/30 hidden sm:inline">
            {user?.name || "Duck (Studio Master)"}
          </span>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {activeWorkspaceTab === "dashboard" && (
          <div className="space-y-8">
            {/* Quick Stats & Active Project */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0b130d] border border-emerald-500/30 p-6 rounded-2xl space-y-6 shadow-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">SESIÓN ACTIVA FL STUDIO</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded">
                    {activeProject.status}
                  </span>
                </div>
                <div>
                  <h2 className="font-unbounded font-bold text-2xl text-white">{activeProject.name}</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Tonalidad: {activeProject.key} · Tempo: {activeProject.bpm} BPM · Productor: Duck</p>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs rounded-xl px-6 py-5">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? "Pausar Pre-master" : "Reproducir Pre-master"}
                  </Button>
                  <Button variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 font-mono text-xs rounded-xl px-6 py-5">
                    <Upload className="w-4 h-4 mr-2" /> Exportar Stems
                  </Button>
                </div>
              </div>

              <div className="bg-[#0b130d] border border-emerald-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <span className="font-mono text-xs text-emerald-400 uppercase">ALMACENAMIENTO LOCAL</span>
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-zinc-400">One-Shots & Kits:</span> <span className="text-white">1,420</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Presets & VSTs:</span> <span className="text-white">850</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Espacio Usado:</span> <span className="text-emerald-400">14.2 GB / 500 GB</span></div>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                  <div className="bg-emerald-500 h-full w-[28%]" />
                </div>
              </div>
            </div>

            {/* Projects Queue */}
            <div className="bg-[#0b130d] border border-emerald-500/30 p-6 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
                <h3 className="font-unbounded font-bold text-lg text-white">Cola de Producciones en Curso</h3>
                <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs">
                  + Nuevo Proyecto
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div key={p.id} onClick={() => setActiveProject(p)} className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-500/60 cursor-pointer transition-colors space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-emerald-400">{p.key} · {p.bpm} BPM</span>
                      <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{p.status}</span>
                    </div>
                    <h4 className="font-bold text-base text-white">{p.name}</h4>
                    <p className="text-xs text-zinc-400">Artista: {p.artist}</p>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeWorkspaceTab === "clients" && (
          <div className="bg-[#0b130d] border border-emerald-500/30 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <h3 className="font-unbounded font-bold text-lg text-white">Portal Inteligente de Clientes</h3>
              <span className="text-xs font-mono text-emerald-400">Enlaces seguros para aprobación de mixes</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((c) => (
                <div key={c.id} className="p-5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-emerald-400">Prazo: {c.deadline}</span>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">{c.status}</span>
                  </div>
                  <h4 className="font-bold text-lg text-white">{c.name}</h4>
                  <p className="text-xs text-zinc-400">Proyecto: {c.project}</p>
                  <div className="pt-2 border-t border-emerald-500/10 flex justify-between items-center">
                    <span className="font-mono text-xs text-zinc-500">{c.link}</span>
                    <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-300 font-mono text-xs hover:bg-emerald-500/10">
                      Copiar Enlace
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeWorkspaceTab === "assets" && (
          <div className="bg-[#0b130d] border border-emerald-500/30 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <h3 className="font-unbounded font-bold text-lg text-white">Librería de 5,000+ Assets Funcionales</h3>
              <span className="text-xs font-mono text-emerald-400">{assetsSummary.totalSize}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/20 space-y-2">
                <FileAudio className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">One-Shots & Drum Kits</h4>
                <p className="text-zinc-400">{assetsSummary.oneShots}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/20 space-y-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Presets VSTs</h4>
                <p className="text-zinc-400">{assetsSummary.presets}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/20 space-y-2">
                <FolderArchive className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Stems Multitrack</h4>
                <p className="text-zinc-400">{assetsSummary.stems}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-emerald-500/20 space-y-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Plantillas FL Studio</h4>
                <p className="text-zinc-400">12 templates de mezcla rápida</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <DuckAIChat language="pt" />
    </div>
  );
}
