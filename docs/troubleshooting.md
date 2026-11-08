# Troubleshooting & Diagnostics

Common issues and remediation procedures for mint-helper on Linux Mint.

---

## 1. Package Manager Lock (`/var/lib/dpkg/lock-frontend`)

### Symptom
When attempting to install codecs, fonts, or developer tools, you see:
`"Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)"`

### Cause
Another package manager (such as `mintUpdate`, the Linux Mint Update Manager, Synaptic, or an active `apt` command in another terminal) is currently running.

### Solution
1. Check if Update Manager is currently refreshing or installing updates. Allow it to finish.
2. In mint-helper, click **Refresh** under Maintenance.
3. If a previous background process hung, check with:
   ```bash
   ps aux | grep -E 'apt|dpkg'
   ```

---

## 2. UFW Firewall Status Reports Disabled or Permission Denied

### Symptom
Firewall toggle displays an authentication error or remains disabled.

### Solution
mint-helper invokes PolicyKit (`pkexec ufw ...`) to avoid running the entire GUI application as root. Ensure PolicyKit authentication agent (`polkit-mate-authentication-agent-1` or `polkit-gnome-authentication-agent-1`) is running in your desktop session.

Test manual authorization:
```bash
sudo ufw status verbose
```

---

## 3. Flatpak Metadata Out of Date

### Symptom
An application in the Application Manager shows as available on Flathub, but installation reports that the remote reference was not found.

### Solution
In mint-helper, go to **Maintenance** -> **Refresh Flatpak Metadata**, or run:
```bash
flatpak update --appstream
```

---

## 4. Timeshift Snapshots Not Detected

### Symptom
The Recovery center reports `"Timeshift is not installed or no snapshots found"`.

### Solution
1. Ensure Timeshift is installed:
   ```bash
   sudo apt install timeshift
   ```
2. Open Timeshift from the Linux Mint menu and perform the initial Wizard (select RSYNC or BTRFS depending on your disk layout).
3. Once the first snapshot is generated, mint-helper will automatically detect it.
