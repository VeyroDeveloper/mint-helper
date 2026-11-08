import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Shield,
  Layers,
  HardDrive,
  Globe,
  Terminal,
  FileText,
  Sliders,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  SetupProfile,
  InstallationPlan,
  PlanItem,
  EVERYDAY_PROFILE,
  DEVELOPER_PROFILE,
  GAMING_PROFILE,
  CREATIVE_PROFILE,
  generateInstallationPlan,
} from '../../lib/profile_engine';

interface WizardViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const WizardView: React.FC<WizardViewProps> = ({ lang, onLogAction }) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeProfile, setActiveProfile] = useState<SetupProfile>({ ...EVERYDAY_PROFILE });
  const [profileType, setProfileType] = useState<'everyday' | 'developer' | 'gaming' | 'creative' | 'custom'>('everyday');

  // Plan state
  const [plan, setPlan] = useState<InstallationPlan | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [execProgress, setExecProgress] = useState<number>(0);
  const [currentExecutingIndex, setCurrentExecutingIndex] = useState<number>(-1);
  const [execLogs, setExecLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Localization dictionary
  const t = {
    en: {
      title: 'Post-Installation Setup Wizard',
      subtitle: 'Prepare and configure your Linux Mint installation in easy guided steps.',
      step1: '1. Welcome & Mode',
      step2: '2. Browsers',
      step3: '3. Office & Fonts',
      step4: '4. Multimedia Codecs',
      step5: '5. Firewall & Security',
      step6: '6. Desktop Preferences',
      step7: '7. Developer Tools',
      step8: '8. Recommended Apps',
      planReview: 'Review Installation Plan',
      generatePlan: 'Generate Reviewable Plan',
      executePlan: 'Execute Confirmed Changes',
      cancel: 'Cancel / Abort',
      back: 'Back',
      next: 'Next Step',
      presetHeader: 'Choose a Setup Profile or Customize Manually',
      presetEveryday: 'Everyday User',
      presetDev: 'Developer',
      presetGaming: 'Gaming',
      presetCreative: 'Creative',
      presetCustom: 'Custom Selection',
      browserWarning: 'Notice: Existing browser profile data (~/.mozilla/firefox) will NEVER be deleted.',
      installNotice: 'All package downloads use official Linux Mint mirrors and verified Flathub runtimes.',
      planSubtitle: 'Review all operations divided into distinct safety categories before applying changes.',
      installCategory: 'INSTALL (New packages to download and setup)',
      removeCategory: 'REMOVE (Software selected for removal)',
      configCategory: 'CONFIGURE (System configurations and desktop settings)',
      keepCategory: 'KEEP (Existing applications & personal profiles protected)',
      cleanupCategory: 'OPTIONAL CLEANUP (Safe cache purges)',
    },
    de: {
      title: 'Post-Installations Einrichtungs-Assistent',
      subtitle: 'Konfigurieren Sie Ihr Linux Mint System in geführten Schritten.',
      step1: '1. Willkommen & Modus',
      step2: '2. Browser',
      step3: '3. Office & Schriftarten',
      step4: '4. Multimedia-Codecs',
      step5: '5. Firewall & Sicherheit',
      step6: '6. Desktop-Einstellungen',
      step7: '7. Entwickler-Werkzeuge',
      step8: '8. Empfohlene Apps',
      planReview: 'Installationsplan überprüfen',
      generatePlan: 'Überprüfbaren Plan erstellen',
      executePlan: 'Bestätigte Änderungen anwenden',
      cancel: 'Abbrechen',
      back: 'Zurück',
      next: 'Nächster Schritt',
      presetHeader: 'Wählen Sie ein Profil oder passen Sie manuell an',
      presetEveryday: 'Alltäglicher Nutzer',
      presetDev: 'Entwickler',
      presetGaming: 'Gaming',
      presetCreative: 'Kreativ',
      presetCustom: 'Benutzerdefiniert',
      browserWarning: 'Hinweis: Vorhandene Browserprofile (~/.mozilla/firefox) werden NIEMALS gelöscht.',
      installNotice: 'Alle Paketquellen stammen aus offiziellen Mint-Spiegeln und Flathub.',
      planSubtitle: 'Überprüfen Sie alle Aktionen nach Sicherheitskategorien vor der Ausführung.',
      installCategory: 'INSTALLIEREN (Neue Pakete herunterladen & einrichten)',
      removeCategory: 'ENTFERNEN (Software zur Deinstallation)',
      configCategory: 'KONFIGURIEREN (Systemeinstellungen & Desktop)',
      keepCategory: 'BEIBEHALTEN (Bestehende Software & Profile geschützt)',
      cleanupCategory: 'OPTIONALE BEREINIGUNG (Sichere Cache-Leerung)',
    },
  }[lang];

  // Profile presets selector
  const selectPreset = (type: 'everyday' | 'developer' | 'gaming' | 'creative' | 'custom') => {
    setProfileType(type);
    if (type === 'everyday') setActiveProfile({ ...EVERYDAY_PROFILE });
    if (type === 'developer') setActiveProfile({ ...DEVELOPER_PROFILE });
    if (type === 'gaming') setActiveProfile({ ...GAMING_PROFILE });
    if (type === 'creative') setActiveProfile({ ...CREATIVE_PROFILE });
    if (type === 'custom') {
      setActiveProfile((prev) => ({ ...prev, name: 'Custom Setup' }));
    }
  };

  // Generate plan
  const handleGeneratePlan = () => {
    const generated = generateInstallationPlan(activeProfile);
    setPlan(generated);
    setCurrentStep(9); // Plan review step
  };

  // Execute plan simulation
  const handleExecutePlan = () => {
    if (!plan) return;
    setIsExecuting(true);
    setCurrentExecutingIndex(0);
    setExecProgress(0);
    setExecLogs([`[INFO] Starting plan execution: ${plan.name}`, `[INFO] Initializing PolicyKit privilege token...`]);

    const items = plan.items.filter((i) => i.enabled);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < items.length) {
        const item = items[idx];
        setCurrentExecutingIndex(idx);
        setExecProgress(Math.round(((idx + 1) / items.length) * 100));
        setExecLogs((prev) => [
          ...prev,
          `[TASK ${idx + 1}/${items.length}] ${item.kind}: ${item.title}`,
          `$ ${item.command}`,
          `-> OK (Operation completed cleanly without errors)`,
        ]);
        idx++;
      } else {
        clearInterval(interval);
        setIsExecuting(false);
        setIsCompleted(true);
        setExecLogs((prev) => [
          ...prev,
          `[SUCCESS] All ${items.length} tasks completed successfully.`,
          `[INFO] Linux Mint system is fully configured and ready!`,
        ]);
        onLogAction?.('Post-Installation Wizard Applied', 'Wizard', 'SUCCESS', `Successfully executed ${items.length} plan actions for profile ${activeProfile.name}`);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Step indicator breadcrumbs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => {
            const isCurrent = currentStep === step;
            const isDone = currentStep > step;
            return (
              <button
                key={step}
                onClick={() => !isExecuting && setCurrentStep(step)}
                className={`px-2 py-1 rounded transition-colors ${
                  isCurrent
                    ? 'bg-emerald-600 text-white font-bold'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {step === 9 ? 'Review' : `S${step}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main step container */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 shadow-sm space-y-5">
        {/* Step 1: Welcome & Setup Profiles */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step1}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Choose an automated setup profile or walk through each step manually.
              </p>
            </div>

            {/* Profile cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'everyday' as const,
                  title: t.presetEveryday,
                  desc: 'Browsers, codecs, fonts, office tabbed layout & firewall.',
                  icon: <Globe className="text-emerald-400" size={20} />,
                },
                {
                  id: 'developer' as const,
                  title: t.presetDev,
                  desc: 'Git, Rust, Python, Node.js, Build Essentials, VSCodium.',
                  icon: <Terminal className="text-blue-400" size={20} />,
                },
                {
                  id: 'gaming' as const,
                  title: t.presetGaming,
                  desc: 'Steam with Proton, Heroic Launcher, Lutris, Bottles.',
                  icon: <Layers className="text-amber-400" size={20} />,
                },
                {
                  id: 'creative' as const,
                  title: t.presetCreative,
                  desc: 'GIMP, Blender 3D, Krita, Inkscape, OBS Studio.',
                  icon: <Sparkles className="text-purple-400" size={20} />,
                },
              ].map((p) => {
                const isSelected = profileType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(p.id)}
                    className={`p-4 rounded-lg border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 text-zinc-100 shadow-sm'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        {p.icon}
                        {isSelected && <Check className="text-emerald-400" size={16} />}
                      </div>
                      <div className="font-semibold text-sm text-zinc-200">{p.title}</div>
                      <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
              <Shield size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200">Non-Destructive Principle: </span>
                Selecting a profile creates a reviewable plan. No files or system configurations are altered until you inspect and confirm.
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Browsers */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step2}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select your primary web browser. Firefox is pre-installed on Linux Mint.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                {
                  id: 'org.mozilla.firefox',
                  name: 'Mozilla Firefox (Recommended)',
                  desc: 'Pre-installed on Linux Mint. Recommends official uBlock Origin extension.',
                  source: 'APT (Official Mint partner build)',
                  installed: true,
                },
                {
                  id: 'io.gitlab.librewolf-community',
                  name: 'LibreWolf',
                  desc: 'Privacy-focused Firefox fork with telemetry disabled and built-in privacy protection.',
                  source: 'Flatpak (Flathub)',
                  installed: false,
                },
                {
                  id: 'com.vivaldi.Vivaldi',
                  name: 'Vivaldi Browser',
                  desc: 'Power-user Chromium browser with sidebar notes, tab groups, and ad blocking.',
                  source: 'Flatpak (Flathub)',
                  installed: false,
                },
                {
                  id: 'org.chromium.Chromium',
                  name: 'Chromium Browser',
                  desc: 'Open-source upstream browser engine without Google branding.',
                  source: 'Flatpak (Flathub)',
                  installed: false,
                },
              ].map((b) => {
                const isSelected = activeProfile.selected_browser === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() =>
                      setActiveProfile((prev) => ({ ...prev, selected_browser: b.id }))
                    }
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">{b.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                        {b.source}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">{b.desc}</p>
                    {b.installed && (
                      <div className="mt-2 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Currently Installed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800/80 text-xs text-zinc-300 flex items-start space-x-2.5">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200">Profile Safety Guarantee: </span>
                {t.browserWarning} All bookmarks, passwords, and history are kept isolated and safe.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Office & Fonts */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step3}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Configure LibreOffice interface and install standard compatibility fonts.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start space-x-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={activeProfile.libreoffice_tabbed}
                  onChange={(e) =>
                    setActiveProfile((prev) => ({
                      ...prev,
                      libreoffice_tabbed: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-zinc-200">
                    Enable LibreOffice Tabbed (Notebookbar) Interface
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    Configures LibreOffice Writer and Calc with the modern ribbon-style toolbar familiar to Microsoft Office users. Completely reversible anytime.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={activeProfile.install_fonts}
                  onChange={(e) =>
                    setActiveProfile((prev) => ({
                      ...prev,
                      install_fonts: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-zinc-200">
                    Install Microsoft TrueType Core Fonts (ttf-mscorefonts-installer)
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    Installs Arial, Times New Roman, Courier New, and Georgia legally via official Debian/Ubuntu EULA downloaders for perfect document layout rendering.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Multimedia Codecs */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step4}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Install official Linux Mint audio and video codecs for full media playback.
              </p>
            </div>

            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800 text-xs space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeProfile.install_codecs}
                  onChange={(e) =>
                    setActiveProfile((prev) => ({
                      ...prev,
                      install_codecs: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-zinc-200 text-sm">
                    Install Multimedia Codecs (mint-meta-codecs)
                  </div>
                  <div className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Installs official GStreamer plugins, MP4/H.264/AAC playback support, and DVD decryption libraries from verified Linux Mint repositories.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Security */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step5}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Fortify your operating system with safe defaults.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start space-x-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={activeProfile.enable_firewall}
                  onChange={(e) =>
                    setActiveProfile((prev) => ({
                      ...prev,
                      enable_firewall: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-zinc-200">
                    Enable UFW Firewall with Safe Default Rules
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    Denies all unsolicited incoming connections while permitting outgoing internet traffic. Essential for laptop Wi-Fi safety.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-zinc-950/40 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={activeProfile.auto_security_updates}
                  onChange={(e) =>
                    setActiveProfile((prev) => ({
                      ...prev,
                      auto_security_updates: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-zinc-200">
                    Enable Automatic Daily Security Updates (unattended-upgrades)
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    Automatically fetches and applies critical Linux Mint security CVE patches without interrupting your desktop session.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Preferences */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step6}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Desktop association and startup service configurations.
              </p>
            </div>

            <div className="p-4 bg-zinc-950/40 border border-zinc-800 rounded-lg space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-300">Default Web Browser</span>
                <span className="text-emerald-400 font-mono">
                  {activeProfile.selected_browser === 'org.mozilla.firefox' ? 'Firefox' : 'LibreWolf'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-300">Default Mail Client</span>
                <span className="text-zinc-300 font-mono">Thunderbird Mail</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-300">Default Office Suite</span>
                <span className="text-zinc-300 font-mono">LibreOffice 24.8</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Developer Tools */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step7}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select developer compilers, version control, and tooling packages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'git', name: 'Git Version Control', desc: 'Distributed revision control system' },
                { id: 'build-essential', name: 'Build Essentials', desc: 'gcc, g++, make, and libc development headers' },
                { id: 'rust-toolchain', name: 'Rust & Cargo', desc: 'Modern memory-safe systems programming language' },
                { id: 'python3-pip', name: 'Python 3 & Pip', desc: 'Python programming language and virtualenv toolchain' },
                { id: 'nodejs', name: 'Node.js & NPM', desc: 'JavaScript runtime for server and frontend development' },
                { id: 'com.vscodium.codium', name: 'VSCodium Editor', desc: 'Open-source code editor with zero telemetry' },
                { id: 'it.mijorus.gearlever', name: 'Gear Lever', desc: 'AppImage desktop integration and update manager' },
              ].map((tool) => {
                const checked = activeProfile.dev_tools.includes(tool.id);
                return (
                  <label
                    key={tool.id}
                    className={`p-3 rounded-lg border cursor-pointer flex items-start space-x-3 transition ${
                      checked
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActiveProfile((prev) => ({ ...prev, dev_tools: [...prev.dev_tools, tool.id] }));
                        } else {
                          setActiveProfile((prev) => ({
                            ...prev,
                            dev_tools: prev.dev_tools.filter((x) => x !== tool.id),
                          }));
                        }
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-zinc-200">{tool.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{tool.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 8: Recommended Applications */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-100">{t.step8}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select curated desktop applications from Flathub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { id: 'org.videolan.VLC', name: 'VLC Media Player', cat: 'Multimedia' },
                { id: 'com.obsproject.Studio', name: 'OBS Studio', cat: 'Multimedia' },
                { id: 'org.gimp.GIMP', name: 'GIMP Image Editor', cat: 'Graphics' },
                { id: 'org.blender.Blender', name: 'Blender 3D Suite', cat: 'Graphics' },
                { id: 'com.valvesoftware.Steam', name: 'Steam Gaming', cat: 'Gaming' },
                { id: 'com.github.tchx84.Flatseal', name: 'Flatseal Permissions', cat: 'Utilities' },
              ].map((app) => {
                const checked = activeProfile.recommended_apps.includes(app.id);
                return (
                  <label
                    key={app.id}
                    className={`p-3 rounded-lg border cursor-pointer flex items-start space-x-2.5 transition ${
                      checked
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setActiveProfile((prev) => ({
                            ...prev,
                            recommended_apps: [...prev.recommended_apps, app.id],
                          }));
                        } else {
                          setActiveProfile((prev) => ({
                            ...prev,
                            recommended_apps: prev.recommended_apps.filter((x) => x !== app.id),
                          }));
                        }
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-zinc-200">{app.name}</div>
                      <div className="text-[10px] text-zinc-400">{app.cat}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 9: Review Plan & Execution Screen */}
        {currentStep === 9 && plan && (
          <div className="space-y-5">
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-base font-bold text-zinc-100">{t.planReview}</h2>
                <p className="text-xs text-zinc-400 mt-1">{t.planSubtitle}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded">
                {plan.items.length} Planned Actions
              </span>
            </div>

            {/* Execution status & progress */}
            {isExecuting && (
              <div className="bg-zinc-950 p-4 rounded-lg border border-emerald-500/50 space-y-3">
                <div className="flex justify-between text-xs text-zinc-200 font-medium">
                  <span className="flex items-center gap-2">
                    <RotateCcw className="animate-spin text-emerald-400" size={14} />
                    Executing setup queue...
                  </span>
                  <span className="font-mono text-emerald-400">{execProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${execProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-lg flex items-center space-x-3 text-xs text-emerald-200">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Post-Installation Completed Successfully!</div>
                  <div className="text-[11px] text-emerald-300/80 mt-0.5">
                    Your Linux Mint system has been configured with all verified selections.
                  </div>
                </div>
              </div>
            )}

            {/* Partitioned List of Plan Items */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {['INSTALL', 'REMOVE', 'CONFIGURE', 'KEEP', 'OPTIONAL CLEANUP'].map((kind) => {
                const groupItems = plan.items.filter((item) => item.kind === kind);
                if (groupItems.length === 0) return null;

                const headerLabel =
                  kind === 'INSTALL'
                    ? t.installCategory
                    : kind === 'REMOVE'
                    ? t.removeCategory
                    : kind === 'CONFIGURE'
                    ? t.configCategory
                    : kind === 'KEEP'
                    ? t.keepCategory
                    : t.cleanupCategory;

                return (
                  <div key={kind} className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
                      {headerLabel}
                    </div>
                    {groupItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-zinc-950/60 border border-zinc-800 rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200">{item.title}</span>
                          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {item.permissionsRequired}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px]">{item.description}</p>
                        <div className="pt-1 text-[10px] font-mono text-zinc-500 truncate">
                          Command: {item.command}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Execution Logs Terminal */}
            {execLogs.length > 0 && (
              <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-3 space-y-1.5">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <Terminal size={12} className="text-emerald-400" />
                  Terminal Execution Audit
                </div>
                <div className="font-mono text-[11px] text-zinc-300 bg-black/50 p-2.5 rounded max-h-36 overflow-y-auto space-y-1">
                  {execLogs.map((l, i) => (
                    <div
                      key={i}
                      className={
                        l.startsWith('$')
                          ? 'text-emerald-400 font-semibold'
                          : l.includes('SUCCESS')
                          ? 'text-emerald-300 font-bold'
                          : 'text-zinc-400'
                      }
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs">
          {currentStep > 1 && !isExecuting && (
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition font-medium"
            >
              <ArrowLeft size={13} />
              <span>{t.back}</span>
            </button>
          )}

          <div className="flex items-center space-x-3 ml-auto">
            {currentStep < 8 && (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex items-center space-x-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow-sm"
              >
                <span>{t.next}</span>
                <ArrowRight size={13} />
              </button>
            )}

            {currentStep === 8 && (
              <button
                onClick={handleGeneratePlan}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow-sm"
              >
                <Sparkles size={14} />
                <span>{t.generatePlan}</span>
              </button>
            )}

            {currentStep === 9 && !isCompleted && (
              <button
                onClick={handleExecutePlan}
                disabled={isExecuting}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow-sm disabled:opacity-50"
              >
                <Play size={13} />
                <span>{t.executePlan}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
