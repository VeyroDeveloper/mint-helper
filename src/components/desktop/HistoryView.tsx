import React from 'react';
import { History, Download, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface HistoryViewProps {
  logs: AuditLogEntry[];
  lang: 'en' | 'de';
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs, lang }) => {
  const t = {
    en: {
      title: 'Local Operation History & Audit Log',
      subtitle: 'Audit log of software installations, firewall policy adjustments, and maintenance operations.',
      exportBtn: 'Export Diagnostic Log (.txt)',
      privacyNotice: 'Privacy & Security: Logs are stored strictly on your local disk in ~/.config/mint-helper/history.json and are never transmitted over the network.',
      noLogs: 'No operations recorded yet in this session.',
    },
    de: {
      title: 'Lokaler Operationsverlauf & Audit-Protokoll',
      subtitle: 'Protokoll aller Installationen, Firewall-Anpassungen und Wartungsaktionen.',
      exportBtn: 'Diagnoseprotokoll exportieren (.txt)',
      privacyNotice: 'Datenschutz & Sicherheit: Protokolle werden ausschließlich lokal gespeichert und niemals übertragen.',
      noLogs: 'Noch keine Operationen in dieser Sitzung aufgezeichnet.',
    },
  }[lang];

  const handleExport = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.category}] ${l.status}: ${l.action} - ${l.details}`)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mint-helper-audit-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs font-medium transition self-start"
        >
          <Download size={13} />
          <span>{t.exportBtn}</span>
        </button>
      </div>

      <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <span>{t.privacyNotice}</span>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-xs text-zinc-400 bg-zinc-900/60 rounded-lg border border-zinc-800">
          {t.noLogs}
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-zinc-200">{log.action}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {log.category}
                  </span>
                </div>
                <div className="text-zinc-400 text-[11px]">{log.details}</div>
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-mono text-zinc-400 shrink-0">
                <span>{log.timestamp}</span>
                <span className="text-emerald-400 font-semibold">{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
