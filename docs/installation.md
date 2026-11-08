# Installing mint-helper

**mint-helper** is distributed primarily for Linux Mint and Debian/Ubuntu derivatives in three standard formats: **Flatpak**, **AppImage**, and **Source code**.

---

## Method 1: Flatpak (Recommended)

Flatpak ensures sandboxed execution, automatic runtime dependency resolution, and seamless updates through Linux Mint's Software Manager.

### 1. Enable Flathub (if not already enabled)
Linux Mint comes with Flathub configured out of the box. On other Debian/Ubuntu derivatives:
```bash
sudo apt update
sudo apt install -y flatpak
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

### 2. Install mint-helper
```bash
flatpak install flathub com.linuxmint.mint_helper
```

### 3. Launching
You can launch mint-helper from your desktop Application Menu under **Administration** or **System Settings**, or via terminal:
```bash
flatpak run com.linuxmint.mint_helper
```

---

## Method 2: AppImage (Portable & No Installation Required)

The AppImage is a single self-contained executable that runs on any modern Linux distribution without touching system directories.

### 1. Download the AppImage
Download `mint-helper-x86_64.AppImage` and its SHA256 verification sum from the [GitHub Releases](https://github.com/linuxmint-community/mint-helper/releases) page.

### 2. Verify Integrity
```bash
sha256sum -c mint-helper-x86_64.AppImage.sha256
```

### 3. Make Executable and Run
```bash
chmod +x mint-helper-x86_64.AppImage
./mint-helper-x86_64.AppImage
```

> **Tip:** You can use **Gear Lever** (available in mint-helper's Post Installation wizard) to automatically integrate AppImages into your Linux Mint system menu with icons!

---

## Method 3: Compiling from Source

See [`docs/build-from-source.md`](./build-from-source.md) for step-by-step instructions on setting up the Rust toolchain and compiling mint-helper with native GTK4 libraries.
