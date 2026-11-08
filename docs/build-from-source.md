# Building mint-helper from Source

Building from source allows developers and advanced users to run the latest development code, inspect every line, or customize system integrations.

---

## 1. System Requirements

- **Supported OS**: Linux Mint 21.x / 22.x (Cinnamon, MATE, Xfce), LMDE 6, Ubuntu 22.04 LTS or newer.
- **Architecture**: x86_64, aarch64.
- **Rust Compiler**: Rust 1.78 or newer.

---

## 2. Install Build Dependencies

Install the required development headers and compilers:

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  git \
  pkg-config \
  libglib2.0-dev \
  libgtk-4-dev \
  libadwaita-1-dev
```

---

## 3. Install Rust Toolchain

If Rust is not yet installed on your machine, install it via the official `rustup` installer:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

Verify your installation:
```bash
rustc --version
cargo --version
```

---

## 4. Clone and Compile

```bash
# Clone the repository
git clone https://github.com/linuxmint-community/mint-helper.git
cd mint-helper/app

# Build debug binary
cargo build

# Run unit tests to verify logic
cargo test

# Build optimized release binary
cargo build --release
```

The compiled release binary is located at `target/release/mint-helper`.

---

## 5. System-wide Installation (Optional)

To install the binary and its desktop launcher into `/usr/local`:

```bash
sudo install -m 755 target/release/mint-helper /usr/local/bin/
sudo install -m 644 ../packaging/appimage/mint-helper.desktop /usr/local/share/applications/
sudo install -m 644 ../assets/icons/mint-helper.svg /usr/local/share/icons/hicolor/scalable/apps/
sudo update-desktop-database
```
