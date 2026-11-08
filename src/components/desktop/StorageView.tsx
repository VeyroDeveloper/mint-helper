import React, { useState } from 'react';
import {
  HardDrive,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Folder,
  Shield,
} from 'lucide-react';

interface StorageViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const StorageView: React.FC<StorageViewProps> = ({ lang, onLogAction }) => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'duplicates' | 'caches'>('analyzer');
  const [isScanningDups, setIsScanningDups] = useState(false);
  const [dupScanCompleted, setDupScanCompleted] = useState(false);

  const t = {
    en: {
      title: 'Storage & Cleanup Station',
      subtitle: 'Analyze partition utilization, inspect large files, and remove harmless caches safely.',
      tabAnalyzer: 'Storage Analyzer',
      tabDuplicates: 'Duplicate Finder (SHA-256)',
      tabCaches: 'Safe Cache Cleaner',
      driveRoot: 'NVMe Main Drive (/root)',
      driveHome: 'User Home (/home/mint)',
      usedSpace: '226 GB used of 512 GB (44%)',
      scanDupsBtn: 'Scan Folder for Content Duplicates',
      dupWarning: 'Zero-Risk Principle: Duplicate files are compared by exact SHA-256 hashes and are NEVER deleted automatically.',
      profileProtectNotice: 'Browser profiles (~/.mozilla/firefox) and personal documents (~/Documents) are strictly excluded from automated cleanup routines.',
    },
    de: {
      title: 'Speicher- & Bereinigungs-Station',
      subtitle: 'Festplattenbelegung analysieren, Duplikate finden und Caches sicher leeren.',
      tabAnalyzer: 'Speicher-Analyse',
      tabDuplicates: 'Duplikat-Finder (SHA-256)',
      tabCaches: 'Sichere Cache-Bereinigung',
      driveRoot: 'NVMe Hauptlaufwerk (/root)',
      driveHome: 'Benutzerverzeichnis (/home/mint)',
      usedSpace: '226 GB belegt von 512 GB (44%)',
      scanDupsBtn: 'Ordner nach Inhalts-Duplikaten durchsuchen',
      dupWarning: 'Sicherheitsprinzip: Duplikate werden per SHA-256 Hash verglichen und NIEMALS automatisch gelöscht.',
      profileProtectNotice: 'Browserprofile (~/.mozilla/firefox) und persönliche Dokumente sind strikt von der Bereinigung ausgenommen.',
    },
  }[lang];

  const handleScanDups = () => {
    setIsScanningDups(true);
    setTimeout(() => {
      setIsScanningDups(false);
      setDupScanCompleted(true);
      onLogAction?.('Duplicate Content Scan Executed', 'Storage', 'SUCCESS', 'Scanned ~/Downloads using SHA-256 chunk comparison.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Mode navigation */}
      <div className="flex space-x-2 border-b border-zinc-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'analyzer'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.tabAnalyzer}
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'duplicates'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.tabDuplicates}
        </button>
        <button
          onClick={() => setActiveTab('caches')}
          className={`pb-2.5 px-3 border-b-2 transition ${
            activeTab === 'caches'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {t.tabCaches}
        </button>
      </div>

      {/* Tab 1: Storage Analyzer */}
      {activeTab === 'analyzer' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-zinc-200">{t.driveRoot}</span>
              <span className="text-zinc-400 font-mono">{t.usedSpace}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '44%' }}></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs border-t border-zinc-800/80">
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">System (/usr)</div>
                <div className="font-bold text-zinc-200 mt-0.5">14.8 GB</div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">Flatpaks (/var)</div>
                <div className="font-bold text-zinc-200 mt-0.5">8.4 GB</div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">User Home (/home)</div>
                <div className="font-bold text-zinc-200 mt-0.5">182.5 GB</div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">Available Free</div>
                <div className="font-bold text-emerald-400 mt-0.5">286.0 GB</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Duplicate Finder */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Cryptographic Duplicate Scanner</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Scans target directory by matching file lengths, then verifies with SHA-256 checksums.
                </p>
              </div>
              <button
                onClick={handleScanDups}
                disabled={isScanningDups}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center gap-1.5 self-start disabled:opacity-50"
              >
                <Search size={13} className={isScanningDups ? 'animate-spin' : ''} />
                <span>{t.scanDupsBtn}</span>
              </button>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2">
              <Shield size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.dupWarning}</span>
            </div>

            {dupScanCompleted && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-zinc-300">
                  Detected Content Matches in ~/Downloads:
                </div>
                <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between items-center text-zinc-300 font-mono text-[11px]">
                    <span>SHA-256: 8a4f91b...e3c</span>
                    <span className="text-zinc-400">142.4 MB (2 identical files)</span>
                  </div>
                  <div className="space-y-1 text-zinc-400 font-mono text-[11px] pl-2 border-l border-zinc-800">
                    <div>1. ~/Downloads/LinuxMint_Cinnamon_22.iso</div>
                    <div>2. ~/Downloads/LinuxMint_Cinnamon_22 (copy).iso</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Caches */}
      {activeTab === 'caches' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <span>{t.profileProtectNotice}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-200">Thumbnail Preview Cache</div>
                  <div className="text-zinc-400 text-[11px]">~/.cache/thumbnails (85 MB)</div>
                </div>
                <button
                  onClick={() => onLogAction?.('Thumbnail Cache Cleaned', 'Storage', 'SUCCESS', 'Freed 85 MB')}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 transition"
                >
                  Clean
                </button>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-200">Desktop Trash Can</div>
                  <div className="text-zinc-400 text-[11px]">~/.local/share/Trash (512 MB)</div>
                </div>
                <button
                  onClick={() => onLogAction?.('Trash Can Emptied', 'Storage', 'SUCCESS', 'Freed 512 MB')}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 transition"
                >
                  Empty Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
