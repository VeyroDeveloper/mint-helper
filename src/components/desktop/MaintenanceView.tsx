import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  RefreshCw,
  Trash2,
  HardDrive,
  Shield,
  Layers,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface MaintenanceViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ lang, onLogAction }) => {
  const [isUpdatingApt, setIsUpdatingApt] = useState(false);
  const [isUpdatingFlatpak, setIsUpdatingFlatpak] = useState(false);
  const [isCleaningApt, setIsCleaningApt] = useState(false);
  const [aptCleaned, setAptCleaned] = useState(false);
  const [aptStatus, setAptStatus] = useState<string>('Repositories synchronized. All packages current.');
  const [flatpakStatus, setFlatpakStatus] = useState<string>('Flathub metadata up to date.');

  const t = {
    en: {
      title: 'Maintenance Center',
      subtitle: 'Routine system maintenance: updates, dependency cleanup, and repository synchronization.',
      updatesSection: 'Software & Runtime Updates',
      checkApt: 'Check APT Updates',
      updateFlatpaks: 'Refresh Flatpaks',
      cleanupSection: 'Package Cache & Dependency Cleanup',
      cleanAptCache: 'Clean APT Cache (240 MB)',
      autoremoveDeps: 'Remove Unused Dependencies',
      systemChecks: 'System Diagnostic Checks',
      aptDesc: 'Checks official Linux Mint and Ubuntu software channels for package updates.',
      flatpakDesc: 'Refreshes Flathub appstream metadata and updates installed sandboxed runtimes.',
      cleanDesc: 'Removes old .deb installer packages stored in /var/cache/apt/archives.',
    },
    de: {
      title: 'Wartungs-Zentrum',
      subtitle: 'Regelmäßige Systempflege: Updates, Bereinigung von Abhängigkeiten und Spiegel-Abgleich.',
      updatesSection: 'Software- & Laufzeitumgebungs-Updates',
      checkApt: 'APT Updates prüfen',
      updateFlatpaks: 'Flatpaks aktualisieren',
      cleanupSection: 'Paket-Cache & Abhängigkeiten bereinigen',
      cleanAptCache: 'APT Cache leeren (240 MB)',
      autoremoveDeps: 'Verwaiste Abhängigkeiten entfernen',
      systemChecks: 'System-Diagnoseprüfungen',
      aptDesc: 'Prüft offizielle Linux Mint und Ubuntu Paketquellen auf Aktualisierungen.',
      flatpakDesc: 'Aktualisiert Flathub-Metadaten und installierte Sandbox-Laufzeiten.',
      cleanDesc: 'Entfernt alte .deb Installationsdateien aus /var/cache/apt/archives.',
    },
  }[lang];

  const handleCheckApt = () => {
    setIsUpdatingApt(true);
    setTimeout(() => {
      setIsUpdatingApt(false);
      setAptStatus('All 1,842 installed packages are up to date. 0 security upgrades available.');
      onLogAction?.('APT Repositories Checked', 'Maintenance', 'SUCCESS', 'Executed apt update check. System is fully patched.');
    }, 1000);
  };

  const handleUpdateFlatpak = () => {
    setIsUpdatingFlatpak(true);
    setTimeout(() => {
      setIsUpdatingFlatpak(false);
      setFlatpakStatus('Checked Flathub remote. All 6 Flatpak runtimes are at latest version.');
      onLogAction?.('Flatpak Metadata Refreshed', 'Maintenance', 'SUCCESS', 'Synchronized Flathub appstream metadata.');
    }, 1000);
  };

  const handleCleanApt = () => {
    setIsCleaningApt(true);
    setTimeout(() => {
      setIsCleaningApt(false);
      setAptCleaned(true);
      onLogAction?.('APT Cache Cleaned', 'Maintenance', 'SUCCESS', 'Freed 240 MB of disk space from /var/cache/apt/archives');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Section 1: Updates */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
          <RefreshCw size={15} className="text-emerald-400" />
          <span>{t.updatesSection}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* APT Update */}
          <div className="p-4 bg-zinc-950/60 rounded-lg border border-zinc-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-zinc-200">APT Distribution Packages</div>
              <p className="text-zinc-400 text-[11px] mt-1">{t.aptDesc}</p>
              <div className="text-[11px] text-zinc-300 font-mono mt-2 bg-zinc-900/80 p-2 rounded border border-zinc-800">
                {aptStatus}
              </div>
            </div>
            <button
              onClick={handleCheckApt}
              disabled={isUpdatingApt}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isUpdatingApt ? 'animate-spin' : ''} />
              <span>{t.checkApt}</span>
            </button>
          </div>

          {/* Flatpak Update */}
          <div className="p-4 bg-zinc-950/60 rounded-lg border border-zinc-800/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-zinc-200">Flathub Runtimes & Applications</div>
              <p className="text-zinc-400 text-[11px] mt-1">{t.flatpakDesc}</p>
              <div className="text-[11px] text-zinc-300 font-mono mt-2 bg-zinc-900/80 p-2 rounded border border-zinc-800">
                {flatpakStatus}
              </div>
            </div>
            <button
              onClick={handleUpdateFlatpak}
              disabled={isUpdatingFlatpak}
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium transition border border-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isUpdatingFlatpak ? 'animate-spin' : ''} />
              <span>{t.updateFlatpaks}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Safe Package Cleanup */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
          <Trash2 size={15} className="text-emerald-400" />
          <span>{t.cleanupSection}</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-zinc-200">Clean Obsolete APT Package Archives</div>
              <div className="text-zinc-400 text-[11px]">{t.cleanDesc}</div>
            </div>
            {aptCleaned ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 size={14} /> Cleaned (240 MB freed)
              </span>
            ) : (
              <button
                onClick={handleCleanApt}
                disabled={isCleaningApt}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 text-xs transition"
              >
                {t.cleanAptCache}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
