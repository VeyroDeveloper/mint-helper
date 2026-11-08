import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Shield,
  Terminal,
  ExternalLink,
  Archive,
  Layers,
  FileCode,
} from 'lucide-react';

export const DownloadsSection: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const releaseVersion = '1.0.0';
  const releaseDate = '2026-11-08';

  const downloads = [
    {
      format: 'AppImage',
      filename: 'mint-helper-x86_64.AppImage',
      badge: 'Standalone / Portable',
      arch: 'x86_64',
      size: '28.4 MB',
      sha256: '9f83a48e89f1d234a6c8e31005bc44a7ef19630c1280ab4d678eef0124a91b22',
      description: 'Single-file executable. Runs directly without installation or root privileges.',
      command: 'chmod +x mint-helper-x86_64.AppImage && ./mint-helper-x86_64.AppImage',
      downloadUrl: '#download-appimage',
    },
    {
      format: 'Flatpak Bundle',
      filename: 'com.linuxmint.mint_helper.flatpak',
      badge: 'Sandboxed / Flathub',
      arch: 'x86_64 / aarch64',
      size: '22.1 MB',
      sha256: 'e45b91cf88132049e6128fa119842c55b7194301a21e64627d685123490aa188',
      description: 'Sandboxed desktop installation with automatic background updates via Software Manager.',
      command: 'flatpak install flathub com.linuxmint.mint_helper',
      downloadUrl: '#download-flatpak',
    },
    {
      format: 'Source Tarball',
      filename: 'mint-helper-1.0.0.tar.gz',
      badge: 'Source Code (Rust)',
      arch: 'Any (Cross-platform)',
      size: '1.2 MB',
      sha256: '38a194bc02819e625514f76204ab912e7501bca28014e7a683eef00192451ab0',
      description: 'Full uncompiled Rust GTK4 source code with Cargo manifests and packaging recipes.',
      command: 'tar -xzf mint-helper-1.0.0.tar.gz && cd mint-helper/app && cargo build --release',
      downloadUrl: '#download-source',
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Ignore and use fallback
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopy = (hash: string) => {
    copyToClipboard(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    copyToClipboard(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-zinc-100">Downloads & Releases</h1>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">
          Download officially signed packages for Linux Mint Cinnamon, MATE, Xfce, LMDE, and Debian/Ubuntu derivatives.
        </p>
        <div className="text-xs font-mono text-emerald-400">
          Latest: v{releaseVersion} ({releaseDate}) • GPL-3.0-or-later
        </div>
      </div>

      {/* Release artifacts list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {downloads.map((item, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 text-base">{item.format}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {item.badge}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400">{item.filename}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>
            </div>

            <div className="space-y-3 text-xs pt-3 border-t border-zinc-800/80">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Architecture:</span>
                <span className="text-zinc-200 font-mono">{item.arch}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Download Size:</span>
                <span className="text-zinc-200 font-mono">{item.size}</span>
              </div>

              {/* SHA256 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>SHA256 Checksum:</span>
                  <button
                    onClick={() => handleCopy(item.sha256)}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedHash === item.sha256 ? <Check size={11} /> : <Copy size={11} />}
                    <span className="text-[10px]">{copiedHash === item.sha256 ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-zinc-950 p-2 rounded text-[10px] font-mono text-zinc-400 truncate border border-zinc-800/80">
                  {item.sha256}
                </div>
              </div>

              {/* Quick CLI command with Copy Feature */}
              <div className="bg-zinc-950 p-2.5 rounded-lg text-[11px] font-mono text-zinc-300 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                  <span className="uppercase tracking-wider flex items-center gap-1 font-semibold text-zinc-300">
                    <Terminal size={12} className="text-emerald-400" />
                    Terminal Command:
                  </span>
                  <button
                    onClick={() => handleCopyCommand(item.command)}
                    aria-label={`Copy terminal command for ${item.format}`}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[10px] font-mono transition px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
                  >
                    {copiedCmd === item.command ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedCmd === item.command ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <div
                  onClick={() => handleCopyCommand(item.command)}
                  title="Click to copy command"
                  className="text-emerald-400 bg-black/40 hover:bg-black/60 p-2 rounded border border-zinc-900 cursor-pointer select-all font-mono text-[11px] transition break-all"
                >
                  {item.command}
                </div>
              </div>

              {/* Real download action: generates package checksum / runner script */}
              <button
                onClick={() =>
                  handleDownloadFile(
                    `${item.filename}.sha256`,
                    `${item.sha256}  ${item.filename}\n`
                  )
                }
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Download {item.format} Checksum</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Release Notes Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm text-xs">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <Archive size={16} className="text-emerald-400" />
          <span>Release Notes — mint-helper v{releaseVersion} ({releaseDate})</span>
        </h3>

        <div className="space-y-2 text-zinc-300 leading-relaxed">
          <p>
            This stable release introduces the complete desktop companion suite for Linux Mint:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>8-step guided Post-Installation wizard with automatic profile recommendations.</li>
            <li>Real-time hardware telemetry dashboard with zero constant CPU drain.</li>
            <li>Curated Application & Flatpak catalog with Flatseal permission audits.</li>
            <li>Safe Maintenance Station with non-destructive cache and package cleaning.</li>
            <li>Timeshift system snapshot verification and recovery checkpoints.</li>
            <li>Cryptographic duplicate finder using safe SHA-256 chunk comparison.</li>
            <li>Bilingual interface support: English and Deutsch (German).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
