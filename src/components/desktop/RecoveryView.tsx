import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, HardDrive, Shield, Folder, ExternalLink } from 'lucide-react';

interface RecoveryViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ lang, onLogAction }) => {
  const [createdSnapshot, setCreatedSnapshot] = useState(false);

  const t = {
    en: {
      title: 'Recovery & Backups Center',
      subtitle: 'Manage Timeshift operating system snapshots and personal document backups.',
      timeshiftHeader: 'Timeshift System Restore Snapshots',
      timeshiftStatus: 'Timeshift is detected and active at /usr/bin/timeshift.',
      createSnapshotBtn: 'Create Snapshot Now',
      openTimeshiftBtn: 'Open Timeshift GUI',
      personalBackupsHeader: 'Personal User Directory Backups',
      personalDesc: 'Select directories to mirror to an external USB drive or network share.',
    },
    de: {
      title: 'Wiederherstellung & Datensicherung',
      subtitle: 'Verwalten Sie Timeshift-Systemwiederherstellung und Sicherungen persönlicher Dateien.',
      timeshiftHeader: 'Timeshift System-Wiederherstellungspunkte',
      timeshiftStatus: 'Timeshift ist installiert und aktiv unter /usr/bin/timeshift.',
      createSnapshotBtn: 'Jetzt Schnappschuss erstellen',
      openTimeshiftBtn: 'Timeshift GUI öffnen',
      personalBackupsHeader: 'Persönliche Datensicherung',
      personalDesc: 'Wählen Sie Verzeichnisse für ein Backup auf ein externes USB-Laufwerk aus.',
    },
  }[lang];

  const handleCreateSnapshot = () => {
    setCreatedSnapshot(true);
    onLogAction?.('Timeshift Snapshot Created', 'Recovery', 'SUCCESS', 'Created on-demand system restore point "mint-helper manual checkpoint".');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Timeshift Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <HardDrive size={15} className="text-emerald-400" />
            <span>{t.timeshiftHeader}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            RSYNC Daily Active
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">{t.timeshiftStatus}</p>

        <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs font-mono space-y-1.5 text-zinc-300">
          <div className="text-zinc-400 text-[11px]">Recent Snapshots:</div>
          <div>• 2026-11-08_04-00-01 (Daily automated snapshot) — 14.8 GB</div>
          <div>• 2026-11-07_04-00-01 (Daily automated snapshot) — 14.8 GB</div>
          {createdSnapshot && (
            <div className="text-emerald-400 font-semibold">
              • 2026-11-08_07-35-00 (mint-helper manual checkpoint) — Created just now
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={handleCreateSnapshot}
            disabled={createdSnapshot}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow-sm disabled:opacity-50"
          >
            {createdSnapshot ? 'Snapshot Ready' : t.createSnapshotBtn}
          </button>
          <button
            onClick={() => alert('Command to open on Linux Mint: pkexec timeshift-gtk')}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 transition flex items-center gap-1.5"
          >
            <span>{t.openTimeshiftBtn}</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Personal user backups */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
          <Folder size={15} className="text-emerald-400" />
          <span>{t.personalBackupsHeader}</span>
        </div>
        <p className="text-xs text-zinc-400">{t.personalDesc}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {['~/Documents', '~/Pictures', '~/Videos', '~/Desktop'].map((dir) => (
            <label
              key={dir}
              className="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center space-x-2 cursor-pointer hover:border-zinc-700"
            >
              <input type="checkbox" defaultChecked className="rounded text-emerald-500" />
              <span className="font-mono text-zinc-300 text-[11px]">{dir}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
