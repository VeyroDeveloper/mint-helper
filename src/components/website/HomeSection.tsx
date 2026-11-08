import React from 'react';
import {
  Sparkles,
  Download,
  Shield,
  Layers,
  Wrench,
  CheckCircle2,
  HardDrive,
  Activity,
  Terminal,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { WebsitePage } from '../../types';

interface HomeSectionProps {
  onNavigate: (page: WebsitePage) => void;
  onLaunchDesktopApp: () => void;
  lang: 'en' | 'de';
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onNavigate,
  onLaunchDesktopApp,
  lang,
}) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>mint-helper 1.0.0 Stable Release</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
          The Linux Mint <br />
          <span className="text-emerald-400">Desktop Companion</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The free, open-source companion for Linux Mint Cinnamon, MATE, and Xfce.
          Unifies post-installation configuration, system health monitoring, Flatpak management, and safe maintenance into a clean GTK4 experience.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('downloads')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition shadow-sm flex items-center gap-2"
          >
            <Download size={16} />
            <span>Download mint-helper</span>
          </button>

          <button
            onClick={onLaunchDesktopApp}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2"
          >
            <Sparkles size={16} className="text-emerald-400" />
            <span>Try Desktop Simulator</span>
          </button>
        </div>

        {/* Badges */}
        <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" /> 100% Free & Open Source
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" /> Zero Telemetry
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" /> Native Rust & GTK4
          </span>
        </div>
      </div>

      {/* Screenshot Showcase */}
      <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 text-zinc-300 font-medium">mint-helper — System Overview (Linux Mint Cinnamon)</span>
          </div>
          <span className="text-[11px] text-zinc-400">GTK4 / Libadwaita</span>
        </div>

        <div className="p-6 bg-zinc-950/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
            <div className="font-semibold text-zinc-200">System Information</div>
            <div className="text-zinc-400 text-[11px] leading-relaxed">
              Real-time hardware telemetry: AMD Ryzen / Intel CPU utilization, DDR5 RAM, NVMe partitions, and PipeWire sound status.
            </div>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
            <div className="font-semibold text-zinc-200">8-Step Setup Wizard</div>
            <div className="text-zinc-400 text-[11px] leading-relaxed">
              Automates browsers, multimedia codecs, Microsoft fonts, LibreOffice ribbon interface, and UFW firewall.
            </div>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
            <div className="font-semibold text-zinc-200">Flatpak & Safety</div>
            <div className="text-zinc-400 text-[11px] leading-relaxed">
              Sandboxed application management, Timeshift snapshot verification, and cache cleanups with user profiles strictly protected.
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-zinc-100">Built for Everyday Linux Mint Users</h2>
          <p className="text-xs text-zinc-400">Everything you need from day 1 to long-term system maintenance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {[
            {
              icon: <Sparkles className="text-emerald-400" size={20} />,
              title: 'Post Installation Wizard',
              desc: 'Configure browsers, codecs, fonts, office ribbon view, and security without typing manual terminal commands.',
            },
            {
              icon: <Activity className="text-emerald-400" size={20} />,
              title: 'System Health Audit',
              desc: 'Genuine status checks on firewall, system packages, and disk thresholds without fake gamified scores.',
            },
            {
              icon: <Layers className="text-emerald-400" size={20} />,
              title: 'Flatpak & App Manager',
              desc: 'Browse curated Flathub software, audit camera/mic sandbox permissions, and integrate with Flatseal.',
            },
            {
              icon: <Wrench className="text-emerald-400" size={20} />,
              title: 'Safe Maintenance',
              desc: 'Clean obsolete apt archives, synchronize Flathub metadata, and autoremove unneeded dependencies safely.',
            },
            {
              icon: <HardDrive className="text-emerald-400" size={20} />,
              title: 'Recovery & Timeshift',
              desc: 'Check Timeshift snapshot schedules and generate checkpoints before major system changes.',
            },
            {
              icon: <Shield className="text-emerald-400" size={20} />,
              title: 'Zero Telemetry & Tracking',
              desc: 'Completely private. No accounts, no background analytics, no ads, and no external AI models.',
            },
          ].map((f, i) => (
            <div key={i} className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-lg space-y-2">
              <div>{f.icon}</div>
              <h3 className="font-semibold text-zinc-200 text-sm pt-1">{f.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
