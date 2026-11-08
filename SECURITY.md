# Security Policy

The mint-helper team takes the security of our users and their Linux installations seriously. Because mint-helper manages system software, firewall rules, and cleanup operations, safety and privilege boundaries are paramount.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report vulnerabilities using one of the following methods:

1. **GitHub Security Advisories (Preferred)**: Navigate to the **Security** tab of our repository and click **"Report a vulnerability"** to open a confidential draft advisory.
2. If the advisory feature is temporarily unavailable, submit a secure email directly through the project maintainer key listed in the GitHub repository's security contacts.

### What to Include in Your Report

To help us investigate and resolve the issue quickly, please include:
- A clear description of the vulnerability and its potential impact.
- The version of mint-helper and the Linux distribution/kernel tested.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Any recommendations on mitigation or remediation.

### Response Timeline

- **Initial Acknowledgement**: Within 48 hours of receipt.
- **Assessment & Triage**: Within 5 business days.
- **Patch Release & Advisory Disclosure**: Coordinated disclosure after verifying the fix.

## Security Architecture Principles

- **No Root Execution**: mint-helper itself must never run permanently as root. Privileged tasks (APT installation, UFW toggle, systemd services) delegate to PolicyKit (`pkexec`) with explicit UI prompts.
- **Safe Cleanup**: Temporary and cache file cleaners strictly avoid recursion into protected system directories (`/`, `/bin`, `/boot`, `/etc`, `/usr`, `/var/lib`).
- **Data Preservation**: User profiles (e.g., `~/.mozilla/firefox`, Thunderbird profiles, GPG/SSH keys) are excluded from automated cleanup and require explicit per-item confirmation.
