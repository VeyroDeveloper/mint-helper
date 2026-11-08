import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Download,
  Trash2,
  ShieldAlert,
  Info,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { APP_CATALOG, AppEntry } from '../../data/catalog';

interface AppsViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const AppsView: React.FC<AppsViewProps> = ({ lang, onLogAction }) => {
  const [apps, setApps] = useState<AppEntry[]>(APP_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [inspectApp, setInspectApp] = useState<AppEntry | null>(null);

  const t = {
    en: {
      title: 'Application & Flatpak Manager',
      subtitle: 'Manage system packages (APT), sandboxed Flatpaks, and portable AppImages.',
      searchPlaceholder: 'Search installed and available applications...',
      allCategories: 'All Categories',
      allSources: 'All Sources',
      flatpakOnly: 'Flatpak Only',
      aptOnly: 'APT Only',
      installedBadge: 'Installed',
      installBtn: 'Install',
      uninstallBtn: 'Remove',
      permissions: 'Sandbox Permissions',
      publisher: 'Publisher',
      source: 'Package Source',
      version: 'Version',
      flatsealNote: 'Use Flatseal to adjust granular application permissions on Linux Mint.',
    },
    de: {
      title: 'Anwendungs- & Flatpak-Verwaltung',
      subtitle: 'Verwalten Sie Systempakete (APT), isolierte Flatpaks und portable AppImages.',
      searchPlaceholder: 'Installierte und verfügbare Anwendungen durchsuchen...',
      allCategories: 'Alle Kategorien',
      allSources: 'Alle Quellen',
      flatpakOnly: 'Nur Flatpak',
      aptOnly: 'Nur APT',
      installedBadge: 'Installiert',
      installBtn: 'Installieren',
      uninstallBtn: 'Entfernen',
      permissions: 'Sandbox-Berechtigungen',
      publisher: 'Herausgeber',
      source: 'Paketquelle',
      version: 'Version',
      flatsealNote: 'Verwenden Sie Flatseal, um detaillierte Berechtigungen anzupassen.',
    },
  }[lang];

  // Filtering
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSource =
      selectedSource === 'All' ||
      (selectedSource === 'Flatpak' && app.source === 'Flatpak') ||
      (selectedSource === 'APT' && app.source === 'APT');

    return matchesSearch && matchesCategory && matchesSource;
  });

  const handleToggleInstall = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const newStatus = !app.installed;
          onLogAction?.(
            newStatus ? `Installed ${app.name}` : `Removed ${app.name}`,
            'Applications',
            'SUCCESS',
            `${app.name} (${app.id}) ${newStatus ? 'installed via ' + app.source : 'removed from system'}`
          );
          return { ...app, installed: newStatus };
        }
        return app;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">{t.allCategories}</option>
          <option value="Internet">Internet</option>
          <option value="Productivity">Productivity</option>
          <option value="Multimedia">Multimedia</option>
          <option value="Graphics">Graphics</option>
          <option value="Gaming">Gaming</option>
          <option value="Utilities">Utilities</option>
          <option value="Development">Development</option>
        </select>

        {/* Source filter */}
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          aria-label="Filter by package source"
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">{t.allSources}</option>
          <option value="Flatpak">{t.flatpakOnly}</option>
          <option value="APT">{t.aptOnly}</option>
        </select>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-700 transition space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-zinc-200 text-sm">{app.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-zinc-950 text-zinc-400 border-zinc-800 shrink-0">
                  {app.source}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">{app.id}</div>
              <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{app.description}</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
              <button
                onClick={() => setInspectApp(app)}
                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium flex items-center gap-1"
              >
                <Info size={12} />
                <span>Details</span>
              </button>

              {app.installed ? (
                <button
                  onClick={() => handleToggleInstall(app.id)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-300 text-emerald-400 rounded text-xs font-medium border border-zinc-700 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} />
                  <span>{t.installedBadge}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleToggleInstall(app.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center gap-1.5"
                >
                  <Download size={12} />
                  <span>{t.installBtn}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details modal */}
      {inspectApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-zinc-100">{inspectApp.name}</h3>
                <div className="text-xs font-mono text-zinc-400 mt-0.5">{inspectApp.id}</div>
              </div>
              <button
                onClick={() => setInspectApp(null)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-400">Description: </span>
                <span className="text-zinc-200">{inspectApp.description}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                <div>
                  <span className="text-zinc-400">Version: </span>
                  <span className="font-mono">{inspectApp.version}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Publisher: </span>
                  <span>{inspectApp.publisher}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-800">
                <div className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider">
                  {t.permissions}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inspectApp.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded text-[10px] font-mono"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {inspectApp.source === 'Flatpak' && (
                <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-[11px] text-zinc-400">
                  {t.flatsealNote}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setInspectApp(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
