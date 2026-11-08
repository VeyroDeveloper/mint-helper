# Changelog

All notable changes to mint-helper are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-08

### Added
- **Centralized Update Center**:
  - Four dedicated categories: mint-helper Updates, Linux System Updates (APT), Flatpak Updates, and Update History.
  - Live summary bar showing total available updates, security updates, download sizes, and installed vs. latest versions.
  - Multi-source update checker with isolated progress indicators for GitHub Releases, APT repositories, and Flatpak remotes.
  - GitHub Releases integration with Semantic Versioning and channel selection (Stable, Beta, Development).
  - Atomic AppImage updater with SHA256 checksum verification, GPG signature checking, and automatic rollback backup (`mint-helper.AppImage.bak`).
  - APT updates categorization (Security, Recommended, Optional, Kernel) with pre-installation review modal.
  - PolicyKit privilege separation and APT lock detection (`/var/lib/dpkg/lock-frontend`).
  - Flatpak updates management with Flathub remote verification and unused runtime cleaner (`flatpak uninstall --unused`).
  - Persistent local update history audit log (`~/.config/mint-helper/update_history.json`) with CSV and JSON exports.
  - System restart notification banner on kernel or libc library upgrades without forced reboots.
  - Configurable update check intervals (daily, startup, weekly, manual) in Settings.
- Documentation: `docs/update-center.md`, `docs/automatic-updates.md`, and `docs/release-process.md`.
- Automated release manifest generation in `.github/workflows/release-packaging.yml`.

## [1.0.0] - 2026-11-07

### Added
- Complete Rust GTK4 desktop application architecture with modular services (`sysinfo`, `package_manager`, `firewall`, `cleanup`, `timeshift`, `profile`).
- Interactive Post Installation wizard with 8 guided steps: Welcome, Browsers, Office, Multimedia, Security, Preferences, Developer Tools, Recommended Applications.
- Preset profile generator and customizer (Everyday User, Developer, Gaming, Creative, Custom).
- Reviewable installation plan engine dividing operations into `INSTALL`, `REMOVE`, `CONFIGURE`, `KEEP`, and `OPTIONAL CLEANUP`.
- Dedicated Application Manager and Flatpak Manager with permissions inspect, runtime detection, and Flatseal integration.
- Maintenance Center supporting APT update checks, Flatpak metadata sync, package cache cleanup, and temporary file safe removal.
- System Health overview tracking UFW status, pending updates, storage thresholds, Timeshift backups, and driver recommendations without artificial health scores.
- Storage Analyzer with safe SHA-256 duplicate detection and isolated application data preservation (including Firefox profiles).
- Cinnamon Desktop Customization hub with themes, icon sets, cursor packs, and Spices shortcuts.
- Recovery Center featuring Timeshift snapshot detection, verification, and home directory personal backup scripts.
- Documented v1.0 JSON configuration export/import mechanism excluding sensitive credentials and personal keys.
- Local audit operation history log with timestamped records and diagnostic export.
- English and German (Deutsch) initial bilingual localization support.
- Complete documentation suite in `/docs`: installation, source compilation, AppImage packaging, Flatpak packaging, troubleshooting, architecture, and privacy statement.
- Packaging specifications: AppImage AppRun recipe and Flatpak manifest `com.linuxmint.mint_helper.yaml`.
- Automated GitHub Actions CI/CD workflows for formatting, linting, testing, and multi-format release packaging.
- Official mint-helper web portal and interactive desktop simulator for Linux Mint users.

### Changed
- Standardized package management logic to prioritize verified Flatpaks for desktop applications while preserving distribution APT packages for system toolchains.

### Fixed
- Protected browser profiles from unintended deletion during browser replacements by requiring isolated confirmation.

### Security
- Enforced strict privilege isolation: sensitive operations prompt for PolicyKit authorization via `pkexec` without hardcoding or caching passwords.
- Guaranteed zero telemetry, zero background network calls, and zero tracking.
