//! Package management operations for Flatpak and APT

use crate::models::{AppPackage, PackageSource};
use std::process::Command;

pub struct PackageManagerService;

impl PackageManagerService {
    pub fn is_flatpak_installed(app_id: &str) -> bool {
        Command::new("flatpak")
            .args(["info", app_id])
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }

    pub fn is_apt_installed(pkg_name: &str) -> bool {
        Command::new("dpkg-query")
            .args(["-W", "-f='${Status}'", pkg_name])
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).contains("install ok installed"))
            .unwrap_or(false)
    }

    pub fn get_curated_catalog() -> Vec<AppPackage> {
        vec![
            // Internet
            AppPackage {
                id: "org.mozilla.firefox".to_string(),
                name: "Mozilla Firefox".to_string(),
                category: "Internet".to_string(),
                description: "Fast, privacy-focused open source web browser included by default in Linux Mint.".to_string(),
                source: PackageSource::Apt,
                installed: true,
                version: Some("132.0".to_string()),
                publisher: Some("Mozilla Foundation".to_string()),
                permissions: vec!["network".to_string(), "audio".to_string()],
            },
            AppPackage {
                id: "io.gitlab.librewolf-community".to_string(),
                name: "LibreWolf".to_string(),
                category: "Internet".to_string(),
                description: "A custom fork of Firefox focusing on privacy, security and freedom with telemetry removed.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("131.0.3".to_string()),
                publisher: Some("LibreWolf Community".to_string()),
                permissions: vec!["network".to_string(), "pulseaudio".to_string()],
            },
            AppPackage {
                id: "com.vivaldi.Vivaldi".to_string(),
                name: "Vivaldi".to_string(),
                category: "Internet".to_string(),
                description: "Power-user browser with built-in tab stacking, notes, and ad blocking.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("6.9".to_string()),
                publisher: Some("Vivaldi Technologies".to_string()),
                permissions: vec!["network".to_string()],
            },
            AppPackage {
                id: "org.chromium.Chromium".to_string(),
                name: "Chromium".to_string(),
                category: "Internet".to_string(),
                description: "Open-source browser project that powers Google Chrome and other engines.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("130.0".to_string()),
                publisher: Some("Chromium Project".to_string()),
                permissions: vec!["network".to_string(), "gpu".to_string()],
            },
            AppPackage {
                id: "org.mozilla.Thunderbird".to_string(),
                name: "Thunderbird Mail".to_string(),
                category: "Internet".to_string(),
                description: "Full-featured email, calendar, and contacts desktop application.".to_string(),
                source: PackageSource::Apt,
                installed: true,
                version: Some("128.3".to_string()),
                publisher: Some("MZLA Technologies".to_string()),
                permissions: vec!["network".to_string()],
            },

            // Productivity
            AppPackage {
                id: "org.libreoffice.LibreOffice".to_string(),
                name: "LibreOffice Suite".to_string(),
                category: "Productivity".to_string(),
                description: "Complete office suite including Writer, Calc, Impress, and Draw.".to_string(),
                source: PackageSource::Apt,
                installed: true,
                version: Some("24.8".to_string()),
                publisher: Some("The Document Foundation".to_string()),
                permissions: vec!["filesystem:home".to_string()],
            },

            // Multimedia
            AppPackage {
                id: "org.videolan.VLC".to_string(),
                name: "VLC Media Player".to_string(),
                category: "Multimedia".to_string(),
                description: "Universal media player that plays virtually all video and audio formats without extra codecs.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("3.0.21".to_string()),
                publisher: Some("VideoLAN".to_string()),
                permissions: vec!["audio".to_string(), "video".to_string()],
            },
            AppPackage {
                id: "com.obsproject.Studio".to_string(),
                name: "OBS Studio".to_string(),
                category: "Multimedia".to_string(),
                description: "High-performance video recording and live streaming suite.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("30.2.3".to_string()),
                publisher: Some("OBS Project".to_string()),
                permissions: vec!["camera".to_string(), "microphone".to_string(), "wayland".to_string()],
            },
            AppPackage {
                id: "org.kde.kdenlive".to_string(),
                name: "Kdenlive".to_string(),
                category: "Multimedia".to_string(),
                description: "Powerful non-linear multitrack video editor with comprehensive effects.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("24.08".to_string()),
                publisher: Some("KDE".to_string()),
                permissions: vec!["audio".to_string(), "gpu".to_string()],
            },
            AppPackage {
                id: "org.audacityteam.Audacity".to_string(),
                name: "Audacity".to_string(),
                category: "Multimedia".to_string(),
                description: "Multi-track audio editor and recorder for podcasts and music production.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("3.6.4".to_string()),
                publisher: Some("Audacity Team".to_string()),
                permissions: vec!["audio".to_string(), "microphone".to_string()],
            },

            // Graphics
            AppPackage {
                id: "org.gimp.GIMP".to_string(),
                name: "GIMP Image Editor".to_string(),
                category: "Graphics".to_string(),
                description: "GNU Image Manipulation Program for photo retouching, image composition and authoring.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("2.10.38".to_string()),
                publisher: Some("GIMP Team".to_string()),
                permissions: vec!["filesystem:home".to_string()],
            },
            AppPackage {
                id: "org.inkscape.Inkscape".to_string(),
                name: "Inkscape".to_string(),
                category: "Graphics".to_string(),
                description: "Professional vector graphics editor for illustrations, logos, and typography.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("1.4".to_string()),
                publisher: Some("Inkscape Project".to_string()),
                permissions: vec!["filesystem:home".to_string()],
            },
            AppPackage {
                id: "org.kde.krita".to_string(),
                name: "Krita".to_string(),
                category: "Graphics".to_string(),
                description: "Professional digital painting application for concept artists and illustrators.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("5.2.3".to_string()),
                publisher: Some("Krita Foundation".to_string()),
                permissions: vec!["gpu".to_string()],
            },
            AppPackage {
                id: "org.blender.Blender".to_string(),
                name: "Blender 3D".to_string(),
                category: "Graphics".to_string(),
                description: "Free and open source 3D creation suite supporting modeling, rigging, and animation.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("4.2.3".to_string()),
                publisher: Some("Blender Foundation".to_string()),
                permissions: vec!["gpu".to_string(), "filesystem:home".to_string()],
            },

            // Gaming
            AppPackage {
                id: "com.valvesoftware.Steam".to_string(),
                name: "Steam".to_string(),
                category: "Gaming".to_string(),
                description: "Digital distribution platform with Proton compatibility for playing Windows games on Linux.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("1.0.0.79".to_string()),
                publisher: Some("Valve".to_string()),
                permissions: vec!["network".to_string(), "gpu".to_string(), "input-devices".to_string()],
            },
            AppPackage {
                id: "com.heroicgameslauncher.hgl".to_string(),
                name: "Heroic Games Launcher".to_string(),
                category: "Gaming".to_string(),
                description: "Open-source launcher for Epic Games, GOG, and Prime Gaming titles.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("2.14.1".to_string()),
                publisher: Some("Heroic Games".to_string()),
                permissions: vec!["network".to_string(), "gpu".to_string()],
            },
            AppPackage {
                id: "net.lutris.Lutris".to_string(),
                name: "Lutris".to_string(),
                category: "Gaming".to_string(),
                description: "Open source gaming platform that unifies your game library with automated installers.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("0.5.17".to_string()),
                publisher: Some("Lutris Team".to_string()),
                permissions: vec!["network".to_string(), "gpu".to_string()],
            },

            // Utilities
            AppPackage {
                id: "com.github.tchx84.Flatseal".to_string(),
                name: "Flatseal".to_string(),
                category: "Utilities".to_string(),
                description: "Graphical utility to review and modify Flatpak application permissions with a click.".to_string(),
                source: PackageSource::Flatpak,
                installed: true,
                version: Some("2.2.1".to_string()),
                publisher: Some("tchx84".to_string()),
                permissions: vec!["talk:org.freedesktop.Flatpak".to_string()],
            },
            AppPackage {
                id: "com.usebottles.bottles".to_string(),
                name: "Bottles".to_string(),
                category: "Utilities".to_string(),
                description: "Run Windows software and games on Linux easily with sandboxed prefix environments.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("51.13".to_string()),
                publisher: Some("Bottles Devs".to_string()),
                permissions: vec!["network".to_string(), "filesystem:home".to_string()],
            },
            AppPackage {
                id: "it.mijorus.gearlever".to_string(),
                name: "Gear Lever".to_string(),
                category: "Utilities".to_string(),
                description: "Manage AppImages effortlessly: automatic desktop integration, menu icons, and updates.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("2.2.0".to_string()),
                publisher: Some("mijorus".to_string()),
                permissions: vec!["filesystem:home".to_string()],
            },

            // Development
            AppPackage {
                id: "git".to_string(),
                name: "Git VCS".to_string(),
                category: "Development".to_string(),
                description: "Fast, scalable, distributed revision control system.".to_string(),
                source: PackageSource::Apt,
                installed: true,
                version: Some("2.43.0".to_string()),
                publisher: Some("Git Team".to_string()),
                permissions: vec!["system".to_string()],
            },
            AppPackage {
                id: "build-essential".to_string(),
                name: "Build Essentials".to_string(),
                category: "Development".to_string(),
                description: "Meta-package containing gcc, g++, make, and libc development libraries.".to_string(),
                source: PackageSource::Apt,
                installed: false,
                version: Some("12.10".to_string()),
                publisher: Some("Debian/Ubuntu".to_string()),
                permissions: vec!["root".to_string()],
            },
            AppPackage {
                id: "rust-toolchain".to_string(),
                name: "Rust & Cargo Toolchain".to_string(),
                category: "Development".to_string(),
                description: "Modern, memory-safe systems programming language and package manager.".to_string(),
                source: PackageSource::Apt,
                installed: false,
                version: Some("1.82".to_string()),
                publisher: Some("Rust Foundation / rustup".to_string()),
                permissions: vec!["user".to_string()],
            },
            AppPackage {
                id: "com.vscodium.codium".to_string(),
                name: "VSCodium".to_string(),
                category: "Development".to_string(),
                description: "Community-driven, freely-licensed binary distribution of Microsoft's VS Code editor.".to_string(),
                source: PackageSource::Flatpak,
                installed: false,
                version: Some("1.95.1".to_string()),
                publisher: Some("VSCodium Community".to_string()),
                permissions: vec!["filesystem:home".to_string(), "network".to_string()],
            },
        ]
    }
}
