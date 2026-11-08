# mint-helper Architecture

This document describes the software architecture, modular boundaries, security domains, and data contracts of **mint-helper**.

---

## High-Level Architectural Diagram

```
+------------------------------------------------------------------------+
|                          GTK4 / Relm4 Frontend                         |
|                                                                        |
| [Sidebar]                                                             |
|   |-- Overview Dashboard (CPU, RAM, Disks, GPU, Battery, Network)      |
|   |-- Post-Installation Wizard (8 Steps + Plan Generator)             |
|   |-- Application Manager (APT & Flatpak)                              |
|   |-- System Health & Security (UFW, Updates, Permissions)             |
|   |-- Maintenance & Storage Cleanup (Safe caches & orphan removal)    |
|   +-- Hardware, Recovery (Timeshift), Spices Customization, Settings   |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|                            Core Rust Engine                            |
|                                                                        |
|  +------------------+  +------------------+  +-----------------------+  |
|  |  SysInfo Service |  | Package Service  |  |   Security Service    |  |
|  |  /proc, /sys     |  | APT, Flatpak,    |  |   UFW, polkit exec,   |  |
|  |  udev, sysfs     |  | Flathub RPC      |  |   AppArmor/Firewall   |  |
|  +------------------+  +------------------+  +-----------------------+  |
|  +------------------+  +------------------+  +-----------------------+  |
|  | Cleanup Service  |  | Backup Service   |  |   Profile Engine      |  |
|  | Caches, Orp-Deps |  | Timeshift CLI,   |  |   v1.0 JSON Specs,    |  |
|  | SHA-256 Dups     |  | rsync profiles   |  |   Plan Generation     |  |
|  +------------------+  +------------------+  +-----------------------+  |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|                          Linux System Layer                            |
|  Linux Mint Cinnamon / MATE / Xfce • D-Bus • PackageKit • UFW • Polkit  |
+------------------------------------------------------------------------+
```

---

## Core Principles

1. **Least Privilege**: The GUI process runs with standard unprivileged user credentials. All administrative tasks use PolicyKit (`pkexec`) or system D-Bus interfaces.
2. **Deterministic Plan Generation**: No changes are executed immediately upon selection in the wizard. All modifications first produce an immutable `InstallationPlan` with sections:
   - `INSTALL`
   - `REMOVE`
   - `CONFIGURE`
   - `KEEP`
   - `OPTIONAL CLEANUP`
3. **Data Protection**: Personal home folders, browser databases (`places.sqlite`, cookie stores), and credentials are never touched by automated cleanup scripts.
4. **Configuration Schema**: Exported profiles strictly follow the documented v1.0 schema:
   ```json
   {
     "schema_version": "1.0",
     "app_id": "mint-helper",
     "export_timestamp": "2026-11-08T07:30:00Z",
     "profile_name": "Everyday User",
     "packages": {
       "flatpaks": ["org.videolan.VLC", "org.libreoffice.LibreOffice"],
       "system": ["ufw", "mint-meta-codecs", "ttf-mscorefonts-installer"]
     },
     "preferences": {
       "libreoffice_tabbed": true,
       "firewall_enabled": true,
       "auto_security_updates": true
     }
   }
   ```
