import React, { useState } from "react";
import { DuckAIChat } from "@/components/DuckAIChat";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sliders, Disc, FolderArchive, Users, Radio, Cpu, Sparkles, CheckCircle2, Play, Pause, Upload, Shield, HardDrive, FileAudio, Search, Wrench, MessageSquare, Terminal } from "lucide-react";
import { startLogin } from "@/const";

export default function DuckFullStudioPro() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "plugins" | "audit" | "colab">("dashboard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProject, setActiveProject] = useState({ name: "Trap Aracaju 140BPM", bpm: 140, key: "C# Minor", status: "Mixagem & Vocal Tuning" });
  const [searchTerm, setSearchTerm] = useState("");

  const pluginsVault = [
    { name: "Serum (Xfer Records)", type: "Wavetable Synth", license: "Commercial ($189)", flCompat: "Native VST3 / AU", category: "Synths" },
    { name: "FabFilter Pro-Q 3", type: "Dynamic Equalizer", license: "Commercial ($179)", flCompat: "Native VST3", category: "Mix & Master" },
    { name: "Gross Beat (Image-Line)", type: "Time / Pitch Effector", license: "FL Studio Native ($99)", flCompat: "Native FL Plugin", category: "Beatmaking" },
    { name: "Vital (Audio Damage / Matt Tytel)", type: "Spectral Wavetable", license: "Freemium / Open Source Engine", flCompat: "VST3 / AU", category: "Synths" },
    { name: "Valhalla VintageVerb", type: "Algorithmic Reverb", license: "Commercial ($50)", flCompat: "Native VST3", category: "Effects" },
    { name: "Soundtoys Decapitator", type: "Analog Saturation", license: "Commercial ($199)", flCompat: "Native VST3", category: "Mix & Master" },
    { name: "Omnisphere 2 (Spectrasonics)", type: "Hardware Synth Hybrid", license: "Commercial ($499)", flCompat: "Native VST3", category: "Synths" },
    { name: "Kilohearts Phase Plant", type: "Modular Synth", license: "Commercial / Subscription", flCompat: "Native VST3", category: "Synths" },
  ];

  const projects = [
    { id: 1, name: "Trap Aracaju 140BPM", artist: "Kvyn MC", bpm: 140, key: "C#m", status: "Mixagem", progress: 75 },
    { id: 2, name: "Pop Summer Hit", artist: "Belentani", bpm: 118, key: "F# Major", status: "Masterização", progress: 90 },
    { id: 3, name: "Drill Sergipe", artist: "Dlok", bpm: 142, key: "Em", status: "Beatmaking", progress: 40 },
  ];

  const clients = [
    { id: 1, name: "Kvyn MC", project: "Trap Aracaju", deadline: "15 Ago 2026", status: "Aguardando Aprovação V2", link: "duckstudio.local/client/kvyn" },
    { id: 2, name: "Belentani", project: "Pop Summer Hit", deadline: "18 Ago 2026", status: "Stems Enviados", link: "duckstudio.local/client/belen" },
  ];

  return (
    <div className="min-h-screen bg-[#050805] text-[#e2ede2] font-sans selection:bg-[#00ff66] selection:text-black">
      {/* Top App Bar - Unified Palette */}
      <header className="sticky top-0 z-50 bg-[#050805]/95 backdrop-blur-xl border-b border-[#152615] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center font-bold text-black font-mono tracking-tighter shadow-lg shadow-[#00ff66]/15">
            D4X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider text-white uppercase font-mono">DUCK STUDIO PRO 400</span>
              <span className="bg-[#0b1c0d] text-[#00ff66] font-mono text-[10px] px-2 py-0.5 rounded border border-[#152615]">LOCAL WORKSPACE</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">FL Studio Flow Sincronizado · {activeProject.name}</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-[#081208] p-1 rounded-xl border border-[#152615] text-xs font-mono">
          <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => setActiveTab("clients")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'clients' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Portal Clientes</button>
          <button onClick={() => setActiveTab("plugins")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'plugins' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Vault Plugins (400)</button>
          <button onClick={() => setActiveTab("audit")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Auditoría S3</button>
          <button onClick={() => setActiveTab("colab")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'colab' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>CoLab AI</button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#00ff66] bg-[#081208] px-3.5 py-1.5 rounded-xl border border-[#152615]">
            {user?.name || "Duck (Studio Master)"}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" />
                    <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest font-semibold">SESIÓN ACTIVA FL STUDIO</span>
                  </div>
                  <span className="bg-[#0b1c0d] text-[#00ff66] font-mono text-xs px-3 py-1 rounded-full border border-[#152615]">
                    {activeProject.status}
                  </span>
                </div>
                <div>
                  <h1 className="font-bold text-3xl text-white tracking-tight">{activeProject.name}</h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1.5">Tonalidad: {activeProject.key} · Tempo: {activeProject.bpm} BPM · Productor: Duck (Aracaju)</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-2xl px-7 py-6 font-bold shadow-lg shadow-[#00ff66]/20 transition-transform active:scale-95">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2 fill-current" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                    {isPlaying ? "Pausar Pre-master" : "Reproducir Pre-master"}
                  </Button>
                  <Button variant="outline" className="border-[#152615] bg-[#050805] text-[#e2ede2] hover:bg-[#0f1c0f] font-mono text-xs rounded-2xl px-7 py-6 transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> Exportar Stems
                  </Button>
                </div>
              </div>

              <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#152615] pb-4">
                  <span className="font-mono text-xs text-[#00ff66] uppercase font-semibold">ALMACENAMIENTO LOCAL</span>
                  <HardDrive className="w-4 h-4 text-[#00ff66]" />
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-zinc-400">One-Shots & Kits:</span> <span className="text-white font-bold">1,420</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Plugins Catalogados:</span> <span className="text-white font-bold">400 Vault</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Espacio Usado:</span> <span className="text-[#00ff66] font-bold">14.2 GB / 500 GB</span></div>
                </div>
                <div className="w-full bg-[#050805] rounded-full h-2.5 overflow-hidden border border-[#152615]">
                  <div className="bg-[#00ff66] h-full w-[28%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#152615] pb-4">
                <h3 className="font-bold text-lg text-white tracking-tight">Cola de Producciones en Curso</h3>
                <Button size="sm" className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-xl px-4 py-2 font-bold">
                  + Nuevo Proyecto
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {projects.map((p) => (
                  <div key={p.id} onClick={() => setActiveProject(p)} className="p-6 rounded-2xl bg-[#050805] border border-[#152615] hover:border-[#00ff66]/60 cursor-pointer transition-all space-y-4 group">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-[#00ff66] bg-[#0b1c0d] px-2.5 py-1 rounded-lg border border-[#152615]">{p.key} · {p.bpm} BPM</span>
                      <span className="text-[10px] font-mono bg-[#0f1c0f] px-2.5 py-1 rounded-lg text-zinc-300">{p.status}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white group-hover:text-[#00ff66] transition-colors">{p.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">Artista: {p.artist}</p>
                    </div>
                    <div className="w-full bg-[#081208] rounded-full h-2 overflow-hidden border border-[#152615]">
                      <div className="bg-[#00ff66] h-full rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#152615] pb-4">
              <h3 className="font-bold text-lg text-white">Plataforma de Clientes — Portal Inteligente</h3>
              <span className="text-xs font-mono text-[#00ff66]">Control de Stems y Aprobaciones con Comentarios</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl bg-[#050805] border border-[#152615] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#00ff66]">Prazo: {c.deadline}</span>
                    <span className="text-[10px] font-mono bg-[#0b1c0d] text-[#00ff66] px-3 py-1 rounded-full border border-[#152615]">{c.status}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{c.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Proyecto: {c.project}</p>
                  </div>
                  <div className="pt-3 border-t border-[#152615] flex justify-between items-center">
                    <span className="font-mono text-xs text-zinc-500">{c.link}</span>
                    <Button size="sm" variant="outline" className="border-[#152615] bg-[#050805] text-[#00ff66] font-mono text-xs hover:bg-[#0f1c0f] rounded-xl">
                      Copiar Enlace
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "plugins" && (
          <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#152615] pb-4 gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">Vault de 400 Plugins y Herramientas (FL Studio)</h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">Clasificación legal de plugins de alta gama, sintes y efectos con compatibilidad nativa.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar plugin o efecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#050805] border border-[#152615] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff66]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pluginsVault.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#050805] border border-[#152615] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] bg-[#0b1c0d] text-[#00ff66] px-2.5 py-0.5 rounded border border-[#152615]">{p.category}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{p.flCompat}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{p.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{p.type}</p>
                  </div>
                  <div className="pt-2 border-t border-[#152615] flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[#00ff66]">{p.license}</span>
                    <span className="text-zinc-500">Verificado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#152615] pb-4">
              <h3 className="font-bold text-lg text-white">Auditoría Pesada & S3 Stems Storage</h3>
              <span className="text-xs font-mono text-[#00ff66]">100% Sin Errores de Ruta</span>
            </div>
            <div className="p-6 bg-[#050805] rounded-2xl border border-[#152615] space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#152615]">
                <span className="text-zinc-300">Integridad de Activos y Portadas:</span>
                <span className="text-[#00ff66] font-bold">45/45 Verificados</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#152615]">
                <span className="text-zinc-300">Conexión Stems Cloud (S3):</span>
                <span className="text-[#00ff66] font-bold">Activa y Sincronizada</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Modo Local Sin Terminal:</span>
                <span className="text-[#00ff66] font-bold">Operativo (100% Gráfico)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "colab" && (
          <div className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#152615] pb-4">
              <h3 className="font-bold text-lg text-white">Duck CoLab AI — Asistente Inteligente Híbrido</h3>
              <span className="text-xs font-mono text-[#00ff66]">Modo Local + API Opcional</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              El asistente inteligente está entrenado en el flujo de trabajo de Duck, mezcla, masterización y estructuración de contratos. Utiliza la burbuja flotante inferior derecha para interactuar en cualquier momento.
            </p>
          </div>
        )}
      </main>

      <DuckAIChat language="pt" />
    </div>
  );
}
