#!/usr/bin/env bash
set -euo pipefail

echo "=== Building mint-helper AppImage ==="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="${ROOT_DIR}/packaging/appimage/AppDir"

echo "1. Compiling release binary with Cargo..."
cd "${ROOT_DIR}/app"
cargo build --release

echo "2. Setting up AppDir directory tree..."
rm -rf "${APP_DIR}"
mkdir -p "${APP_DIR}/usr/bin"
mkdir -p "${APP_DIR}/usr/share/applications"
mkdir -p "${APP_DIR}/usr/share/icons/hicolor/scalable/apps"

cp "${ROOT_DIR}/app/target/release/mint-helper" "${APP_DIR}/usr/bin/"
cp "${ROOT_DIR}/packaging/appimage/mint-helper.desktop" "${APP_DIR}/usr/share/applications/"
cp "${ROOT_DIR}/assets/icons/mint-helper.svg" "${APP_DIR}/usr/share/icons/hicolor/scalable/apps/"
cp "${ROOT_DIR}/packaging/appimage/AppRun" "${APP_DIR}/AppRun"
chmod +x "${APP_DIR}/AppRun"

echo "3. Fetching linuxdeploy..."
cd "${ROOT_DIR}"
if [ ! -f "linuxdeploy-x86_64.AppImage" ]; then
    curl -sSL -O https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage
    chmod +x linuxdeploy-x86_64.AppImage
fi

echo "4. Running linuxdeploy packaging..."
./linuxdeploy-x86_64.AppImage --appdir "${APP_DIR}" --output appimage

mv mint-helper*.AppImage mint-helper-x86_64.AppImage
sha256sum mint-helper-x86_64.AppImage > mint-helper-x86_64.AppImage.sha256

echo "=== AppImage generated successfully: mint-helper-x86_64.AppImage ==="
