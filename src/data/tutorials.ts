import { TutorialItem } from '../types';

export const TUTORIALS: TutorialItem[] = [
  {
    id: 'downloading-mint-helper',
    title: '1. Downloading mint-helper',
    category: 'Getting Started',
    description: 'How to safely acquire the official release package and verify its integrity.',
    steps: [
      {
        title: 'Choose your preferred package format',
        description: 'For Linux Mint, the Flatpak package is recommended for seamless updates, while the AppImage requires no installation.',
      },
      {
        title: 'Download from the official release page',
        description: 'Visit the GitHub Releases section or the Downloads tab and download mint-helper-x86_64.AppImage or the Flatpak bundle.',
        command: 'curl -sSL -O https://github.com/linuxmint-community/mint-helper/releases/latest/download/mint-helper-x86_64.AppImage',
      },
      {
        title: 'Download the checksum file',
        description: 'Always download the accompanying SHA256SUM file to guard against corrupted or tampered downloads.',
        command: 'curl -sSL -O https://github.com/linuxmint-community/mint-helper/releases/latest/download/mint-helper-x86_64.AppImage.sha256',
      },
      {
        title: 'Verify SHA-256 integrity',
        description: 'Run the verification command. You should see "mint-helper-x86_64.AppImage: OK".',
        command: 'sha256sum -c mint-helper-x86_64.AppImage.sha256',
      },
    ],
  },
  {
    id: 'making-appimage-executable',
    title: '2. Making AppImage Executable',
    category: 'Getting Started',
    description: 'Grant execution permissions using the Linux Mint file manager or terminal.',
    steps: [
      {
        title: 'Method A: Using Nemo File Manager (GUI)',
        description: 'Open Nemo, right-click the downloaded AppImage file, select Properties, open the Permissions tab, and check "Allow executing file as program".',
      },
      {
        title: 'Method B: Using Terminal (CLI)',
        description: 'Navigate to your Downloads folder and run chmod +x on the AppImage file.',
        command: 'chmod +x ~/Downloads/mint-helper-x86_64.AppImage',
      },
    ],
  },
  {
    id: 'running-appimage',
    title: '3. Running the AppImage',
    category: 'Getting Started',
    description: 'Launch mint-helper directly without installation or system modifications.',
    steps: [
      {
        title: 'Double-click in File Manager',
        description: 'Simply double-click mint-helper-x86_64.AppImage to start the application immediately.',
      },
      {
        title: 'Or run from terminal for diagnostic logging',
        description: 'Pass the --debug flag to view real-time system metrics queries in your terminal.',
        command: './mint-helper-x86_64.AppImage --debug',
      },
      {
        title: 'Optional: Automatic desktop integration with Gear Lever',
        description: 'If you install Gear Lever via mint-helper, AppImages are automatically moved to an organized directory and added to the Linux Mint application menu with full desktop icons.',
      },
    ],
  },
  {
    id: 'installing-flatpak',
    title: '4. Installing Flatpak on Linux Mint / Ubuntu',
    category: 'Getting Started',
    description: 'Ensure the Flatpak daemon and Flathub repository are active.',
    steps: [
      {
        title: 'Verify Flatpak presence',
        description: 'Linux Mint includes Flatpak pre-installed by default. On other Ubuntu/Debian machines, run:',
        command: 'sudo apt update && sudo apt install -y flatpak',
      },
      {
        title: 'Add Flathub remote',
        description: 'Flathub is the largest repository of verified Linux desktop applications.',
        command: 'flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo',
      },
    ],
  },
  {
    id: 'installing-mint-helper-through-flatpak',
    title: '5. Installing mint-helper through Flatpak',
    category: 'Getting Started',
    description: 'Install mint-helper via Flathub for automatic background updates.',
    steps: [
      {
        title: 'Run the installation command',
        description: 'Install com.linuxmint.mint_helper from the Flathub repository:',
        command: 'flatpak install flathub com.linuxmint.mint_helper',
      },
      {
        title: 'Launch from menu or terminal',
        description: 'mint-helper will appear in your application menu under Administration, or launch via command line:',
        command: 'flatpak run com.linuxmint.mint_helper',
      },
    ],
  },
  {
    id: 'building-from-source',
    title: '6. Building mint-helper from Source',
    category: 'Packaging & Advanced',
    description: 'Compile the Rust GTK4 application directly from repository source code.',
    steps: [
      {
        title: 'Install build dependencies',
        description: 'Install the C compiler, GLib, GTK4, and Libadwaita development headers:',
        command: 'sudo apt update && sudo apt install -y build-essential pkg-config libglib2.0-dev libgtk-4-dev libadwaita-1-dev curl git',
      },
      {
        title: 'Install Rust compiler via rustup',
        description: 'Install stable Rust toolchain (1.78 or newer):',
        command: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source $HOME/.cargo/env",
      },
      {
        title: 'Clone and compile release binary',
        description: 'Clone the repository and run Cargo release build with LTO optimizations enabled:',
        command: 'git clone https://github.com/linuxmint-community/mint-helper.git\ncd mint-helper/app\ncargo build --release',
      },
      {
        title: 'Run compiled binary',
        description: 'Run the freshly compiled release binary:',
        command: './target/release/mint-helper',
      },
    ],
  },
  {
    id: 'creating-an-appimage',
    title: '7. Creating an AppImage with linuxdeploy',
    category: 'Packaging & Advanced',
    description: 'How to build the portable AppImage package from a compiled binary.',
    steps: [
      {
        title: 'Ensure release binary is built',
        description: 'Run cargo build --release inside the app/ directory.',
      },
      {
        title: 'Run the automated build script',
        description: 'Execute the packaging script which sets up AppDir and packages with linuxdeploy:',
        command: 'bash packaging/appimage/build-appimage.sh',
      },
      {
        title: 'Verify outputs',
        description: 'Inspect the resulting mint-helper-x86_64.AppImage and its generated SHA256 checksum file.',
      },
    ],
  },
  {
    id: 'using-post-installation',
    title: '8. Using the Post-Installation Wizard',
    category: 'Post-Install',
    description: 'Configure a fresh Linux Mint system using guided steps and setup profiles.',
    steps: [
      {
        title: 'Launch Post Installation in mint-helper',
        description: 'Click "Post Installation" on the left navigation sidebar.',
      },
      {
        title: 'Choose Automatic or Manual mode',
        description: 'Pick a preset profile (Everyday User, Developer, Gaming, Creative) or customize individual steps.',
      },
      {
        title: 'Review the generated Installation Plan',
        description: 'Examine the review screen divided into INSTALL, REMOVE, CONFIGURE, KEEP, and OPTIONAL CLEANUP. Verify commands before proceeding.',
      },
      {
        title: 'Confirm and execute changes',
        description: 'Click "Execute Plan". Watch the real-time queue progress bar and log console.',
      },
    ],
  },
  {
    id: 'installing-firefox',
    title: '9. Installing and Managing Firefox',
    category: 'Post-Install',
    description: 'Keep or customize Firefox on Linux Mint without losing user data.',
    steps: [
      {
        title: 'Verify existing Firefox installation',
        description: 'Linux Mint provides official Firefox deb packages maintained in direct partnership with Mozilla.',
      },
      {
        title: 'Protection of user profiles',
        description: 'mint-helper strictly preserves ~/.mozilla/firefox. Even if you choose to switch default browsers, your bookmarks, history, and passwords are never deleted.',
      },
    ],
  },
  {
    id: 'installing-ublock-origin',
    title: '10. Installing Official uBlock Origin on Firefox',
    category: 'Post-Install',
    description: 'Protect your privacy and block ads with the verified open-source extension.',
    steps: [
      {
        title: 'Open Firefox Add-ons repository',
        description: 'Visit the official Mozilla Add-ons page for uBlock Origin by Raymond Hill.',
        note: 'Always install from addons.mozilla.org; never download untrusted third-party xpi files.',
      },
      {
        title: 'Click "Add to Firefox"',
        description: 'Grant the required permissions for content blocking.',
      },
    ],
  },
  {
    id: 'configuring-the-firewall',
    title: '11. Configuring the UFW Firewall',
    category: 'Security & Maintenance',
    description: 'Set up Uncomplicated Firewall (UFW) with safe incoming and outgoing rules.',
    steps: [
      {
        title: 'Open Security or Maintenance in mint-helper',
        description: 'Check the Firewall section for current UFW status.',
      },
      {
        title: 'Enable with default safe policy',
        description: 'In mint-helper, toggle the firewall switch. Behind the scenes, it executes:',
        command: 'sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw enable',
      },
      {
        title: 'Inspect active rules',
        description: 'Verify status and active ports:',
        command: 'sudo ufw status verbose',
      },
    ],
  },
  {
    id: 'using-timeshift',
    title: '12. Using Timeshift for System Restores',
    category: 'Security & Maintenance',
    description: 'Protect your operating system before making major system changes.',
    steps: [
      {
        title: 'Check Timeshift in Recovery Center',
        description: 'mint-helper detects if Timeshift is installed and displays available snapshots.',
      },
      {
        title: 'Create an on-demand snapshot',
        description: 'Click "Create Snapshot" before running major system changes or driver updates:',
        command: 'sudo timeshift --create --comments "Before mint-helper setup"',
      },
      {
        title: 'Restore if needed',
        description: 'If any update causes system instability, launch Timeshift from the boot USB or desktop menu and restore your snapshot in under 2 minutes.',
      },
    ],
  },
  {
    id: 'managing-flatpak-permissions',
    title: '13. Managing Flatpak Permissions with Flatseal',
    category: 'Security & Maintenance',
    description: 'Audit and restrict application access to your microphone, camera, network, and files.',
    steps: [
      {
        title: 'Install Flatseal via mint-helper',
        description: 'Find Flatseal in the Utilities section or install directly:',
        command: 'flatpak install flathub com.github.tchx84.Flatseal',
      },
      {
        title: 'Review application permissions',
        description: 'Open Flatseal to inspect permissions for each installed Flatpak. Easily toggle filesystem, device, or socket access with one click.',
      },
    ],
  },
  {
    id: 'troubleshooting-errors',
    title: '14. Troubleshooting Common Linux Mint Issues',
    category: 'Packaging & Advanced',
    description: 'How to resolve apt locks, broken dependencies, and package issues safely.',
    steps: [
      {
        title: 'Fixing apt lock errors (/var/lib/dpkg/lock-frontend)',
        description: 'Wait for mintUpdate or another package manager to finish, or inspect running apt processes:',
        command: 'ps aux | grep -E "apt|dpkg"',
      },
      {
        title: 'Fixing broken package dependencies',
        description: 'Run apt configure and install fix-broken:',
        command: 'sudo dpkg --configure -a\nsudo apt --fix-broken install',
      },
      {
        title: 'Refreshing Flatpak appstream cache',
        description: 'If Flatpak metadata becomes stale:',
        command: 'flatpak repair\nflatpak update --appstream',
      },
    ],
  },
];
