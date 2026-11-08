/**
 * Pure logic engine for mint-helper profiles, plan generation, and validation.
 * Decoupled from UI components for deterministic unit testing.
 */

export type OperationKind = 'INSTALL' | 'REMOVE' | 'CONFIGURE' | 'KEEP' | 'OPTIONAL CLEANUP';
export type PackageSource = 'Flatpak' | 'APT' | 'AppImage' | 'SystemSetting';

export interface PlanItem {
  id: string;
  title: string;
  kind: OperationKind;
  source: PackageSource;
  description: string;
  reason: string;
  permissionsRequired: string;
  reversible: boolean;
  enabled: boolean;
  command: string;
}

export interface SetupProfile {
  schema_version: string;
  app_id: string;
  name: string;
  description: string;
  selected_browser: string;
  install_codecs: boolean;
  install_fonts: boolean;
  enable_firewall: boolean;
  auto_security_updates: boolean;
  libreoffice_tabbed: boolean;
  dev_tools: string[];
  recommended_apps: string[];
}

export interface InstallationPlan {
  name: string;
  createdAt: string;
  items: PlanItem[];
}

export const SCHEMA_VERSION = '1.0';
export const APP_ID = 'mint-helper';

export const EVERYDAY_PROFILE: SetupProfile = {
  schema_version: SCHEMA_VERSION,
  app_id: APP_ID,
  name: 'Everyday User',
  description: 'Essential workstation setup: secure browsing, office suite, multimedia codecs, and firewall.',
  selected_browser: 'org.mozilla.firefox',
  install_codecs: true,
  install_fonts: true,
  enable_firewall: true,
  auto_security_updates: true,
  libreoffice_tabbed: true,
  dev_tools: [],
  recommended_apps: ['org.videolan.VLC', 'com.github.tchx84.Flatseal'],
};

export const DEVELOPER_PROFILE: SetupProfile = {
  schema_version: SCHEMA_VERSION,
  app_id: APP_ID,
  name: 'Developer',
  description: 'Full developer workstation: Git, Rust, Python, Node.js, Build Essentials, and VSCodium.',
  selected_browser: 'org.mozilla.firefox',
  install_codecs: true,
  install_fonts: true,
  enable_firewall: true,
  auto_security_updates: true,
  libreoffice_tabbed: false,
  dev_tools: ['git', 'build-essential', 'rust-toolchain', 'python3-pip', 'nodejs', 'com.vscodium.codium', 'it.mijorus.gearlever'],
  recommended_apps: ['com.github.tchx84.Flatseal'],
};

export const GAMING_PROFILE: SetupProfile = {
  schema_version: SCHEMA_VERSION,
  app_id: APP_ID,
  name: 'Gaming',
  description: 'Optimized for gaming: Steam with Proton, Heroic Games Launcher, Lutris, and Bottles.',
  selected_browser: 'org.mozilla.firefox',
  install_codecs: true,
  install_fonts: true,
  enable_firewall: true,
  auto_security_updates: true,
  libreoffice_tabbed: false,
  dev_tools: [],
  recommended_apps: [
    'com.valvesoftware.Steam',
    'com.heroicgameslauncher.hgl',
    'net.lutris.Lutris',
    'com.usebottles.bottles',
    'com.github.tchx84.Flatseal',
  ],
};

export const CREATIVE_PROFILE: SetupProfile = {
  schema_version: SCHEMA_VERSION,
  app_id: APP_ID,
  name: 'Creative',
  description: 'Content creation suite: GIMP, Blender 3D, Krita painting, OBS Studio, and Kdenlive.',
  selected_browser: 'org.mozilla.firefox',
  install_codecs: true,
  install_fonts: true,
  enable_firewall: true,
  auto_security_updates: true,
  libreoffice_tabbed: true,
  dev_tools: [],
  recommended_apps: [
    'org.gimp.GIMP',
    'org.blender.Blender',
    'org.kde.krita',
    'org.inkscape.Inkscape',
    'com.obsproject.Studio',
    'org.kde.kdenlive',
    'org.audacityteam.Audacity',
  ],
};

/**
 * Validates a profile JSON string or object
 */
