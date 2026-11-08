import React from 'react';
import {
  Sparkles,
  Activity,
  Package,
  Wrench,
  Shield,
  HardDrive,
  RotateCcw,
  Palette,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <RefreshCw className="text-emerald-400" size={24} />,
      title: 'Unified Update Center',
      desc: 'Centralized package and application lifecycle management. Coordinates mint-helper GitHub releases (with atomic AppImage rollback), native Linux Mint APT system updates (with kernel review), and Flatpak runtimes with unused runtime cleanup.',
    },
    {
      icon: <Sparkles className="text-emerald-400" size={24} />,
      title: 'Post Installation Wizard',
      desc: 'The centerpiece of mint-helper. Helps new and experienced Linux Mint users set up browsers, multimedia codecs (mint-meta-codecs), TrueType compatibility fonts, the LibreOffice ribbon-style layout, and secure firewall defaults in minutes without manual CLI troubleshooting.',
    },
    {
      icon: <Activity className="text-emerald-400" size={24} />,
      title: 'Real System Health Audit',
      desc: 'No artificial health scores or arbitrary percentages. Displays real operational metrics: UFW status, pending APT and Flatpak updates, root partition capacity, and Timeshift restore schedules.',
    },
    {
      icon: <Package className="text-emerald-400" size={24} />,
      title: 'Application & Flatpak Management',
      desc: 'Browse, install, and audit verified desktop applications. Differentiates native APT distribution packages from sandboxed Flatpaks and portable AppImages. Inspects permissions and links with Flatseal.',
    },
    {
      icon: <Wrench className="text-emerald-400" size={24} />,
      title: 'Maintenance Center',
      desc: 'Keeps your Linux Mint installation performing at its best. Check APT distribution updates, refresh Flathub appstream metadata, safely clean out downloaded package archives, and autoremove orphaned packages.',
    },
    {
      icon: <Shield className="text-emerald-400" size={24} />,
      title: 'Hardened Security & Firewall',
      desc: 'Easily enable Uncomplicated Firewall (UFW) with safe inbound deny policies. Configure automated unattended security updates to receive zero-day kernel and browser vulnerability fixes automatically.',
    },
    {
      icon: <HardDrive className="text-emerald-400" size={24} />,
      title: 'Storage & Non-Destructive Cleanup',
      desc: 'Detailed disk usage visualization and cryptographic duplicate file finder using SHA-256 chunk matching. Never deletes personal documents, browser history, or user databases automatically.',
    },
    {
      icon: <RotateCcw className="text-emerald-400" size={24} />,
      title: 'Recovery & Timeshift Backups',
      desc: 'Full integration with Linux Mint’s Timeshift utility. Detects active snapshot schedules (RSYNC or BTRFS) and recommends checkpoints before system updates.',
    },
    {
      icon: <Palette className="text-emerald-400" size={24} />,
      title: 'Cinnamon Desktop Customization',
      desc: 'Personalize window borders, GTK themes (Mint-Y, Mint-X), icon sets, and cursor packs. Provides direct access to the official Cinnamon Spices directory for applets and desklets.',
    },
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-zinc-100">Application Features</h1>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">
          Every tool is designed to empower user control, protect existing data, and follow native Linux standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-3 shadow-sm hover:border-zinc-700 transition"
          >
            <div className="p-2.5 bg-zinc-950 rounded-lg w-fit border border-zinc-800">
              {feat.icon}
            </div>
            <h3 className="text-base font-bold text-zinc-100">{feat.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
