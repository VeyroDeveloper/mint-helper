<div align="center">
  <img src="public/mint-helper.svg" width="96" height="96" alt="mint-helper logo" />
  <h1>mint-helper</h1>
  <p><strong>The Free, Open-Source Linux Desktop Companion & Post-Installation Manager</strong></p>

  [![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](LICENSE)
  [![Platform](https://img.shields.io/badge/Platform-Linux%20Mint%20%7C%20Ubuntu%20%7C%20Debian-brightgreen.svg)](#supported-distributions)
  [![Rust](https://img.shields.io/badge/Language-Rust-orange.svg)](app/)
  [![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero%20%2F%20None-success.svg)](docs/privacy.md)
</div>

---

## 🍃 Overview

**mint-helper** is a desktop utility crafted primarily for **Linux Mint** (Cinnamon, MATE, and Xfce). It bridges the gap between fresh system installation and everyday maintenance, consolidating common manual post-installation tasks into a clean, modern, and trustworthy GTK4 interface.

There is:
- **No AI / LLM gimmicks** or external API dependencies.
- **Zero telemetry, zero tracking, and zero advertising**.
- **No subscriptions or accounts** — purely local, transparent open-source code.

---

## 📸 Interface & Screenshots

<div align="center">
  <p><em>Desktop Application & Web Portal Preview</em></p>
</div>

| Section | Description |
| :--- | :--- |
| **Overview Dashboard** | Real hardware utilization (CPU, RAM, Disks, GPU, Battery, Network, UFW) |
| **Update Center** | Centralized updates for mint-helper (GitHub), Linux System (APT), and Flatpaks |
| **Post-Installation Wizard** | 8 guided steps: Browsers, Codecs, Fonts, Office, Security, Dev Tools, Apps |
| **Application & Flatpak Manager** | Browse verified Flatpaks, inspect permissions, and check update availability |
| **Maintenance Center** | Safe package cleanup, APT/Flatpak refresh, and obsolete cache purging |
| **Recovery & Timeshift** | Snapshot status verification and personal backup destinations |

---

## ✨ Features

- **Comprehensive Update Center**:
  - **mint-helper Updates**: Direct from official GitHub Releases using SemVer, channels (Stable, Beta, Dev), notification banners, and atomic AppImage updates with SHA256 & GPG signature verification plus rollback.
  - **Linux System Updates (APT)**: Categorized into Security, Recommended, Optional, and Kernel updates. Interactive pre-installation review modal, lock detection, and PolicyKit integration.
  - **Flatpak Updates**: App & runtime updating, Flathub remote verification, and unused runtimes cleaner.
  - **Update History**: Persistent local audit log with CSV and JSON exports. Zero telemetry.
  - **Restart Management**: Non-intrusive alert when kernel upgrades require reboot. Never auto-reboots.
- **8-Step Post-Installation Wizard**:
  - **Browsers**: Choose between Firefox (recommending uBlock Origin), LibreWolf, Vivaldi, or Chromium. Never deletes browser profiles or bookmarks.
  - **Multimedia Codecs**: Official `mint-meta-codecs` package installation.
  - **Office Software**: Configure LibreOffice into the familiar Tabbed (Ribbon-style) interface reversibly.
  - **Fonts**: Microsoft TrueType core fonts (`ttf-mscorefonts-installer`) without unauthorized redistribution.
  - **Security**: UFW firewall setup (default deny incoming, allow outgoing) and automatic unattended security updates.
  - **Desktop Customization**: Cinnamon Themes, cursor packs, applets, and desklets.
  - **Developer Tools**: Git, Rust/Cargo, Python, Node.js, Build Essentials, and VSCodium.
  - **Curated Applications**: VLC, OBS Studio, GIMP, Krita, Blender, Steam, Heroic, Lutris, Flatseal, and Gear Lever.
- **Reviewable Installation Plan Engine**:
  - Partitions changes into `INSTALL`, `REMOVE`, `CONFIGURE`, `KEEP`, and `OPTIONAL CLEANUP`.
  - Explains what will happen, why it is needed, required permissions, and consequences before any action is executed.
- **Preset Setup Profiles**:
  - *Everyday User*, *Developer*, *Gaming*, *Creative*, and *Custom*.
  - Versioned JSON export and import (v1.0 schema).
- **Storage Analyzer & Cache Cleaner**:
  - Scans `/var/cache/apt/archives` and `~/.cache/thumbnails`.
  - Safe duplicate file comparison using SHA-256 chunking without touching personal directories.

---

## 🖥️ Supported Distributions

- **Linux Mint 22.x** (Cinnamon, MATE, Xfce)
- **Linux Mint 21.x** (Cinnamon, MATE, Xfce)
- **Linux Mint Debian Edition (LMDE 6)**
- **Ubuntu 24.04 LTS / 22.04 LTS**
- Compatible Debian-based distributions

---

## 📦 Installation

### Flatpak (Recommended)
```bash
flatpak install flathub com.linuxmint.mint_helper
flatpak run com.linuxmint.mint_helper
```

### AppImage
```bash
chmod +x mint-helper-x86_64.AppImage
./mint-helper-x86_64.AppImage
```

### Compile from Source
```bash
sudo apt update
sudo apt install -y build-essential pkg-config libglib2.0-dev libgtk-4-dev libadwaita-1-dev
cd app
cargo build --release
./target/release/mint-helper
```

---

## 🔒 Security & Privacy

- **Unprivileged by Default**: mint-helper runs as a standard user process. Privileged tasks invoke PolicyKit (`pkexec`) with clear action descriptions.
- **Data Protection**: Personal files (`~/Documents`, `~/Pictures`) and browser credential databases (`~/.mozilla/firefox`) are strictly excluded from automated cleanup.
- Full details in [docs/security.md](SECURITY.md) and [docs/privacy.md](docs/privacy.md).

---

## 🗺️ Project Roadmap

- [x] Rust GTK4 application core architecture
- [x] 8-Step Post-Installation wizard & profile manager
- [x] Real-time Linux sysinfo service
- [x] Reviewable installation plan generator
- [x] AppImage packaging recipe & Flatpak manifest
- [x] Full documentation suite & GitHub CI workflows
- [x] English and German bilingual support
- [ ] French, Spanish, and Italian translations
- [ ] Direct Timeshift D-Bus signal subscription

---

## 🤝 Contributing

Contributions are warmly welcomed! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

---

## 📄 License

mint-helper is licensed under the [GNU General Public License v3.0 or later (GPL-3.0-or-later)](LICENSE).
