# Flatpak Manifest & Building Guide

mint-helper provides a standard Flathub-compatible Flatpak manifest based on the GNOME 46 runtime.

---

## Manifest Location

The manifest is defined at:
`packaging/flatpak/com.linuxmint.mint_helper.yaml`

### Application ID
`com.linuxmint.mint_helper`

### Runtime & SDK
- **Runtime**: `org.gnome.Platform` (branch `46`)
- **SDK**: `org.gnome.Sdk` (branch `46`)
- **SDK Extension**: `org.freedesktop.Sdk.Extension.rust-stable`

---

## Least-Privilege Permissions Philosophy

mint-helper requests only the strictly required Flatpak sandbox permissions:
- `ipc`: Inter-process communication
- `wayland` & `x11`: Display servers
- `system-talk: org.freedesktop.PackageKit`: For interacting with system updates and software installation
- `talk: org.freedesktop.Flatpak`: For inspecting and managing installed Flatpaks
- `filesystem: xdg-config/mint-helper:create`: For local configuration profile storage
- `filesystem: /var/log/timeshift:ro`: For read-only inspection of Timeshift snapshot metadata

---

## Building Locally with `flatpak-builder`

```bash
# Install flatpak-builder
sudo apt install -y flatpak-builder

# Install required GNOME runtime & Rust extension
flatpak install flathub org.gnome.Platform//46 org.gnome.Sdk//46 org.freedesktop.Sdk.Extension.rust-stable//23.08

# Build the flatpak bundle
flatpak-builder --user --install --force-clean build-dir packaging/flatpak/com.linuxmint.mint_helper.yaml

# Run the installed build
flatpak run com.linuxmint.mint_helper
```
