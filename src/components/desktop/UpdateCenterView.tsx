import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  ShieldAlert,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  RotateCcw,
  Layers,
  Terminal,
  ExternalLink,
  Info,
  Package,
  HardDrive,
  Trash2,
  Lock,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  AptPackageUpdate,
  FlatpakAppUpdate,
  MintHelperRelease,
  UpdateHistoryEntry,
  ReleaseChannel,
  compareSemver,
  isEligibleUpdate,
  calculateTotalDownloadSizeMb,
  checkRebootRequired,
  exportUpdateHistoryToCsv,
} from '../../lib/update_engine';

interface UpdateCenterViewProps {
  lang: 'en' | 'de';
}

type TabType = 'mint-helper' | 'apt' | 'flatpak' | 'history';

export const UpdateCenterView: React.FC<UpdateCenterViewProps> = ({ lang }) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('mint-helper');

  // Channel setting
  const [channel, setChannel] = useState<ReleaseChannel>('stable');

  // Loading states per source
  const [checkingMintHelper, setCheckingMintHelper] = useState(false);
  const [checkingApt, setCheckingApt] = useState(false);
  const [checkingFlatpak, setCheckingFlatpak] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');

  // Restart notification banner state
  const [showRebootBanner, setShowRebootBanner] = useState(false);
  const [rebootReasons, setRebootReasons] = useState<string[]>([
    'Kernel upgrade: linux-image-6.8.0-50-generic was installed recently.',
  ]);

  // mint-helper version & release state
  const installedMintHelperVersion = '1.0.0';
  const [mintHelperRelease, setMintHelperRelease] = useState<MintHelperRelease>({
    version: '1.1.0',
    channel: 'stable',
    releaseDate: '2026-11-07',
    changelog: [
      'Added comprehensive Update Center for APT, Flatpak, and AppImage.',
      'Kernel upgrade and PolicyKit authentication integration.',
      'Atomic AppImage updater with rollback and SHA256 cryptographic verification.',
      'Unused Flatpak runtimes cleaner with dependency safety checks.',
      'Detailed audit update history with CSV and JSON exports.',
    ],
    downloadSizeBytes: 24.8 * 1024 * 1024,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    signatureVerified: true,
    supportedArch: ['x86_64', 'aarch64'],
    appImageFilename: 'mint-helper-1.1.0-x86_64.AppImage',
  });

  const [installMethod, setInstallMethod] = useState<'appimage' | 'flatpak' | 'apt'>('appimage');
  const [appImageStep, setAppImageStep] = useState<
    'idle' | 'downloading' | 'verifying_checksum' | 'verifying_sig' | 'backing_up' | 'installing' | 'ready'
  >('idle');
  const [appImageProgress, setAppImageProgress] = useState(0);
  const [hasBackup, setHasBackup] = useState(true);

  // APT updates state
  const [aptUpdates, setAptUpdates] = useState<AptPackageUpdate[]>([
    {
      packageName: 'linux-image-6.8.0-50-generic',
      currentVersion: '6.8.0-45.45',
      newVersion: '6.8.0-50.51',
      sizeBytes: 84 * 1024 * 1024,
      category: 'Kernel',
      isSecurity: true,
      isKernel: true,
      requiresReboot: true,
      willRemove: [],
      newDependencies: ['linux-modules-extra-6.8.0-50-generic'],
      selected: true,
    },
    {
      packageName: 'openssl',
      currentVersion: '3.0.13-0ubuntu3.4',
      newVersion: '3.0.13-0ubuntu3.5',
      sizeBytes: 2.1 * 1024 * 1024,
      category: 'Security',
      isSecurity: true,
      isKernel: false,
      requiresReboot: false,
      willRemove: [],
      newDependencies: [],
      selected: true,
    },
    {
      packageName: 'curl',
      currentVersion: '8.5.0-2ubuntu10.5',
      newVersion: '8.5.0-2ubuntu10.6',
      sizeBytes: 240 * 1024,
      category: 'Security',
      isSecurity: true,
      isKernel: false,
      requiresReboot: false,
      willRemove: [],
      newDependencies: [],
      selected: true,
    },
    {
      packageName: 'mesa-va-drivers',
      currentVersion: '24.0.9-0ubuntu0.2',
      newVersion: '24.0.9-0ubuntu0.3',
      sizeBytes: 4.8 * 1024 * 1024,
      category: 'Recommended',
      isSecurity: false,
      isKernel: false,
      requiresReboot: false,
      willRemove: [],
      newDependencies: [],
      selected: true,
    },
    {
      packageName: 'neofetch',
      currentVersion: '7.1.0-4',
      newVersion: '7.1.0-5',
      sizeBytes: 110 * 1024,
      category: 'Optional',
      isSecurity: false,
      isKernel: false,
      requiresReboot: false,
      willRemove: [],
      newDependencies: [],
      selected: false,
    },
  ]);

  // Flatpak updates state
  const [flatpakUpdates, setFlatpakUpdates] = useState<FlatpakAppUpdate[]>([
    {
      appId: 'org.videolan.VLC',
      name: 'VLC Media Player',
      currentVersion: '3.0.20',
      newVersion: '3.0.21',
      remote: 'flathub',
      downloadSizeBytes: 42 * 1024 * 1024,
      isRuntime: false,
      selected: true,
    },
    {
      appId: 'org.gnome.Platform',
      name: 'GNOME Application Platform 46',
      currentVersion: '46.4',
      newVersion: '46.5',
      remote: 'flathub',
      downloadSizeBytes: 185 * 1024 * 1024,
      isRuntime: true,
      selected: true,
    },
    {
      appId: 'com.spotify.Client',
      name: 'Spotify',
      currentVersion: '1.2.45.454',
      newVersion: '1.2.48.500',
      remote: 'flathub',
      downloadSizeBytes: 89 * 1024 * 1024,
      isRuntime: false,
      selected: true,
    },
  ]);

  // Unused Flatpak runtimes
  const [unusedRuntimes, setUnusedRuntimes] = useState<string[]>([
    'org.freedesktop.Platform.GL.default/22.08',
    'org.gnome.Platform/44',
  ]);
  const [cleaningRuntimes, setCleaningRuntimes] = useState(false);

  // Review modal state before APT update
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPolkitDialog, setShowPolkitDialog] = useState(false);
  const [isInstallingApt, setIsInstallingApt] = useState(false);
  const [aptInstallLog, setAptInstallLog] = useState<string[]>([]);

  // Update history state
  const [history, setHistory] = useState<UpdateHistoryEntry[]>([
    {
      id: 'upd-001',
      timestamp: '2026-11-06 10:14:22',
      packageName: 'firefox',
      oldVersion: '131.0.2',
      newVersion: '132.0.0',
      manager: 'APT',
      operationType: 'security-patch',
      result: 'SUCCESS',
    },
    {
      id: 'upd-002',
      timestamp: '2026-11-05 18:40:05',
      packageName: 'org.gimp.GIMP',
      oldVersion: '2.10.36',
      newVersion: '2.10.38',
      manager: 'Flatpak',
      operationType: 'update',
      result: 'SUCCESS',
    },
    {
      id: 'upd-003',
      timestamp: '2026-11-01 09:20:11',
      packageName: 'mint-helper',
      oldVersion: '0.9.8',
      newVersion: '1.0.0',
      manager: 'mint-helper',
      operationType: 'update',
      result: 'SUCCESS',
    },
    {
      id: 'upd-004',
      timestamp: '2026-10-28 14:15:33',
      packageName: 'nvidia-driver-535',
      oldVersion: '535.161.07',
      newVersion: '535.183.01',
      manager: 'APT',
      operationType: 'update',
      result: 'SUCCESS',
    },
  ]);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'mint-helper' | 'APT' | 'Flatpak'>('ALL');

  // Remind me later dismissed flag
  const [remindLaterDismissed, setRemindLaterDismissed] = useState(false);

  // Check for updates handler
  const handleCheckAllUpdates = () => {
    setCheckingMintHelper(true);
    setCheckingApt(true);
    setCheckingFlatpak(true);

    // Simulate async API and CLI calls to GitHub, APT, and Flatpak
    setTimeout(() => {
      setCheckingMintHelper(false);
    }, 700);

    setTimeout(() => {
      setCheckingFlatpak(false);
    }, 1100);

    setTimeout(() => {
      setCheckingApt(false);
      setLastChecked('Just now');
    }, 1400);
  };

  // AppImage step-by-step install simulation
  const startAppImageUpdate = () => {
    setAppImageStep('downloading');
    setAppImageProgress(10);

    const iv = setInterval(() => {
      setAppImageProgress((prev) => {
        if (prev >= 90) {
          clearInterval(iv);
          setAppImageStep('verifying_checksum');
          setTimeout(() => {
            setAppImageStep('verifying_sig');
            setTimeout(() => {
              setAppImageStep('backing_up');
              setTimeout(() => {
                setAppImageStep('installing');
                setTimeout(() => {
                  setAppImageStep('ready');
                  // Record in history
                  const newEntry: UpdateHistoryEntry = {
                    id: `upd-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    packageName: 'mint-helper (AppImage)',
                    oldVersion: installedMintHelperVersion,
                    newVersion: mintHelperRelease.version,
                    manager: 'mint-helper',
                    operationType: 'update',
                    result: 'SUCCESS',
                  };
                  setHistory((h) => [newEntry, ...h]);
                }, 800);
              }, 600);
            }, 600);
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Rollback AppImage
  const handleRollback = () => {
    const confirmRollback = window.confirm(
      lang === 'de'
        ? 'Möchten Sie mint-helper wirklich auf die vorherige Version zurücksetzen?'
        : 'Are you sure you want to rollback mint-helper to the previous version from backup?'
    );
    if (!confirmRollback) return;

    setAppImageStep('idle');
    const newEntry: UpdateHistoryEntry = {
      id: `upd-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      packageName: 'mint-helper (AppImage)',
      oldVersion: mintHelperRelease.version,
      newVersion: installedMintHelperVersion,
      manager: 'mint-helper',
      operationType: 'rollback',
      result: 'ROLLEDBACK',
    };
    setHistory((h) => [newEntry, ...h]);
    alert(
      lang === 'de'
        ? 'Rollback erfolgreich! Die vorherige Version wurde wiederhergestellt.'
        : 'Rollback complete! The previous AppImage was restored from backup.'
    );
  };

  // Execute APT update
  const confirmAptInstallation = () => {
    setShowReviewModal(false);
    setShowPolkitDialog(true);
  };

  const handlePolkitAuthenticate = () => {
    setShowPolkitDialog(false);
    setIsInstallingApt(true);
    setAptInstallLog([
      'Acquiring package management lock (/var/lib/dpkg/lock-frontend)...',
      'Reading package lists and dependency trees... Done.',
    ]);

    setTimeout(() => {
      setAptInstallLog((prev) => [
        ...prev,
        'Downloading archives (86.3 MB)...',
        'Unpacking linux-image-6.8.0-50-generic (6.8.0-50.51)...',
        'Setting up openssl (3.0.13-0ubuntu3.5)...',
      ]);
    }, 800);

    setTimeout(() => {
      setAptInstallLog((prev) => [
        ...prev,
        'Setting up linux-image-6.8.0-50-generic...',
        'Updating initramfs for Linux Mint kernel 6.8.0-50...',
        'Running update-grub...',
        'Processing triggers for libc-bin...',
        'Transaction completed successfully.',
      ]);
      setIsInstallingApt(false);

      // Check if reboot required
      const rebootCheck = checkRebootRequired(aptUpdates);
      if (rebootCheck.rebootRequired) {
        setShowRebootBanner(true);
        setRebootReasons(rebootCheck.reasons);
      }

      // Add to history
      const selectedApt = aptUpdates.filter((a) => a.selected);
      const newEntries: UpdateHistoryEntry[] = selectedApt.map((p, idx) => ({
        id: `upd-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        packageName: p.packageName,
        oldVersion: p.currentVersion,
        newVersion: p.newVersion,
        manager: 'APT',
        operationType: p.isSecurity ? 'security-patch' : 'update',
        result: 'SUCCESS',
      }));
      setHistory((h) => [...newEntries, ...h]);

      // Remove installed from list
      setAptUpdates((prev) => prev.filter((p) => !p.selected));
    }, 2000);
  };

  // Execute Flatpak updates
  const handleUpdateFlatpaks = () => {
    const selected = flatpakUpdates.filter((f) => f.selected);
    if (selected.length === 0) return;

    const newEntries: UpdateHistoryEntry[] = selected.map((f, idx) => ({
      id: `upd-${Date.now()}-${idx}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      packageName: f.name,
      oldVersion: f.currentVersion,
      newVersion: f.newVersion,
      manager: 'Flatpak',
      operationType: 'update',
      result: 'SUCCESS',
    }));
    setHistory((h) => [...newEntries, ...h]);
    setFlatpakUpdates((prev) => prev.filter((f) => !f.selected));
    alert(
      lang === 'de'
        ? `${selected.length} Flatpak-Anwendungen wurden erfolgreich aktualisiert.`
        : `Successfully updated ${selected.length} Flatpak package(s).`
    );
  };

  // Clean unused runtimes
  const handleCleanUnusedRuntimes = () => {
    setCleaningRuntimes(true);
    setTimeout(() => {
      setCleaningRuntimes(false);
      setUnusedRuntimes([]);
      alert(
        lang === 'de'
          ? 'Nicht verwendete Flatpak-Laufzeitumgebungen wurden sicher entfernt (1.2 GB freigegeben).'
          : 'Safely removed 2 unused Flatpak runtimes (1.2 GB reclaimed).'
      );
    }, 1200);
  };

  // Toggle select in APT
  const toggleAptSelect = (name: string) => {
    setAptUpdates((prev) =>
      prev.map((p) => (p.packageName === name ? { ...p, selected: !p.selected } : p))
    );
  };

  const toggleAllApt = (select: boolean) => {
    setAptUpdates((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  // Toggle select in Flatpak
  const toggleFlatpakSelect = (id: string) => {
    setFlatpakUpdates((prev) =>
      prev.map((f) => (f.appId === id ? { ...f, selected: !f.selected } : f))
    );
  };

  const toggleAllFlatpak = (select: boolean) => {
    setFlatpakUpdates((prev) => prev.map((f) => ({ ...f, selected: select })));
  };

  // Calculations for summary bar
  const totalAvailableUpdates =
    (isEligibleUpdate(installedMintHelperVersion, mintHelperRelease, channel) ? 1 : 0) +
    aptUpdates.length +
    flatpakUpdates.length;

  const securityUpdatesCount = aptUpdates.filter((a) => a.isSecurity).length;

  const totalDownloadMb = calculateTotalDownloadSizeMb(
    aptUpdates,
    flatpakUpdates,
    isEligibleUpdate(installedMintHelperVersion, mintHelperRelease, channel) ? mintHelperRelease : null
  );

  const isMintHelperNewer = isEligibleUpdate(installedMintHelperVersion, mintHelperRelease, channel);

  // Filtered history
  const filteredHistory = history.filter((h) => {
    if (historyFilter === 'ALL') return true;
    return h.manager === historyFilter;
  });

  // Export history to CSV
  const handleExportCsv = () => {
    const csvContent = exportUpdateHistoryToCsv(filteredHistory);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mint-helper-update-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export history to JSON
  const handleExportJson = () => {
    const jsonContent = JSON.stringify(filteredHistory, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mint-helper-update-history-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const t = {
    en: {
      title: 'Update Center',
      subtitle: 'Centralized package and system lifecycle manager for Linux Mint & mint-helper',
      checkBtn: 'Check for updates',
      checking: 'Checking...',
      lastCheck: 'Last check:',
      totalUpdates: 'Available Updates',
      secUpdates: 'Security Updates',
      dlSize: 'Download Size',
      currentVer: 'Installed Version',
      latestVer: 'Latest Version',
      tabMintHelper: 'mint-helper Updates',
      tabApt: 'Linux System Updates (APT)',
      tabFlatpak: 'Flatpak Updates',
      tabHistory: 'Update History',
      rebootTitle: 'System Restart Recommended',
      rebootDesc: 'A kernel or core system update was applied. A reboot is needed to boot into the new kernel.',
      restartLater: 'Restart Later',
      viewDetails: 'View Details',
      dismiss: 'Dismiss',
      newUpdateAvail: 'New mint-helper update available',
      downloadInstall: 'Download and install',
      viewChangelog: 'View changelog',
      remindLater: 'Remind me later',
      channelLabel: 'Update Channel:',
      channelStable: 'Stable (Recommended)',
      channelBeta: 'Beta',
      channelDev: 'Development',
      installMethodLabel: 'Installation Format:',
      pkgName: 'Package Name',
      curVer: 'Current',
      newVer: 'New Version',
      size: 'Size',
      category: 'Category',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      installSelected: 'Install Selected Updates',
      reviewTitle: 'Review APT Updates Before Installation',
      reviewDesc: 'Please verify the changes that will be applied by the package manager.',
      confirmInstall: 'Authenticate & Install',
      cancel: 'Cancel',
      polkitTitle: 'Authentication Required',
      polkitDesc: 'Authentication is required to install system software and kernel updates.',
      authenticate: 'Authenticate',
      unusedRuntimesTitle: 'Unused Flatpak Runtimes Detected',
      cleanRuntimesBtn: 'Clean Unused Runtimes',
      exportCsv: 'Export CSV',
      exportJson: 'Export JSON',
      filterAll: 'All Sources',
      filterMint: 'mint-helper',
      filterApt: 'APT',
      filterFlatpak: 'Flatpak',
      rollbackBtn: 'Rollback to Previous AppImage',
      rollbackNotice: 'Previous version backup preserved at ~/.local/share/mint-helper/mint-helper.AppImage.bak',
    },
    de: {
      title: 'Update-Verwaltung',
      subtitle: 'Zentralisierte Paket- und Systemaktualisierung für Linux Mint & mint-helper',
      checkBtn: 'Nach Aktualisierungen suchen',
      checking: 'Prüfe...',
      lastCheck: 'Letzte Prüfung:',
      totalUpdates: 'Verfügbare Updates',
      secUpdates: 'Sicherheitsupdates',
      dlSize: 'Download-Größe',
      currentVer: 'Installierte Version',
      latestVer: 'Neueste Version',
      tabMintHelper: 'mint-helper Updates',
      tabApt: 'Linux System-Updates (APT)',
      tabFlatpak: 'Flatpak Updates',
      tabHistory: 'Update-Verlauf',
      rebootTitle: 'Systemneustart empfohlen',
      rebootDesc: 'Ein Kernel- oder Kernsystem-Update wurde installiert. Ein Neustart ist erforderlich.',
      restartLater: 'Später neu starten',
      viewDetails: 'Details anzeigen',
      dismiss: 'Ausblenden',
      newUpdateAvail: 'Neues mint-helper Update verfügbar',
      downloadInstall: 'Herunterladen & installieren',
      viewChangelog: 'Änderungsprotokoll',
      remindLater: 'Später erinnern',
      channelLabel: 'Aktualisierungskanal:',
      channelStable: 'Stabil (Empfohlen)',
      channelBeta: 'Beta',
      channelDev: 'Entwicklung',
      installMethodLabel: 'Installationsformat:',
      pkgName: 'Paketname',
      curVer: 'Aktuell',
      newVer: 'Neue Version',
      size: 'Größe',
      category: 'Kategorie',
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen',
      installSelected: 'Ausgewählte Updates installieren',
      reviewTitle: 'APT-Updates vor der Installation prüfen',
      reviewDesc: 'Bitte überprüfen Sie die durch den Paketmanager geplanten Änderungen.',
      confirmInstall: 'Legitimieren & Installieren',
      cancel: 'Abbrechen',
      polkitTitle: 'Legitimation erforderlich',
      polkitDesc: 'Zur Installation von Systempaketen und Kernel-Updates werden Administratorrechte benötigt.',
      authenticate: 'Legitimieren',
      unusedRuntimesTitle: 'Ungenutzte Flatpak-Laufzeiten erkannt',
      cleanRuntimesBtn: 'Ungenutzte Laufzeiten entfernen',
      exportCsv: 'CSV exportieren',
      exportJson: 'JSON exportieren',
      filterAll: 'Alle Quellen',
      filterMint: 'mint-helper',
      filterApt: 'APT',
      filterFlatpak: 'Flatpak',
      rollbackBtn: 'Auf vorheriges AppImage zurücksetzen',
      rollbackNotice: 'Sicherungskopie der vorherigen Version vorhanden: ~/.local/share/mint-helper/mint-helper.AppImage.bak',
    },
  }[lang];

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 flex flex-col h-full overflow-hidden">
      {/* Reboot Notification Banner */}
      {showRebootBanner && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-amber-400 shrink-0" size={20} />
            <div>
              <div className="text-sm font-semibold text-amber-200">{t.rebootTitle}</div>
              <div className="text-xs text-amber-300/80">{t.rebootDesc}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Reboot required reasons:\n${rebootReasons.join('\n')}`)}
              className="px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors"
            >
              {t.viewDetails}
            </button>
            <button
              onClick={() => setShowRebootBanner(false)}
              className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors"
            >
              {t.dismiss}
            </button>
          </div>
        </div>
      )}

      {/* Header & Title Bar */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="text-emerald-400" size={24} />
              <h1 className="text-2xl font-bold tracking-tight text-white">{t.title}</h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCheckAllUpdates}
              disabled={checkingMintHelper || checkingApt || checkingFlatpak}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={checkingMintHelper || checkingApt || checkingFlatpak ? 'animate-spin' : ''}
              />
              <span>
                {checkingMintHelper || checkingApt || checkingFlatpak ? t.checking : t.checkBtn}
              </span>
            </button>
          </div>
        </div>

        {/* Top Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.lastCheck}</span>
              <Clock size={13} className="text-zinc-400" />
            </div>
            <div className="text-sm font-semibold text-zinc-200 mt-1">{lastCheckStateDisplay(lastChecked, checkingApt || checkingFlatpak || checkingMintHelper)}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.totalUpdates}</span>
              <Package size={13} className="text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {totalAvailableUpdates}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.secUpdates}</span>
              <ShieldAlert size={13} className="text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">
              {securityUpdatesCount}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.dlSize}</span>
              <Download size={13} className="text-blue-400" />
            </div>
            <div className="text-sm font-semibold text-zinc-200 mt-1">
              ~{totalDownloadMb} MB
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.currentVer}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-mono font-semibold text-zinc-200 mt-1">
              v{installedMintHelperVersion}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[11px] text-zinc-400 font-medium flex items-center justify-between">
              <span>{t.latestVer}</span>
              {isMintHelperNewer ? (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono">
                  NEW
                </span>
              ) : (
                <CheckCircle2 size={13} className="text-emerald-400" />
              )}
            </div>
            <div className="text-sm font-mono font-semibold text-emerald-300 mt-1">
              v{mintHelperRelease.version}
            </div>
          </div>
        </div>

        {/* Source status indicators */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                checkingMintHelper ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            ></span>
            <span>GitHub Releases: {checkingMintHelper ? 'Checking...' : 'Ready'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                checkingApt ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            ></span>
            <span>APT Repositories: {checkingApt ? 'Checking...' : `${aptUpdates.length} updates`}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                checkingFlatpak ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
              }`}
            ></span>
            <span>Flatpak Remotes (Flathub): {checkingFlatpak ? 'Checking...' : `${flatpakUpdates.length} updates`}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-6">
        <button
          onClick={() => setActiveTab('mint-helper')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'mint-helper'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={14} />
          <span>{t.tabMintHelper}</span>
          {isMintHelperNewer && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('apt')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'apt'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers size={14} />
          <span>{t.tabApt}</span>
          {aptUpdates.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded-full font-mono">
              {aptUpdates.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('flatpak')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'flatpak'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package size={14} />
          <span>{t.tabFlatpak}</span>
          {flatpakUpdates.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded-full font-mono">
              {flatpakUpdates.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock size={14} />
          <span>{t.tabHistory}</span>
        </button>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ===================== TAB 1: MINT-HELPER UPDATES ===================== */}
        {activeTab === 'mint-helper' && (
          <div className="space-y-6 max-w-4xl">
            {/* Update Notification Banner */}
            {isMintHelperNewer && !remindLaterDismissed && (
              <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        <span>{t.newUpdateAvail}</span>
                        <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                          v{mintHelperRelease.version}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">
                        Released on {mintHelperRelease.releaseDate} • ~24.8 MB • Supported Architecture: x86_64, aarch64
                      </p>
                      <div className="mt-3 text-xs text-zinc-300">
                        <div className="font-semibold text-zinc-200 mb-1">Key Highlights:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                          {mintHelperRelease.changelog.slice(0, 3).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (installMethod === 'appimage') startAppImageUpdate();
                        else if (installMethod === 'flatpak') {
                          alert('Run "flatpak update org.linuxmint.mint-helper" to update Flatpak.');
                        } else {
                          alert('Run "sudo apt update && sudo apt install --only-upgrade mint-helper" to update APT.');
                        }
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>{t.downloadInstall}</span>
                    </button>
                    <button
                      onClick={() => setRemindLaterDismissed(true)}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors cursor-pointer"
                    >
                      {t.remindLater}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Channels & Installation Mode Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  {t.channelLabel}
                </label>
                <div className="flex items-center gap-2">
                  {(['stable', 'beta', 'dev'] as ReleaseChannel[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setChannel(c)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        channel === c
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {c === 'stable' ? t.channelStable : c.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-zinc-400 mt-2">
                  Stable channel only installs verified production releases from official GitHub Releases.
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  {t.installMethodLabel}
                </label>
                <div className="flex items-center gap-2">
                  {(['appimage', 'flatpak', 'apt'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setInstallMethod(m)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors uppercase cursor-pointer ${
                        installMethod === m
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-zinc-400 mt-2">
                  {installMethod === 'appimage' && 'Standalone AppImage format with atomic updates and rollback.'}
                  {installMethod === 'flatpak' && 'Sandboxed Flatpak package managed by system flatpak CLI.'}
                  {installMethod === 'apt' && 'Native Debian/Ubuntu package managed by APT repository.'}
                </div>
              </div>
            </div>

            {/* AppImage Atomic Updater Card */}
            {installMethod === 'appimage' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <HardDrive className="text-emerald-400" size={18} />
                    <h3 className="text-sm font-semibold text-zinc-200">
                      AppImage Updater & Cryptographic Verification
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    File: ~/.local/bin/mint-helper
                  </span>
                </div>

                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80 font-mono text-xs space-y-2 text-zinc-300">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">Target Artifact:</span>
                    <span className="text-emerald-400">{mintHelperRelease.appImageFilename}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">SHA256 Checksum:</span>
                    <span className="text-zinc-400 truncate max-w-[320px]">{mintHelperRelease.sha256}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">GPG Signature:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Validated (Linux Mint Release Key)
                    </span>
                  </div>
                </div>

                {/* Progress / Step UI */}
                {appImageStep !== 'idle' && (
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">
                        {appImageStep === 'downloading' && `Downloading update... (${appImageProgress}%)`}
                        {appImageStep === 'verifying_checksum' && 'Verifying SHA256 checksum against release manifest...'}
                        {appImageStep === 'verifying_sig' && 'Verifying GPG detached signature...'}
                        {appImageStep === 'backing_up' && 'Backing up current executable for rollback safety...'}
                        {appImageStep === 'installing' && 'Atomically moving new AppImage into place...'}
                        {appImageStep === 'ready' && 'Update successfully installed!'}
                      </span>
                      {appImageStep === 'ready' && (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}
                    </div>

                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{
                          width: `${
                            appImageStep === 'downloading'
                              ? appImageProgress
                              : appImageStep === 'ready'
                              ? 100
                              : 95
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Actions & Rollback */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    {appImageStep === 'idle' ? (
                      <button
                        onClick={startAppImageUpdate}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Update AppImage Now</span>
                      </button>
                    ) : appImageStep === 'ready' ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Up to date!
                      </span>
                    ) : null}
                  </div>

                  {hasBackup && (
                    <button
                      onClick={handleRollback}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 rounded text-xs font-medium flex items-center space-x-1.5 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>{t.rollbackBtn}</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400">{t.rollbackNotice}</div>
              </div>
            )}

            {/* Flatpak Updater Instructions */}
            {installMethod === 'flatpak' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Flatpak Package Management
                </h3>
                <p className="text-xs text-zinc-300">
                  When mint-helper is installed via Flatpak, updates are securely managed by the system Flatpak daemon.
                </p>
                <div className="bg-zinc-950 p-3 rounded font-mono text-xs text-emerald-400 border border-zinc-800">
                  flatpak update org.linuxmint.mint-helper
                </div>
              </div>
            )}

            {/* APT Updater Instructions */}
            {installMethod === 'apt' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-200">
                  APT Package Management
                </h3>
                <p className="text-xs text-zinc-300">
                  When mint-helper is installed as a native .deb package, update through standard APT:
                </p>
                <div className="bg-zinc-950 p-3 rounded font-mono text-xs text-emerald-400 border border-zinc-800">
                  sudo apt-get update && sudo apt-get install --only-upgrade mint-helper
                </div>
              </div>
            )}

            {/* Full Changelog */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-emerald-400" />
                <span>Release Notes for v{mintHelperRelease.version}</span>
              </h3>
              <div className="space-y-2 text-xs text-zinc-300">
                {mintHelperRelease.changelog.map((entry, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{entry}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: LINUX SYSTEM UPDATES (APT) ===================== */}
        {activeTab === 'apt' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  APT Package Manager Updates
                </h2>
                <p className="text-xs text-zinc-400">
                  {aptUpdates.length} update(s) available for system libraries, kernel, and software.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAllApt(true)}
                  className="px-2.5 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
                >
                  {t.selectAll}
                </button>
                <button
                  onClick={() => toggleAllApt(false)}
                  className="px-2.5 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
                >
                  {t.deselectAll}
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  disabled={aptUpdates.filter((a) => a.selected).length === 0}
                  className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded font-semibold transition-colors cursor-pointer"
                >
                  {t.installSelected} ({aptUpdates.filter((a) => a.selected).length})
                </button>
              </div>
            </div>

            {/* Categories */}
            {(['Kernel', 'Security', 'Recommended', 'Optional'] as const).map((cat) => {
              const catItems = aptUpdates.filter((p) => p.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-950/60 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {cat === 'Kernel' && <HardDrive className="text-amber-400" size={16} />}
                      {cat === 'Security' && <ShieldAlert className="text-rose-400" size={16} />}
                      {cat === 'Recommended' && <CheckCircle2 className="text-emerald-400" size={16} />}
                      {cat === 'Optional' && <Package className="text-blue-400" size={16} />}
                      <span className="text-xs font-semibold text-zinc-200">
                        {cat} Updates ({catItems.length})
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-zinc-800/60">
                    {catItems.map((pkg) => (
                      <div
                        key={pkg.packageName}
                        className={`p-3.5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors ${
                          pkg.selected ? 'bg-zinc-800/10' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={pkg.selected}
                            onChange={() => toggleAptSelect(pkg.packageName)}
                            className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-zinc-200 font-mono">
                                {pkg.packageName}
                              </span>
                              {pkg.isSecurity && (
                                <span className="text-[10px] font-medium bg-rose-950/80 text-rose-300 border border-rose-800/60 px-1.5 py-0.2 rounded">
                                  SECURITY
                                </span>
                              )}
                              {pkg.requiresReboot && (
                                <span className="text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1.5 py-0.2 rounded">
                                  REBOOT REQUIRED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                              {pkg.currentVersion} → <span className="text-emerald-400">{pkg.newVersion}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs font-mono text-zinc-400 shrink-0">
                          {Math.round((pkg.sizeBytes / 1024 / 1024) * 10) / 10} MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Install log if running */}
            {isInstallingApt && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Package Manager Active (pkexec apt-get dist-upgrade)...</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-300 space-y-1 max-h-48 overflow-y-auto border border-zinc-800">
                  {aptInstallLog.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: FLATPAK UPDATES ===================== */}
        {activeTab === 'flatpak' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Flatpak Application & Runtime Manager
                </h2>
                <p className="text-xs text-zinc-400">
                  Sandboxed applications from verified remotes.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAllFlatpak(true)}
                  className="px-2.5 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
                >
                  {t.selectAll}
                </button>
                <button
                  onClick={() => toggleAllFlatpak(false)}
                  className="px-2.5 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
                >
                  {t.deselectAll}
                </button>
                <button
                  onClick={handleUpdateFlatpaks}
                  disabled={flatpakUpdates.filter((f) => f.selected).length === 0}
                  className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded font-semibold transition-colors cursor-pointer"
                >
                  Update Selected ({flatpakUpdates.filter((f) => f.selected).length})
                </button>
              </div>
            </div>

            {/* Flatpak App List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              {flatpakUpdates.map((app) => (
                <div
                  key={app.appId}
                  className={`p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors ${
                    app.selected ? 'bg-zinc-800/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={app.selected}
                      onChange={() => toggleFlatpakSelect(app.appId)}
                      className="rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-zinc-100">{app.name}</span>
                        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded border border-zinc-700">
                          {app.remote}
                        </span>
                        {app.isRuntime && (
                          <span className="text-[10px] bg-blue-950/70 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded font-mono">
                            RUNTIME
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        {app.appId} • {app.currentVersion} → <span className="text-emerald-400">{app.newVersion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-zinc-400 shrink-0">
                    ~{Math.round((app.downloadSizeBytes / 1024 / 1024) * 10) / 10} MB
                  </div>
                </div>
              ))}
            </div>

            {/* Unused Runtimes Section */}
            {unusedRuntimes.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Trash2 className="text-amber-400" size={18} />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200">
                        {t.unusedRuntimesTitle}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Old runtime versions no longer referenced by any installed Flatpak application.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCleanUnusedRuntimes}
                    disabled={cleaningRuntimes}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>{cleaningRuntimes ? 'Cleaning...' : t.cleanRuntimesBtn}</span>
                  </button>
                </div>

                <div className="bg-zinc-950 p-3 rounded font-mono text-xs text-zinc-400 border border-zinc-800 space-y-1">
                  {unusedRuntimes.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{r}</span>
                      <span className="text-zinc-500">Unused (safe to remove)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: UPDATE HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Local Update Audit Log
                </h2>
                <p className="text-xs text-zinc-400">
                  Persistent local audit trail stored in ~/.config/mint-helper/update_history.json.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Filter */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5 text-xs">
                  {(['ALL', 'mint-helper', 'APT', 'Flatpak'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setHistoryFilter(f)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        historyFilter === f
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Exports */}
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  <Download size={13} />
                  <span>{t.exportCsv}</span>
                </button>
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  <Download size={13} />
                  <span>{t.exportJson}</span>
                </button>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 font-semibold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Package / Application</th>
                    <th className="p-3">Manager</th>
                    <th className="p-3">Version Change</th>
                    <th className="p-3">Operation</th>
                    <th className="p-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3 text-zinc-400 text-[11px]">{item.timestamp}</td>
                      <td className="p-3 font-semibold text-zinc-200">{item.packageName}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            item.manager === 'APT'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                              : item.manager === 'Flatpak'
                              ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          }`}
                        >
                          {item.manager}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">
                        {item.oldVersion} → <span className="text-emerald-400">{item.newVersion}</span>
                      </td>
                      <td className="p-3 text-zinc-300 capitalize">{item.operationType}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            item.result === 'SUCCESS'
                              ? 'bg-emerald-900/60 text-emerald-300'
                              : item.result === 'ROLLEDBACK'
                              ? 'bg-amber-900/60 text-amber-300'
                              : 'bg-rose-900/60 text-rose-300'
                          }`}
                        >
                          {item.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===================== REVIEW MODAL (BEFORE APT INSTALL) ===================== */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="text-amber-400" size={20} />
                <h3 className="text-base font-bold text-white">{t.reviewTitle}</h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-zinc-300">{t.reviewDesc}</p>

            <div className="space-y-3 max-h-60 overflow-y-auto text-xs bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span>Packages to Upgrade:</span>
                <span className="font-mono text-emerald-400">
                  {aptUpdates.filter((a) => a.selected).length}
                </span>
              </div>

              {/* Check if kernel updates */}
              {aptUpdates.some((a) => a.selected && a.isKernel) && (
                <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded text-amber-300 text-[11px] flex items-start space-x-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Kernel Upgrade:</strong> A system restart will be required after this transaction completes.
                  </span>
                </div>
              )}

              {/* Check if new dependencies */}
              {aptUpdates.some((a) => a.selected && a.newDependencies.length > 0) && (
                <div className="bg-blue-950/40 border border-blue-800/60 p-2.5 rounded text-blue-300 text-[11px]">
                  <strong>New Dependencies will be installed:</strong>
                  <ul className="list-disc list-inside mt-1 font-mono text-zinc-300">
                    {aptUpdates
                      .filter((a) => a.selected)
                      .flatMap((a) => a.newDependencies)
                      .map((dep, idx) => (
                        <li key={idx}>{dep}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Check if any packages will be removed */}
              {aptUpdates.some((a) => a.selected && a.willRemove.length > 0) ? (
                <div className="bg-rose-950/40 border border-rose-800/60 p-2.5 rounded text-rose-300 text-[11px]">
                  <strong>Packages to be Removed:</strong>
                  <ul className="list-disc list-inside mt-1 font-mono text-rose-200">
                    {aptUpdates
                      .filter((a) => a.selected)
                      .flatMap((a) => a.willRemove)
                      .map((pkg, idx) => (
                        <li key={idx}>{pkg}</li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  <span>No existing packages will be removed.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmAptInstallation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Lock size={13} />
                <span>{t.confirmInstall}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== POLICYKIT AUTH DIALOG SIMULATION ===================== */}
      {showPolkitDialog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-zinc-800 text-emerald-400 rounded-lg">
                <Lock size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t.polkitTitle}</h4>
                <p className="text-[11px] text-zinc-400">PolicyKit / pkexec</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">{t.polkitDesc}</p>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 space-y-2">
              <div className="text-[11px] text-zinc-400">User: linuxmint (administrator)</div>
              <input
                type="password"
                placeholder="Enter password..."
                defaultValue="••••••••"
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowPolkitDialog(false)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-semibold"
              >
                {t.cancel}
              </button>
              <button
                onClick={handlePolkitAuthenticate}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer"
              >
                {t.authenticate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function lastCheckStateDisplay(lastChecked: string, isChecking: boolean) {
  if (isChecking) return 'Checking...';
  return lastChecked;
}
