# Automatic Update Checks Configuration

`mint-helper` includes a configurable, privacy-first automatic update checking subsystem designed to respect system bandwidth and avoid package manager lock contention.

---

## 1. Design Philosophy

1. **Check Automatically, Never Install Automatically**: System updates are critical operations. `mint-helper` only notifies users and stages information; installation is always an explicit user action with full review.
2. **Lock-Safe Execution**: APT checks avoid running `apt-get update` while package managers (or `unattended-upgrades`) hold `/var/lib/dpkg/lock-frontend`.
3. **Low Bandwidth Overhead**: Uses HTTP ETag headers and minimal metadata queries against GitHub Releases and Flathub remotes.

---

## 2. Configuration Options

Settings are stored locally in `~/.config/mint-helper/config.json`:

```json
{
  "updates": {
    "auto_check_enabled": true,
    "frequency": "daily",
    "channel": "stable",
    "notify_on_update": true,
    "only_notify_security": false,
    "auto_download_appimage": false,
    "retention_days": 90
  }
}
```

### Supported Frequencies:
- `daily`: Checks once every 24 hours (Default).
- `startup`: Checks when `mint-helper` launches.
- `weekly`: Checks once every 7 days.
- `manual`: Completely disables background polling. Checks occur only when the user clicks "Check for updates".

---

## 3. Desktop Notifications

When updates are found, a native desktop notification is sent through `libnotify` (`notify-send`):
- **Subject**: "New mint-helper update available (v1.1.0)" or "Linux Mint Updates: 4 available".
- **Actions**: "Open Update Center", "Dismiss", "Remind Me Later".
