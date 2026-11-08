import React from 'react';
import { Shield, CheckCircle2, Heart, ExternalLink, Code2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto text-xs">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">About mint-helper</h1>
        <p className="text-xs text-zinc-400">Project philosophy, licensing, privacy, and community roadmap.</p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm leading-relaxed text-zinc-300">
        <h2 className="text-base font-bold text-zinc-100">Project Philosophy</h2>
        <p>
          Linux Mint is widely celebrated for its ease of use, stability, and thoughtful desktop experience.
          However, every fresh installation still requires a series of manual setup steps: installing proprietary media codecs, setting up Microsoft compatibility fonts, configuring the firewall, setting up browser ad-blocking, and configuring LibreOffice toolbars.
        </p>
        <p>
          <strong>mint-helper</strong> was built to bring these routine post-installation tasks into a unified, non-destructive, and transparent desktop station.
          It prioritizes safety above all: user data is never deleted without explicit confirmation, commands are always reviewable before execution, and the application requires zero network connections beyond official package mirrors.
        </p>

        <h2 className="text-base font-bold text-zinc-100 pt-3">Open Source Commitment & License</h2>
        <p>
          mint-helper is free software licensed under the <strong>GNU General Public License version 3 or later (GPL-3.0-or-later)</strong>.
          You are free to inspect, modify, fork, and distribute the software under the terms of the GNU GPLv3.
        </p>

        <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2 text-zinc-400">
          <div className="font-semibold text-zinc-200">Our Uncompromising Privacy Guarantee:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>No telemetry or background analytics</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>No AI API calls or cloud processing</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>No advertisements or sponsored links</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Local diagnostic audit logs only</span>
            </div>
          </div>
        </div>

        <h2 className="text-base font-bold text-zinc-100 pt-3">Development Status</h2>
        <p>
          Version 1.0.0 represents the first stable public release. Future releases will expand localization to French, Spanish, and Italian, and introduce direct Timeshift D-Bus socket integration.
        </p>
      </div>
    </div>
  );
};
