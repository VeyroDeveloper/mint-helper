# Contributing to mint-helper

Thank you for your interest in contributing to **mint-helper**! We welcome community contributions that help make Linux Mint more intuitive, secure, and delightful for both new and experienced users.

## Project Values & Principles

- **Zero Telemetry**: No tracking, phone-home metrics, or remote analytics are permitted.
- **Safety First**: Destructive system operations (deleting caches, removing software, changing firewall rules) must always require explicit user review and confirmation.
- **Real Linux Integration**: We interface with standard system components (`systemd`, `ufw`, `flatpak`, `apt`, `timeshift`, `cinnamon-settings`) via safe system utilities and D-Bus APIs.
- **No Artificial Gimmicks**: Avoid fake health scores or automated actions that take away user control.

---

## Development Environment Setup

### Prerequisites on Linux Mint (or Debian/Ubuntu-based distributions)

```bash
# Update repositories
sudo apt update

# Install build dependencies
sudo apt install -y \
  build-essential \
  curl \
  git \
  pkg-config \
  libglib2.0-dev \
  libgtk-4-dev \
  libadwaita-1-dev

# Install Rust toolchain via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### Cloning and Building the Desktop Application

```bash
git clone https://github.com/linuxmint-community/mint-helper.git
cd mint-helper/app

# Run formatting check
cargo fmt --check

# Run linter
cargo clippy -- -D warnings

# Run test suite
cargo test

# Build debug binary
cargo build

# Run application locally
cargo run
```

---

## Building the Web Companion / Site

The accompanying website is built using standard modern web tools:

```bash
cd mint-helper/website
npm install
npm run dev     # Starts local server on http://localhost:3000
npm run build   # Verifies static production build
```

---

## Commit Guidelines

We use conventional commit messages to keep our changelog accurate and clean:

- `feat(wizard)`: Add tabbed interface toggle for LibreOffice
- `fix(flatpak)`: Prevent orphaned runtimes check when dependencies remain
- `docs(tutorials)`: Add Timeshift restoration guide
- `perf(sysinfo)`: Throttle CPU polling when window loses focus
- `style`: Fix GTK4 CSS margin alignment

---

## Pull Request Process

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Verify all tests pass and formatting is clean:
   ```bash
   cargo fmt --check
   cargo clippy -- -D warnings
   cargo test
   ```
3. Update `CHANGELOG.md` under `[Unreleased]` with your changes.
4. If modifying configuration schema, update `/docs/architecture.md`.
5. Open a Pull Request referencing any open issue and fill out the PR template.
6. A maintainer will review your contribution for security, code quality, and UX consistency.