export function validateProfile(input: unknown): { valid: boolean; profile?: SetupProfile; error?: string } {
  try {
    let parsed: any = input;
    if (typeof input === 'string') {
      parsed = JSON.parse(input);
    }
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Input must be a valid JSON object' };
    }
    if (parsed.schema_version !== SCHEMA_VERSION) {
      return { valid: false, error: `Invalid schema version "${parsed.schema_version}" (expected "${SCHEMA_VERSION}")` };
    }
    if (parsed.app_id !== APP_ID) {
      return { valid: false, error: `Invalid app_id "${parsed.app_id}" (expected "${APP_ID}")` };
    }
    if (!parsed.name || typeof parsed.name !== 'string') {
      return { valid: false, error: 'Profile must have a valid name string' };
    }
    return { valid: true, profile: parsed as SetupProfile };
  } catch (err: any) {
    return { valid: false, error: err.message || 'JSON parse error' };
  }
}

/**
 * Checks if a path is strictly protected against automated deletion
 */
export function isProtectedPath(path: string): boolean {
  const norm = path.toLowerCase();
  return (
    norm.includes('.mozilla/firefox') ||
    norm.includes('.thunderbird') ||
    norm.includes('.ssh') ||
    norm.includes('.gnupg') ||
    norm.includes('/documents') ||
    norm.includes('/pictures')
  );
}

/**
 * Generates an immutable, reviewable Installation Plan
 */
