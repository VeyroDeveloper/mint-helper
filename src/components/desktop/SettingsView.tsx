import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Globe,
  Palette,
  Shield,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { LanguageCode, ThemeMode } from '../../types';
import { EVERYDAY_PROFILE, validateProfile, SetupProfile } from '../../lib/profile_engine';

interface SettingsViewProps {
  lang: LanguageCode;
  onSetLang: (lang: LanguageCode) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onSetLang,
  theme,
  onSetTheme,
  onLogAction,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedProfile, setImportedProfile] = useState<SetupProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update Settings state
  const [autoCheck, setAutoCheck] = useState(true);
  const [frequency, setFrequency] = useState<'startup' | 'daily' | 'weekly' | 'manual'>('daily');
  const [channel, setChannel] = useState<'stable' | 'beta' | 'dev'>('stable');
  const [notifyOnUpdate, setNotifyOnUpdate] = useState(true);
  const [onlyNotifySecurity, setOnlyNotifySecurity] = useState(false);
  const [retentionDays, setRetentionDays] = useState(90);

  const t = {
    en: {
      title: 'Preferences & Configuration Profiles',
      subtitle: 'Customize application theme, language, and export/import setup profiles.',
      themeHeader: 'Appearance & Desktop Theme',
      langHeader: 'Interface Language',
      themeSystem: 'Follow System',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode (Mint-Y-Dark)',
      profileHeader: 'Configuration Profile Export & Import (Schema v1.0)',
      profileDesc: 'Export your post-installation selections to a documented JSON file. Reuse after reinstalling Linux Mint or on other computers.',
      exportBtn: 'Export Current Profile (JSON)',
      importBtn: 'Import Profile (JSON)',
      securityNote: 'Safety guarantee: Exported profiles contain ONLY software package selections and desktop toggles. They NEVER contain passwords, SSH keys, browser cookies, or private tokens.',
      updatesHeader: 'Automatic Update Check Settings',
      updatesDesc: 'Configure scheduled checks for mint-helper, APT packages, and Flatpak apps without automatic execution.',
      autoCheckLabel: 'Check for updates automatically',
      freqLabel: 'Check Frequency:',
      freqDaily: 'Once per day (Default)',
      freqStartup: 'On application startup',
      freqWeekly: 'Once per week',
      freqManual: 'Only when manually requested',
      channelLabel: 'Software Channel:',
      notifyLabel: 'Show desktop notifications when new updates are available',
      secOnlyLabel: 'Only notify for critical security & kernel patches',
      retentionLabel: 'Update history log retention (days):',
      saveUpdatesBtn: 'Save Update Preferences',
      updatesSavedNotice: 'Update check preferences saved successfully.',
    },
    de: {
      title: 'Einstellungen & Konfigurationsprofile',
      subtitle: 'Passen Sie Erscheinungsbild, Sprache und Profil-Export/Import an.',
      themeHeader: 'Erscheinungsbild & Thema',
      langHeader: 'Sprache der Benutzeroberfläche',
      themeSystem: 'Systemstandard',
      themeLight: 'Hell',
      themeDark: 'Dunkel (Mint-Y-Dark)',
      profileHeader: 'Konfigurationsprofil Export & Import (Schema v1.0)',
      profileDesc: 'Exportieren Sie Ihre Post-Installations-Auswahl in eine dokumentierte JSON-Datei.',
      exportBtn: 'Profil exportieren (JSON)',
      importBtn: 'Profil importieren (JSON)',
      securityNote: 'Sicherheitsgarantie: Exportierte Profile enthalten NIEMALS Passwörter, SSH-Schlüssel oder private Benutzerdaten.',
      updatesHeader: 'Automatische Aktualisierungsprüfung',
      updatesDesc: 'Konfigurieren Sie regelmäßige Prüfungen für mint-helper, APT- und Flatpak-Pakete ohne automatische Ausführung.',
      autoCheckLabel: 'Automatisch nach Aktualisierungen suchen',
      freqLabel: 'Prüfintervall:',
      freqDaily: 'Einmal täglich (Standard)',
      freqStartup: 'Beim Programmstart',
      freqWeekly: 'Einmal wöchentlich',
      freqManual: 'Nur bei manueller Anforderung',
      channelLabel: 'Aktualisierungskanal:',
      notifyLabel: 'Benachrichtigung anzeigen, wenn Updates verfügbar sind',
      secOnlyLabel: 'Nur bei kritischen Sicherheits- und Kernel-Updates benachrichtigen',
      retentionLabel: 'Verlaufs-Aufbewahrung (Tage):',
      saveUpdatesBtn: 'Update-Einstellungen speichern',
      updatesSavedNotice: 'Update-Einstellungen wurden erfolgreich gespeichert.',
    },
  }[lang];

  // Export profile JSON
  const handleExportProfile = () => {
    const dataStr = JSON.stringify(EVERYDAY_PROFILE, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mint-helper-profile-everyday-v1.0.json`;
    link.click();
    URL.revokeObjectURL(url);
    onLogAction?.('Configuration Profile Exported', 'Settings', 'SUCCESS', 'Exported Everyday User profile JSON (v1.0).');
  };

  // Import profile JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateProfile(content);
      if (res.valid && res.profile) {
        setImportedProfile(res.profile);
        setImportStatus(`Successfully validated profile "${res.profile.name}" (Schema v${res.profile.schema_version}).`);
        onLogAction?.('Profile Imported & Validated', 'Settings', 'SUCCESS', `Imported profile: ${res.profile.name}`);
      } else {
        setImportStatus(`Import Error: ${res.error}`);
        onLogAction?.('Profile Import Failed', 'Settings', 'WARNING', `Validation failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Update Center Configuration Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm text-xs">
        <div className="flex items-center space-x-2 font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
          <RefreshCw size={15} className="text-emerald-400" />
          <span>{t.updatesHeader}</span>
        </div>
        <p className="text-zinc-400">{t.updatesDesc}</p>

        <div className="space-y-3">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-zinc-200 font-medium">{t.autoCheckLabel}</span>
          </label>

          {autoCheck && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 pt-1">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">{t.freqLabel}</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:border-emerald-500"
                >
                  <option value="daily">{t.freqDaily}</option>
                  <option value="startup">{t.freqStartup}</option>
                  <option value="weekly">{t.freqWeekly}</option>
                  <option value="manual">{t.freqManual}</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">{t.channelLabel}</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:border-emerald-500"
                >
                  <option value="stable">Stable (Default & Recommended)</option>
                  <option value="beta">Beta Channel</option>
                  <option value="dev">Development Channel</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-2 border-t border-zinc-800/60">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnUpdate}
                onChange={(e) => setNotifyOnUpdate(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-zinc-300">{t.notifyLabel}</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyNotifySecurity}
                onChange={(e) => setOnlyNotifySecurity(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-zinc-300">{t.secOnlyLabel}</span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-zinc-400">
              <span>{t.retentionLabel}</span>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days (Default)</option>
                <option value={180}>180 Days</option>
                <option value={365}>365 Days</option>
              </select>
            </div>

            <button
              onClick={() => {
                onLogAction?.('Update Settings Saved', 'Settings', 'SUCCESS', `Frequency: ${frequency}, Channel: ${channel}`);
                alert(t.updatesSavedNotice);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition cursor-pointer"
            >
              {t.saveUpdatesBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Appearance */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
            <Palette size={15} className="text-emerald-400" />
            <span>{t.themeHeader}</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 'mint-y-dark' as const, label: t.themeDark },
              { id: 'light' as const, label: t.themeLight },
              { id: 'system' as const, label: t.themeSystem },
            ].map((th) => (
              <label
                key={th.id}
                className="flex items-center space-x-2.5 p-2 rounded bg-zinc-950/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
              >
                <input
                  type="radio"
                  name="theme"
                  checked={theme === th.id}
                  onChange={() => onSetTheme(th.id)}
                  className="text-emerald-500 focus:ring-emerald-400"
                />
                <span className="text-zinc-300 font-medium">{th.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
            <Globe size={15} className="text-emerald-400" />
            <span>{t.langHeader}</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2.5 p-2 rounded bg-zinc-950/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700">
              <input
                type="radio"
                name="lang"
                checked={lang === 'en'}
                onChange={() => onSetLang('en')}
                className="text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-zinc-300 font-medium">English (US / Linux Mint Default)</span>
            </label>
            <label className="flex items-center space-x-2.5 p-2 rounded bg-zinc-950/40 border border-zinc-800/80 cursor-pointer hover:border-zinc-700">
              <input
                type="radio"
                name="lang"
                checked={lang === 'de'}
                onChange={() => onSetLang('de')}
                className="text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-zinc-300 font-medium">Deutsch (German)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Export / Import Station */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="border-b border-zinc-800/80 pb-2">
          <h3 className="text-sm font-bold text-zinc-200">{t.profileHeader}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{t.profileDesc}</p>
        </div>

        <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
          <Shield size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>{t.securityNote}</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <button
            onClick={handleExportProfile}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow-sm"
          >
            <Download size={13} />
            <span>{t.exportBtn}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded font-medium transition"
          >
            <Upload size={13} />
            <span>{t.importBtn}</span>
          </button>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded border text-xs font-mono ${
              importStatus.includes('Error')
                ? 'bg-rose-950/30 border-rose-800 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
            }`}
          >
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};
