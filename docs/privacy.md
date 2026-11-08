# Privacy Statement

**mint-helper is built on an uncompromising commitment to privacy and freedom.**

---

## 1. Zero Telemetry & Zero Tracking
mint-helper contains **no telemetry, no tracking, and no analytic code**. We do not count active users, we do not monitor your hardware, and we do not track which software packages you install or remove.

## 2. No AI API Integrations
mint-helper does not transmit your prompts, files, code, or logs to any external machine learning or AI models. All system checks and recommendations are deterministic rules based on verified Linux system statistics.

## 3. No Third-Party Network Connections
mint-helper does not connect to any servers except when you explicitly trigger standard system package managers:
- Official distribution mirrors (via `apt`)
- Official Flathub repositories (via `flatpak`)
- Official Linux Mint Cinnamon Spices repositories for theme previews

## 4. Local Log Storage Only
Diagnostic logs and operation history are saved purely to your local system in `~/.config/mint-helper/history.json` and are never automatically transmitted across the network.

## 5. Security of Profile Exports
Exported profile files contain only software selections and desktop configuration flags. They **never contain passwords, browser cookies, SSH keys, GPG keys, or private user files**.