export function generateInstallationPlan(profile: SetupProfile): InstallationPlan {
  const items: PlanItem[] = [];

  // Browser handling
  if (profile.selected_browser === 'org.mozilla.firefox') {
    items.push({
      id: 'keep-firefox',
      title: 'Keep Mozilla Firefox Default Browser',
      kind: 'KEEP',
      source: 'APT',
      description: 'Preserve preinstalled Firefox browser and all existing user profile history/bookmarks.',
      reason: 'Standard recommended web browser in Linux Mint.',
      permissionsRequired: 'None',
      reversible: true,
      enabled: true,
      command: '# No action required; Firefox and profile preserved',
    });
  } else if (profile.selected_browser === 'io.gitlab.librewolf-community') {
    items.push({
      id: 'install-librewolf',
      title: 'Install LibreWolf Browser',
      kind: 'INSTALL',
      source: 'Flatpak',
      description: 'Install privacy-hardened LibreWolf browser via Flathub.',
      reason: 'User selected privacy-focused browser alternative.',
      permissionsRequired: 'User (Flatpak)',
      reversible: true,
      enabled: true,
      command: 'flatpak install -y flathub io.gitlab.librewolf-community',
    });
  }

  // Codecs
  if (profile.install_codecs) {
    items.push({
      id: 'install-codecs',
      title: 'Install Multimedia Codecs (mint-meta-codecs)',
      kind: 'INSTALL',
      source: 'APT',
      description: 'Install official Linux Mint audio and video codecs for MP4, MP3, AAC, and DVD playback.',
      reason: 'Enables playback of patented media formats in system players.',
      permissionsRequired: 'Root (pkexec apt)',
      reversible: true,
      enabled: true,
      command: 'pkexec apt install -y mint-meta-codecs',
    });
  }

  // Fonts
  if (profile.install_fonts) {
    items.push({
      id: 'install-fonts',
      title: 'Install TrueType Core Fonts (Arial, Times New Roman)',
      kind: 'INSTALL',
      source: 'APT',
      description: 'Install Microsoft TrueType core fonts via ttf-mscorefonts-installer legally.',
      reason: 'Ensures fidelity when opening documents created in Microsoft Office.',
      permissionsRequired: 'Root (pkexec apt)',
      reversible: true,
      enabled: true,
      command:
        'echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | pkexec debconf-set-selections && pkexec apt install -y ttf-mscorefonts-installer',
    });
  }

  // LibreOffice Tabbed
  if (profile.libreoffice_tabbed) {
    items.push({
      id: 'config-libreoffice-tabbed',
      title: 'Configure LibreOffice Ribbon-style Tabbed Toolbar',
      kind: 'CONFIGURE',
      source: 'SystemSetting',
      description: 'Enable the notebookbar layout in LibreOffice Writer and Calc for familiar ribbon navigation.',
      reason: 'Provides a familiar user experience for users migrating from Microsoft Office.',
      permissionsRequired: 'User (dconf / registrymodifications.xcu)',
      reversible: true,
      enabled: true,
      command: '# Configure LibreOffice User Interface layout to Notebookbar',
    });
  }

  // Firewall
  if (profile.enable_firewall) {
    items.push({
      id: 'config-firewall',
      title: 'Enable UFW Firewall with Safe Default Rules',
      kind: 'CONFIGURE',
      source: 'SystemSetting',
      description: 'Activate Uncomplicated Firewall: block all unsolicited incoming connections, allow outgoing.',
      reason: 'Crucial perimeter security for laptops on public Wi-Fi or home networks.',
      permissionsRequired: 'Root (pkexec ufw)',
      reversible: true,
      enabled: true,
      command: 'pkexec ufw default deny incoming && pkexec ufw default allow outgoing && pkexec ufw enable',
    });
  }

  // Automatic Security Updates
  if (profile.auto_security_updates) {
    items.push({
      id: 'config-auto-updates',
      title: 'Enable Automatic Daily Security Updates',
      kind: 'CONFIGURE',
      source: 'APT',
      description: 'Configure unattended-upgrades to automatically apply critical security patches.',
      reason: 'Keeps Linux Mint protected against zero-day vulnerabilities in the background.',
      permissionsRequired: 'Root (pkexec apt)',
      reversible: true,
      enabled: true,
      command: 'pkexec apt install -y unattended-upgrades && pkexec dpkg-reconfigure -plow unattended-upgrades',
    });
  }

  // Dev tools
  for (const tool of profile.dev_tools) {
    let title = `Install ${tool}`;
    let cmd = `pkexec apt install -y ${tool}`;
    let src: PackageSource = 'APT';

    if (tool === 'git') {
      title = 'Install Git Version Control';
      cmd = 'pkexec apt install -y git';
    } else if (tool === 'build-essential') {
      title = 'Install Build Essentials (gcc, g++, make)';
      cmd = 'pkexec apt install -y build-essential';
    } else if (tool === 'rust-toolchain') {
      title = 'Install Rust & Cargo Toolchain';
      cmd = "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y";
    } else if (tool === 'com.vscodium.codium') {
      title = 'Install VSCodium Open Source Editor';
      cmd = 'flatpak install -y flathub com.vscodium.codium';
      src = 'Flatpak';
    } else if (tool === 'it.mijorus.gearlever') {
      title = 'Install Gear Lever AppImage Manager';
      cmd = 'flatpak install -y flathub it.mijorus.gearlever';
      src = 'Flatpak';
    }

    items.push({
      id: `dev-${tool}`,
      title,
      kind: 'INSTALL',
      source: src,
      description: `Developer toolchain component '${tool}'.`,
      reason: 'Selected as part of developer workstation profile.',
      permissionsRequired: src === 'Flatpak' ? 'User (Flatpak)' : 'Root (pkexec apt)',
      reversible: true,
      enabled: true,
      command: cmd,
    });
  }

  // Recommended apps
  for (const app of profile.recommended_apps) {
    items.push({
      id: `app-${app}`,
      title: `Install Flatpak: ${app}`,
      kind: 'INSTALL',
      source: 'Flatpak',
      description: `Verified Flathub application package '${app}'.`,
      reason: 'Selected from curated applications list.',
      permissionsRequired: 'User (Flatpak)',
      reversible: true,
      enabled: true,
      command: `flatpak install -y flathub ${app}`,
    });
  }

  // Optional Cleanup
  items.push({
    id: 'clean-apt-cache',
    title: 'Clean Obsolete Package Archives (apt clean)',
    kind: 'OPTIONAL CLEANUP',
    source: 'APT',
    description: 'Remove obsolete .deb installer files cached in /var/cache/apt/archives to free disk space.',
    reason: 'Safe maintenance operation; downloaded deb files are no longer required after install.',
    permissionsRequired: 'Root (pkexec apt-get clean)',
    reversible: false,
    enabled: true,
    command: 'pkexec apt-get clean && pkexec apt-get autoremove -y',
  });

  return {
    name: `Setup Plan (${profile.name})`,
    createdAt: new Date().toISOString(),
    items,
  };
}
