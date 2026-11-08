//! Profile presets, JSON schema validation, and installation plan generation

use crate::models::{InstallationPlan, OperationKind, PackageSource, PlanItem, SetupProfile};
use chrono::Utc;

pub struct ProfileService;

impl ProfileService {
    pub const SCHEMA_VERSION: &'static str = "1.0";

    pub fn preset_everyday_user() -> SetupProfile {
        SetupProfile {
            schema_version: Self::SCHEMA_VERSION.to_string(),
            app_id: "mint-helper".to_string(),
            name: "Everyday User".to_string(),
            description: "Essential workstation setup: secure browsing, office suite, multimedia codecs, and firewall.".to_string(),
            selected_browser: "org.mozilla.firefox".to_string(),
            install_codecs: true,
            install_fonts: true,
            enable_firewall: true,
            auto_security_updates: true,
            libreoffice_tabbed: true,
            dev_tools: vec![],
            recommended_apps: vec![
                "org.videolan.VLC".to_string(),
                "com.github.tchx84.Flatseal".to_string(),
            ],
        }
    }

    pub fn preset_developer() -> SetupProfile {
        SetupProfile {
            schema_version: Self::SCHEMA_VERSION.to_string(),
            app_id: "mint-helper".to_string(),
            name: "Developer".to_string(),
            description: "Full developer workstation: Git, Rust, Python, Node.js, Build Essentials, and VSCodium.".to_string(),
            selected_browser: "org.mozilla.firefox".to_string(),
            install_codecs: true,
            install_fonts: true,
            enable_firewall: true,
            auto_security_updates: true,
            libreoffice_tabbed: false,
            dev_tools: vec![
                "git".to_string(),
                "build-essential".to_string(),
                "rust-toolchain".to_string(),
                "python3-pip".to_string(),
                "nodejs".to_string(),
                "com.vscodium.codium".to_string(),
                "it.mijorus.gearlever".to_string(),
            ],
            recommended_apps: vec![
                "com.github.tchx84.Flatseal".to_string(),
            ],
        }
    }

    pub fn preset_gaming() -> SetupProfile {
        SetupProfile {
            schema_version: Self::SCHEMA_VERSION.to_string(),
            app_id: "mint-helper".to_string(),
            name: "Gaming".to_string(),
            description: "Optimized for gaming: Steam with Proton, Heroic Games Launcher, Lutris, and Bottles.".to_string(),
            selected_browser: "org.mozilla.firefox".to_string(),
            install_codecs: true,
            install_fonts: true,
            enable_firewall: true,
            auto_security_updates: true,
            libreoffice_tabbed: false,
            dev_tools: vec![],
            recommended_apps: vec![
                "com.valvesoftware.Steam".to_string(),
                "com.heroicgameslauncher.hgl".to_string(),
                "net.lutris.Lutris".to_string(),
                "com.usebottles.bottles".to_string(),
                "com.github.tchx84.Flatseal".to_string(),
            ],
        }
    }

    pub fn preset_creative() -> SetupProfile {
        SetupProfile {
            schema_version: Self::SCHEMA_VERSION.to_string(),
            app_id: "mint-helper".to_string(),
            name: "Creative".to_string(),
            description: "Content creation suite: GIMP, Blender 3D, Krita painting, OBS Studio, and Kdenlive.".to_string(),
            selected_browser: "org.mozilla.firefox".to_string(),
            install_codecs: true,
            install_fonts: true,
            enable_firewall: true,
            auto_security_updates: true,
            libreoffice_tabbed: true,
            dev_tools: vec![],
            recommended_apps: vec![
                "org.gimp.GIMP".to_string(),
                "org.blender.Blender".to_string(),
                "org.kde.krita".to_string(),
                "org.inkscape.Inkscape".to_string(),
                "com.obsproject.Studio".to_string(),
                "org.kde.kdenlive".to_string(),
                "org.audacityteam.Audacity".to_string(),
            ],
        }
    }

