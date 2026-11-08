# AppImage Packaging Guide

mint-helper provides an AppImage packaging flow using `linuxdeploy` to produce portable single-file binaries that run across Linux Mint versions.

---

## Packaging Process Overview

1. Build the release binary with `cargo build --release`.
2. Populate the `AppDir` folder with:
   - `AppDir/usr/bin/mint-helper`
   - `AppDir/usr/share/applications/mint-helper.desktop`
   - `AppDir/usr/share/icons/hicolor/scalable/apps/mint-helper.svg`
   - `AppDir/AppRun` launcher script
3. Invoke `linuxdeploy` to package shared libraries, desktop metadata, and squashfs filesystem.

---

## Local Packaging Instructions

Run the packaging script located at `packaging/appimage/build-appimage.sh`:

```bash
cd mint-helper
bash packaging/appimage/build-appimage.sh
```

Upon completion, `mint-helper-x86_64.AppImage` will be created along with its `SHA256SUM` verification file.

---

## Testing the AppImage

```bash
# Make executable
chmod +x mint-helper-x86_64.AppImage

# Test execution with debug logging
./mint-helper-x86_64.AppImage --debug
```
