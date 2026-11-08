# Release & Packaging Process

This document outlines the official pipeline for building, verifying, and publishing `mint-helper` releases.

---

## 1. Versioning Standard

`mint-helper` adheres to [Semantic Versioning 2.0.0](https://semver.org/):
- **Major (`X.0.0`)**: Breaking configuration schema or interface architecture shifts.
- **Minor (`1.X.0`)**: New feature additions (e.g., Update Center, new system monitors).
- **Patch (`1.0.X`)**: Bug fixes, dependency bumps, security patches.

---

## 2. Release Artifacts

Every official GitHub release provides:
1. `mint-helper-{VERSION}-x86_64.AppImage`: Standalone, universal Linux executable.
2. `mint-helper-{VERSION}-x86_64.AppImage.sha256`: SHA-256 cryptographic digest.
3. `mint-helper-{VERSION}-x86_64.AppImage.asc`: Detached GPG signature from Linux Mint release key.
4. `org.linuxmint.mint-helper.flatpak`: Flatpak single-bundle package.
5. `release-manifest.json`: Machine-readable metadata for `mint-helper` Update Center automatic detection.

---

## 3. GitHub Actions Release Workflow

The automated build pipeline runs on tag push (`v*`):
1. **Compilation**: Builds optimized release binaries in Ubuntu 24.04 (Noble/Wilma base).
2. **Security Audit**: Runs `cargo audit` and dependency CVE scanners.
3. **AppImage Bundling**: Executes `appimagetool` with desktop entry and 512x512 SVG icons.
4. **Signature Generation**:
   ```bash
   sha256sum mint-helper-*.AppImage > mint-helper-x86_64.AppImage.sha256
   gpg --batch --yes --detach-sign --armor mint-helper-*.AppImage
   ```
5. **Publishing**: Uploads all artifacts to GitHub Releases with generated changelog notes.
