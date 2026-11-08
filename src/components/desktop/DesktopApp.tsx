import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { OverviewView } from './OverviewView';
import { UpdateCenterView } from './UpdateCenterView';
import { WizardView } from './WizardView';
import { AppsView } from './AppsView';
import { HealthView } from './HealthView';
import { MaintenanceView } from './MaintenanceView';
import { StorageView } from './StorageView';
import { HardwareView } from './HardwareView';
import { CustomizationView } from './CustomizationView';
import { RecoveryView } from './RecoveryView';
import { DevToolsView } from './DevToolsView';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { AboutView } from './AboutView';
import { DesktopNavPage, LanguageCode, ThemeMode, AuditLogEntry } from '../../types';
import { INITIAL_AUDIT_LOGS } from '../../data/catalog';

interface DesktopAppProps {
  lang: LanguageCode;
  onSetLang: (lang: LanguageCode) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

export const DesktopApp: React.FC<DesktopAppProps> = ({
  lang,
  onSetLang,
  theme,
  onSetTheme,
}) => {
  const [currentPage, setCurrentPage] = useState<DesktopNavPage>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const logAction = (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      category,
      status,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="flex h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar currentPage={currentPage} onSelectPage={setCurrentPage} lang={lang} />

      {/* Main View Area */}
      <main
        className={`flex-1 overflow-y-auto bg-zinc-950/90 ${
          currentPage === 'updates' ? 'p-0 flex flex-col' : 'p-6'
        }`}
      >
        {currentPage === 'updates' ? (
          <UpdateCenterView lang={lang} />
        ) : (
          <div className="max-w-6xl mx-auto pb-12">
            {currentPage === 'overview' && <OverviewView lang={lang} />}
            {currentPage === 'wizard' && <WizardView lang={lang} onLogAction={logAction} />}
            {currentPage === 'apps' && <AppsView lang={lang} onLogAction={logAction} />}
            {currentPage === 'health' && <HealthView lang={lang} />}
            {currentPage === 'maintenance' && <MaintenanceView lang={lang} onLogAction={logAction} />}
            {currentPage === 'security' && <HealthView lang={lang} />}
            {currentPage === 'storage' && <StorageView lang={lang} onLogAction={logAction} />}
            {currentPage === 'hardware' && <HardwareView lang={lang} />}
            {currentPage === 'customization' && <CustomizationView lang={lang} onLogAction={logAction} />}
            {currentPage === 'recovery' && <RecoveryView lang={lang} onLogAction={logAction} />}
            {currentPage === 'devtools' && <DevToolsView lang={lang} onLogAction={logAction} />}
            {currentPage === 'history' && <HistoryView logs={auditLogs} lang={lang} />}
            {currentPage === 'settings' && (
              <SettingsView
                lang={lang}
                onSetLang={onSetLang}
                theme={theme}
                onSetTheme={onSetTheme}
                onLogAction={logAction}
              />
            )}
            {currentPage === 'about' && <AboutView lang={lang} />}
          </div>
        )}
      </main>
    </div>
  );
};
