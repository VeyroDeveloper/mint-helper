import React from 'react';
import { Info, Shield, CheckCircle2, Heart, Code2 } from 'lucide-react';

interface AboutViewProps {
  lang: 'en' | 'de';
}

export const AboutView: React.FC<AboutViewProps> = ({ lang }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-400" />
          <span>About mint-helper</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Open-source Linux desktop companion and post-installation manager for Linux Mint.
        </p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 space-y-4 shadow-sm text-xs">
        <div className="flex items-center space-x-3 pb-3 border-b border-zinc-800">
          <img src="/mint-helper.svg" alt="mint-helper logo" className="w-12 h-12 rounded-lg" />
          <div>
            <div className="font-bold text-base text-zinc-100">mint-helper 1.0.0</div>
            <div className="text-emerald-400 font-mono text-[11px]">GPL-3.0-or-later • Written in Rust & GTK4</div>
          </div>
        </div>

        <div className="space-y-2 text-zinc-300 leading-relaxed">
          <p>
            <strong>mint-helper</strong> is an independent open-source project created to make Linux Mint easier for new users and more convenient for experienced administrators.
          </p>
          <p>
            It unifies initial setup (browsers, multimedia codecs, Microsoft fonts, firewall, LibreOffice ribbon interface) with daily system care: Flatpak permission audits, Timeshift backup verification, and safe temporary file cleanup.
          </p>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-200">The mint-helper Open Source Pledge:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Zero telemetry and tracking</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>No AI API calls or LLM reliance</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>No accounts, ads, or monetization</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>100% Free & Open Source (GPLv3)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-zinc-400 text-[11px] flex justify-between items-center">
          <span>Developed with care for the Linux Mint Community</span>
          <span className="font-mono">Linux Mint Cinnamon / MATE / Xfce</span>
        </div>
      </div>
    </div>
  );
};
