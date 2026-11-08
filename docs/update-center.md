# mint-helper Update Center Documentation

The **Update Center** in `mint-helper` provides a centralized, secure interface for managing Linux Mint system packages, Flatpak applications, and `mint-helper` application updates.

---

## 1. Architecture Overview

The Update Center decouples update discovery, dependency analysis, user review, and execution across three independent package subsystems:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        mint-helper Update Center                       │
├─────────────────────┬────────────────────┬─────────────────────────────┤
│ mint-helper Updates │ Linux APT Updates  │ Flatpak Updates & Runtimes  │
│ (GitHub Releases)   │ (APT / dpkg)       │ (Flathub & Remotes)         │
├─────────────────────┴────────────────────┴─────────────────────────────┤
│                          PolicyKit (pkexec)                            │
├────────────────────────────────────────────────────────────────────────┤
│           Local Persistent Audit Trail (~/.config/mint-helper/)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Four Main Categories

### A. mint-helper Updates
- **Official Source**: GitHub Releases (`api.github.com/repos/{owner}/{repo}/releases`).
- **Semantic Versioning**: Adheres strictly to SemVer (`MAJOR.MINOR.PATCH`).
- **Channels**:
  - **Stable** (Default): Only verified production releases.
  - **Beta**: Feature previews.
  - **Development**: Nightly and experimental builds.
- **Atomic AppImage Updater**:
  - Downloads new AppImage to a temporary file (`.part`).
  - Validates **SHA256 checksum** against `release.sha256`.
  - Verifies detached **GPG cryptographic signature** against Linux Mint Release Key.
  - Backs up current executable to `~/.local/share/mint-helper/mint-helper.AppImage.bak`.
  - Atomically renames new file into place (`rename(2)` syscall).
  - Never overwrites the currently executing binary in memory.
  - One-click **Rollback** restores previous working version immediately.
  - No root or sudo permissions required for user-level AppImage updates.

### B. Linux System Updates (APT)
- **Categorization**:
  - **Kernel Updates**: Hardware drivers and Linux kernel modules.
  - **Security Updates**: Critical CVE mitigations.
  - **Recommended Updates**: Bug fixes and stability enhancements.
  - **Optional Updates**: Utility software updates.
- **Pre-Installation Review**:
  - Summarizes packages to upgrade.
  - Explicitly warns if packages will be removed.
  - Lists newly required dependencies.
  - Warns if a kernel or core library update will require a system restart.
- **Privilege Separation**:
  - No raw `sudo` commands executed in GUI.
  - Uses `pkexec` (PolicyKit) to request fine-grained administrative approval.
  - Detects package manager locks (`/var/lib/dpkg/lock-frontend`) gracefully without crashing.

### C. Flatpak Updates & Runtime Cleaner
- Displays application name, App ID, versions, remote origin (e.g., Flathub), and download size.
- Safely updates individual apps or all queued apps.
- **Unused Runtime Detection**: Identifies orphaned GNOME and Freedesktop runtime versions (`flatpak uninstall --unused`) to reclaim gigabytes of disk space without breaking dependency trees.

### D. Update History & Audit Trail
- Stored exclusively locally at `~/.config/mint-helper/update_history.json`.
- Records: Timestamp, Package Name, Previous Version, New Version, Package Manager, Operation Type, and Result.
- Filters by source (mint-helper, APT, Flatpak).
- One-click export to standard **CSV** and **JSON** files.
- **Zero Telemetry Guarantee**: Audit logs are never sent to external servers or cloud services.

---

## 3. Restart Management

When an update modifies the kernel (`linux-image-*`) or core libc libraries, `mint-helper` detects the requirement via `/var/run/reboot-required` and displays a non-intrusive alert banner with:
- "Restart Later"
- "View Details" (lists specific packages triggering the requirement)
- "Dismiss"

`mint-helper` **never** forces an automatic reboot or disrupts running user work.
