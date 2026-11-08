import React, { useState } from 'react';
import { FileCode, Folder, Copy, Check } from 'lucide-react';

export const RepoBrowserSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app/Cargo.toml');
  const [copied, setCopied] = useState(false);

  const repoFiles: Record<string, { path: string; language: string; content: string }> = {
    'app/Cargo.toml': {
      path: 'app/Cargo.toml',
      language: 'toml',
      content: `[package]
name = "mint-helper"
version = "1.0.0"
edition = "2021"
authors = ["mint-helper Contributors <community@linuxmint.com>"]
description = "The Linux Mint desktop companion and post-installation manager"
license = "GPL-3.0-or-later"
repository = "https://github.com/linuxmint-community/mint-helper"
keywords = ["linuxmint", "post-install", "flatpak", "system", "gtk4"]

[dependencies]
gtk4 = { version = "0.8", features = ["v4_12"] }
libadwaita = { version = "0.6", features = ["v1_5"] }
sysinfo = "0.30"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
sha2 = "0.10"
hex = "0.4"
log = "0.4"
env_logger = "0.11"
chrono = { version = "0.4", features = ["serde"] }`,
    },
    'app/src/main.rs': {
      path: 'app/src/main.rs',
      language: 'rust',
      content: `//! mint-helper - The Linux Mint Desktop Companion and System Manager
//! Licensed under GPL-3.0-or-later

mod config;
mod models;
mod services;
mod ui;

use config::AppConfig;
use gtk4::prelude::*;
use gtk4::Application;
use log::info;

const APP_ID: &str = "com.linuxmint.mint_helper";

fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    info!("Starting mint-helper desktop application...");

    let app_config = AppConfig::load();
    let app = Application::builder().application_id(APP_ID).build();

    app.connect_activate(move |app| {
        ui::build_ui(app, &app_config);
    });

    app.run();
}`,
    },
    'packaging/flatpak/com.linuxmint.mint_helper.yaml': {
      path: 'packaging/flatpak/com.linuxmint.mint_helper.yaml',
      language: 'yaml',
      content: `app-id: com.linuxmint.mint_helper
runtime: org.gnome.Platform
runtime-version: '46'
sdk: org.gnome.Sdk
sdk-extensions:
  - org.freedesktop.Sdk.Extension.rust-stable
command: mint-helper

finish-args:
  - --share=ipc
  - --socket=fallback-x11
  - --socket=wayland
  - --talk-name=org.freedesktop.Notifications
  - --talk-name=org.freedesktop.Flatpak
  - --system-talk-name=org.freedesktop.PackageKit
  - --system-talk-name=org.freedesktop.PolicyKit1
  - --filesystem=/var/log/timeshift:ro
  - --filesystem=xdg-config/mint-helper:create`,
    },
    'packaging/appimage/mint-helper.desktop': {
      path: 'packaging/appimage/mint-helper.desktop',
      language: 'ini',
      content: `[Desktop Entry]
Name=mint-helper
Comment=Linux Mint Desktop Companion and System Manager
Exec=mint-helper %u
Icon=mint-helper
Terminal=false
Type=Application
Categories=System;Settings;PackageManager;
Keywords=mint;system;post-install;flatpak;clean;backup;firewall;
StartupNotify=true
X-GNOME-UsesNotifications=true`,
    },
    '.github/workflows/rust-ci.yml': {
      path: '.github/workflows/rust-ci.yml',
      language: 'yaml',
      content: `name: Rust CI
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  check-format-and-lint:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy
      - run: cargo fmt --manifest-path app/Cargo.toml -- --check
      - run: cargo clippy --manifest-path app/Cargo.toml --all-targets -- -D warnings
      - run: cargo test --manifest-path app/Cargo.toml --verbose`,
    },
  };

  const current = repoFiles[selectedFile] || repoFiles['app/Cargo.toml'];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto text-xs">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Repository Source Inspector</h1>
        <p className="text-xs text-zinc-400">
          Inspect authentic Rust source files, Flatpak packaging manifests, and GitHub Actions CI pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* File tree */}
        <div className="md:col-span-4 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 space-y-1 shadow-sm">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
            Project Files
          </div>
          {Object.keys(repoFiles).map((fileKey) => (
            <button
              key={fileKey}
              onClick={() => setSelectedFile(fileKey)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition text-xs font-mono flex items-center gap-2 ${
                selectedFile === fileKey
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <FileCode size={14} className="shrink-0" />
              <span className="truncate">{fileKey}</span>
            </button>
          ))}
        </div>

        {/* Code viewer */}
        <div className="md:col-span-8 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between font-mono text-[11px]">
            <span className="text-zinc-300">{current.path}</span>
            <button
              onClick={handleCopy}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 font-mono text-xs text-emerald-400/90 overflow-x-auto max-h-[500px]">
            {current.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
