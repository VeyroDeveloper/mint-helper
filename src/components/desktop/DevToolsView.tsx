import React, { useState } from 'react';
import { Code2, CheckCircle2, Download, Terminal, ExternalLink } from 'lucide-react';

interface DevToolsViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const DevToolsView: React.FC<DevToolsViewProps> = ({ lang, onLogAction }) => {
  const [installedTools, setInstalledTools] = useState<string[]>(['git']);

  const t = {
    en: {
      title: 'Developer Tools Station',
      subtitle: 'Install verified compilers, runtimes, package managers, and editors for software development.',
      installedBadge: 'Installed',
      installBtn: 'Install Tool',
      commandPreview: 'Command Line:',
    },
    de: {
      title: 'Entwickler-Werkzeuge Station',
      subtitle: 'Installieren Sie Compiler, Laufzeitumgebungen und Editoren für Linux Mint.',
      installedBadge: 'Installiert',
      installBtn: 'Installieren',
      commandPreview: 'Befehl:',
    },
  }[lang];

  const tools = [
    {
      id: 'git',
      name: 'Git Version Control',
      desc: 'Distributed revision control system for tracking source code changes.',
      command: 'sudo apt install -y git',
      version: '2.43.0',
    },
    {
      id: 'build-essential',
      name: 'Build Essentials (gcc, g++, make)',
      desc: 'Meta-package containing compilers and development libraries needed to compile software from source.',
      command: 'sudo apt install -y build-essential',
      version: '12.10',
    },
    {
      id: 'rust-toolchain',
      name: 'Rust & Cargo (rustup)',
      desc: 'Modern memory-safe systems programming language and package manager.',
      command: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      version: '1.82.0',
    },
    {
      id: 'python3-pip',
      name: 'Python 3, Pip & Virtualenv',
      desc: 'Python programming environment with pip and isolated venv module.',
      command: 'sudo apt install -y python3-pip python3-venv',
      version: '3.12.3',
    },
    {
      id: 'nodejs',
      name: 'Node.js & NPM',
      desc: 'JavaScript runtime built on Chrome V8 engine for web development.',
      command: 'sudo apt install -y nodejs npm',
      version: '20.18.0 LTS',
    },
    {
      id: 'com.vscodium.codium',
      name: 'VSCodium Editor',
      desc: 'Community-driven, freely-licensed binary distribution of VS Code with Microsoft telemetry disabled.',
      command: 'flatpak install -y flathub com.vscodium.codium',
      version: '1.95.1',
    },
    {
      id: 'it.mijorus.gearlever',
      name: 'Gear Lever',
      desc: 'Manage AppImages seamlessly: automatic menu integration, icon extraction, and CLI updates.',
      command: 'flatpak install -y flathub it.mijorus.gearlever',
      version: '2.2.0',
    },
  ];

  const handleToggle = (id: string, name: string) => {
    if (installedTools.includes(id)) {
      setInstalledTools((prev) => prev.filter((x) => x !== id));
      onLogAction?.(`Removed ${name}`, 'DevTools', 'SUCCESS', `Removed ${id} package`);
    } else {
      setInstalledTools((prev) => [...prev, id]);
      onLogAction?.(`Installed ${name}`, 'DevTools', 'SUCCESS', `Installed ${id} package`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {tools.map((tool) => {
          const isInstalled = installedTools.includes(tool.id);
          return (
            <div
              key={tool.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-sm">{tool.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {tool.version}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">{tool.desc}</p>
                <div className="pt-1 text-[10px] font-mono text-zinc-400 truncate bg-zinc-950 p-1.5 rounded border border-zinc-800/80">
                  {tool.command}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex justify-end">
                {isInstalled ? (
                  <button
                    onClick={() => handleToggle(tool.id, tool.name)}
                    className="px-2.5 py-1 bg-zinc-800 text-emerald-400 border border-zinc-700 rounded text-xs font-medium flex items-center gap-1.5 hover:bg-rose-950/40 hover:text-rose-300 transition"
                  >
                    <CheckCircle2 size={12} />
                    <span>{t.installedBadge}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggle(tool.id, tool.name)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    <span>{t.installBtn}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
