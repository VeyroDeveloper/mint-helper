import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Activity,
  Wrench,
  Shield,
  HardDrive,
  Cpu,
  Palette,
  RotateCcw,
  Code2,
  History,
  Settings,
  Info,
  RefreshCw,
} from 'lucide-react';
import { DesktopNavPage } from '../../types';

interface SidebarProps {
  currentPage: DesktopNavPage;
  onSelectPage: (page: DesktopNavPage) => void;
  lang: 'en' | 'de';
  updateCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onSelectPage, lang, updateCount = 4 }) => {
  const t = {
    en: {
      main: 'MAIN',
      overview: 'Overview',
      updates: 'Update Center',
      wizard: 'Post Installation',
      apps: 'Applications',
      health: 'System Health',
      system: 'SYSTEM',
      maintenance: 'Maintenance',
      security: 'Security',
      storage: 'Storage & Cleanup',
      hardware: 'Hardware & Drivers',
      customization: 'Customization',
      recovery: 'Recovery & Backups',
      advanced: 'ADVANCED',
      devtools: 'Developer Tools',
      history: 'Operation History',
      settings: 'Settings',
      about: 'About',
    },
    de: {
      main: 'HAUPTMENÜ',
      overview: 'Übersicht',
      updates: 'Update-Verwaltung',
      wizard: 'Post-Installation',
      apps: 'Anwendungen',
      health: 'Systemzustand',
      system: 'SYSTEM',
      maintenance: 'Wartung',
      security: 'Sicherheit',
      storage: 'Speicher & Bereinigung',
      hardware: 'Hardware & Treiber',
      customization: 'Anpassung',
      recovery: 'Wiederherstellung',
      advanced: 'ERWEITERT',
      devtools: 'Entwickler-Werkzeuge',
      history: 'Verlauf',
      settings: 'Einstellungen',
      about: 'Über',
    },
  }[lang];

  const sections: {
    title: string;
    items: { id: DesktopNavPage; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: t.main,
      items: [
        { id: 'overview', label: t.overview, icon: <LayoutDashboard size={18} /> },
        {
          id: 'updates',
          label: t.updates,
          icon: <RefreshCw size={18} />,
          badge: updateCount > 0 ? `${updateCount}` : undefined,
        },
        { id: 'wizard', label: t.wizard, icon: <Sparkles size={18} />, badge: 'Setup' },
        { id: 'apps', label: t.apps, icon: <Package size={18} /> },
        { id: 'health', label: t.health, icon: <Activity size={18} /> },
      ],
    },
    {
      title: t.system,
      items: [
        { id: 'maintenance', label: t.maintenance, icon: <Wrench size={18} /> },
        { id: 'security', label: t.security, icon: <Shield size={18} /> },
        { id: 'storage', label: t.storage, icon: <HardDrive size={18} /> },
        { id: 'hardware', label: t.hardware, icon: <Cpu size={18} /> },
        { id: 'customization', label: t.customization, icon: <Palette size={18} /> },
        { id: 'recovery', label: t.recovery, icon: <RotateCcw size={18} /> },
      ],
    },
    {
      title: t.advanced,
      items: [
        { id: 'devtools', label: t.devtools, icon: <Code2 size={18} /> },
        { id: 'history', label: t.history, icon: <History size={18} /> },
        { id: 'settings', label: t.settings, icon: <Settings size={18} /> },
        { id: 'about', label: t.about, icon: <Info size={18} /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full select-none shrink-0">
      {/* App branding header */}
      <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-950/40">
        <img src="/mint-helper.svg" alt="mint-helper" className="w-8 h-8 rounded-lg shadow-sm" />
        <div>
          <div className="font-semibold text-zinc-100 text-sm tracking-tight flex items-center gap-1.5">
            <span>mint-helper</span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-medium">
              v1.0
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">Linux Mint Companion</div>
        </div>
      </div>

      {/* Navigation menu list */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 text-xs font-medium">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold text-zinc-400 tracking-wider">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectPage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-600/20 text-emerald-300 font-semibold border-l-2 border-emerald-500 pl-2.5'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-emerald-400' : 'text-zinc-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/60 text-emerald-300 rounded font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Linux Mint Cinnamon Session Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 text-[11px] text-zinc-400 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="truncate font-mono text-zinc-300">Linux Mint 22 (Wilma)</span>
        </div>
        <span className="text-zinc-400 font-mono text-[10px]">Cinnamon</span>
      </div>
    </aside>
  );
};