    pub fn generate_installation_plan(profile: &SetupProfile) -> InstallationPlan {
        let mut items = Vec::new();

        // 1. Browsers
        if profile.selected_browser == "org.mozilla.firefox" {
            items.push(PlanItem {
                id: "keep-firefox".to_string(),
                title: "Keep Mozilla Firefox Default Browser".to_string(),
                kind: OperationKind::Keep,
                source: PackageSource::Apt,
                description: "Preserve preinstalled Firefox browser and all existing user profile history/bookmarks.".to_string(),
                reason: "Standard recommended web browser in Linux Mint.".to_string(),
                permissions_required: "None".to_string(),
                reversible: true,
                enabled: true,
                command: "# No action required; profile preserved".to_string(),
            });
        } else if profile.selected_browser == "io.gitlab.librewolf-community" {
            items.push(PlanItem {
                id: "install-librewolf".to_string(),
                title: "Install LibreWolf Browser".to_string(),
                kind: OperationKind::Install,
                source: PackageSource::Flatpak,
                description: "Install privacy-hardened LibreWolf browser via Flathub.".to_string(),
                reason: "User selected privacy-focused browser alternative.".to_string(),
                permissions_required: "User (Flatpak)".to_string(),
                reversible: true,
                enabled: true,
                command: "flatpak install -y flathub io.gitlab.librewolf-community".to_string(),
            });
        }

        // 2. Multimedia Codecs
        if profile.install_codecs {
            items.push(PlanItem {
                id: "install-codecs".to_string(),
                title: "Install Multimedia Codecs (mint-meta-codecs)".to_string(),
                kind: OperationKind::Install,
                source: PackageSource::Apt,
                description: "Install official Linux Mint audio and video codecs for MP4, MP3, AAC, and DVD playback.".to_string(),
                reason: "Enables playback of patented media formats in system players.".to_string(),
                permissions_required: "Root (pkexec apt)".to_string(),
                reversible: true,
                enabled: true,
                command: "pkexec apt install -y mint-meta-codecs".to_string(),
            });
        }

        // 3. Microsoft-compatible Fonts
        if profile.install_fonts {
            items.push(PlanItem {
                id: "install-fonts".to_string(),
                title: "Install TrueType Core Fonts (Arial, Times New Roman)".to_string(),
                kind: OperationKind::Install,
                source: PackageSource::Apt,
                description: "Install Microsoft TrueType core fonts via ttf-mscorefonts-installer legally.".to_string(),
                reason: "Ensures fidelity when opening documents created in Microsoft Office.".to_string(),
                permissions_required: "Root (pkexec apt)".to_string(),
                reversible: true,
                enabled: true,
                command: "echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | pkexec debconf-set-selections && pkexec apt install -y ttf-mscorefonts-installer".to_string(),
            });
        }

        // 4. LibreOffice Tabbed Interface
        if profile.libreoffice_tabbed {
            items.push(PlanItem {
                id: "config-libreoffice-tabbed".to_string(),
                title: "Configure LibreOffice Ribbon-style Tabbed Toolbar".to_string(),
                kind: OperationKind::Configure,
                source: PackageSource::SystemSetting,
                description: "Enable the notebookbar layout in LibreOffice Writer and Calc for familiar ribbon navigation.".to_string(),
                reason: "Provides a familiar user experience for users migrating from Microsoft Office.".to_string(),
                permissions_required: "User (dconf / registrymodifications.xcu)".to_string(),
                reversible: true,
                enabled: true,
                command: "# Configure LibreOffice User Interface layout".to_string(),
            });
        }

        // 5. Firewall
        if profile.enable_firewall {
            items.push(PlanItem {
                id: "config-firewall".to_string(),
                title: "Enable UFW Firewall with Safe Default Rules".to_string(),
                kind: OperationKind::Configure,
                source: PackageSource::SystemSetting,
                description: "Activate Uncomplicated Firewall: block all unsolicited incoming connections, allow outgoing.".to_string(),
                reason: "Crucial perimeter security for laptops on public Wi-Fi or home networks.".to_string(),
                permissions_required: "Root (pkexec ufw)".to_string(),
                reversible: true,
                enabled: true,
                command: "pkexec ufw default deny incoming && pkexec ufw default allow outgoing && pkexec ufw enable".to_string(),
            });
        }

        // 6. Automatic Security Updates
        if profile.auto_security_updates {
            items.push(PlanItem {
                id: "config-auto-updates".to_string(),
                title: "Enable Automatic Daily Security Updates".to_string(),
                kind: OperationKind::Configure,
                source: PackageSource::Apt,
                description: "Configure unattended-upgrades to automatically apply critical security patches.".to_string(),
                reason: "Keeps Linux Mint protected against zero-day vulnerabilities in the background.".to_string(),
                permissions_required: "Root (pkexec apt)".to_string(),
                reversible: true,
                enabled: true,
                command: "pkexec apt install -y unattended-upgrades && pkexec dpkg-reconfigure -plow unattended-upgrades".to_string(),
            });
        }

        // 7. Developer tools
        for tool in &profile.dev_tools {
            let (name, cmd, src) = match tool.as_str() {
                "git" => ("Git Version Control", "pkexec apt install -y git", PackageSource::Apt),
                "build-essential" => ("Build Essentials (gcc, g++, make)", "pkexec apt install -y build-essential", PackageSource::Apt),
                "rust-toolchain" => ("Rust & Cargo Toolchain", "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y", PackageSource::Apt),
                "python3-pip" => ("Python 3 & Pip Package Manager", "pkexec apt install -y python3-pip python3-venv", PackageSource::Apt),
                "nodejs" => ("Node.js Runtime & NPM", "pkexec apt install -y nodejs npm", PackageSource::Apt),
                "com.vscodium.codium" => ("VSCodium Open Source Editor", "flatpak install -y flathub com.vscodium.codium", PackageSource::Flatpak),
                "it.mijorus.gearlever" => ("Gear Lever AppImage Manager", "flatpak install -y flathub it.mijorus.gearlever", PackageSource::Flatpak),
                other => (other, "pkexec apt install -y", PackageSource::Apt),
            };

            items.push(PlanItem {
                id: format!("install-dev-{}", tool),
                title: format!("Install {}", name),
                kind: OperationKind::Install,
                source: src,
                description: format!("Install development package '{}'.", tool),
                reason: "Developer environment requirement selected in profile.".to_string(),
                permissions_required: "Root or User".to_string(),
                reversible: true,
                enabled: true,
                command: cmd.to_string(),
            });
        }

        // 8. Recommended applications
        for app in &profile.recommended_apps {
            items.push(PlanItem {
                id: format!("install-app-{}", app),
                title: format!("Install Flatpak: {}", app),
                kind: OperationKind::Install,
                source: PackageSource::Flatpak,
                description: format!("Install sandboxed Flathub package '{}'.", app),
                reason: "Selected from recommended applications category.".to_string(),
                permissions_required: "User (Flatpak)".to_string(),
                reversible: true,
                enabled: true,
                command: format!("flatpak install -y flathub {}", app),
            });
        }

        // 9. Optional cleanup item
        items.push(PlanItem {
            id: "clean-apt-cache".to_string(),
            title: "Clean Obsolete Package Archives (apt clean)".to_string(),
            kind: OperationKind::OptionalCleanup,
            source: PackageSource::Apt,
            description: "Remove obsolete .deb installer files cached in /var/cache/apt/archives to free disk space.".to_string(),
            reason: "Safe maintenance operation; downloaded deb files are no longer required after install.".to_string(),
            permissions_required: "Root (pkexec apt-get clean)".to_string(),
            reversible: false,
            enabled: true,
            command: "pkexec apt-get clean && pkexec apt-get autoremove -y".to_string(),
        });

        InstallationPlan {
            name: format!("Setup Plan ({})", profile.name),
            created_at: Utc::now().to_rfc3339(),
            items,
        }
    }

    pub fn export_profile_json(profile: &SetupProfile) -> Result<String, serde_json::Error> {
        serde_json::to_string_pretty(profile)
    }

    pub fn import_profile_json(json_str: &str) -> Result<SetupProfile, String> {
        let profile: SetupProfile = serde_json::from_str(json_str)
            .map_err(|e| format!("Invalid profile JSON format: {}", e))?;

        if profile.schema_version != Self::SCHEMA_VERSION {
            return Err(format!(
                "Unsupported schema version '{}' (expected '{}')",
                profile.schema_version,
                Self::SCHEMA_VERSION
            ));
        }

        if profile.app_id != "mint-helper" {
            return Err("Profile is not an authentic mint-helper configuration".to_string());
        }

        Ok(profile)
    }
}
