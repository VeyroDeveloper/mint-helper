import React from 'react';
import { Cpu, Monitor, Wifi, Volume2, Battery, HardDrive, ExternalLink } from 'lucide-react';

interface HardwareViewProps {
  lang: 'en' | 'de';
}

export const HardwareView: React.FC<HardwareViewProps> = ({ lang }) => {
  const t = {
    en: {
      title: 'Hardware & Drivers',
      subtitle: 'Hardware component detection and Linux Mint Driver Manager integration.',
      driverManagerBtn: 'Launch Linux Mint Driver Manager',
      driverPolicy: 'Driver Policy: mint-helper never silently installs or replaces working kernel modules.',
    },
    de: {
      title: 'Hardware & Treiber',
      subtitle: 'Hardware-Erkennung und Integration der Linux Mint Treiberverwaltung.',
      driverManagerBtn: 'Treiberverwaltung starten',
      driverPolicy: 'Treiberrichtlinie: mint-helper installiert niemals ungefragt Kernel-Treiber.',
    },
  }[lang];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="text-xs text-zinc-300">
          <span className="font-semibold text-zinc-100">Linux Mint Driver Manager: </span>
          Use the official Mint utility to manage proprietary NVIDIA graphics drivers and Broadcom wireless firmware.
        </div>
        <button
          onClick={() => alert('Command to open on Linux: driver-manager')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>{t.driverManagerBtn}</span>
          <ExternalLink size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* CPU */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200">
            <Cpu size={15} className="text-emerald-400" />
            <span>Central Processor (CPU)</span>
          </div>
          <div className="space-y-1 text-zinc-400">
            <div>Model: AMD Ryzen 7 7840HS with Radeon 780M Graphics</div>
            <div>Topology: 8 Physical Cores, 16 Logical Threads @ 3.80GHz - 5.10GHz</div>
            <div>Virtualization: AMD-V enabled (KVM acceleration ready)</div>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200">
            <Monitor size={15} className="text-emerald-400" />
            <span>Graphics Controller (GPU)</span>
          </div>
          <div className="space-y-1 text-zinc-400">
            <div>Device: AMD Radeon 780M Graphics (Phoenix1)</div>
            <div>Driver: amdgpu (Kernel module open-source)</div>
            <div>OpenGL: Mesa 24.0.9-0ubuntu0.1 • Vulkan 1.3.275</div>
          </div>
        </div>

        {/* Wi-Fi */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200">
            <Wifi size={15} className="text-emerald-400" />
            <span>Wireless Network Adapter</span>
          </div>
          <div className="space-y-1 text-zinc-400">
            <div>Controller: MediaTek MT7921 802.11ax Wi-Fi 6 Adapter</div>
            <div>Interface: wlp2s0 (Driver: mt7921e)</div>
            <div>Status: Connected with WPA3 Security</div>
          </div>
        </div>

        {/* Audio */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-zinc-200">
            <Volume2 size={15} className="text-emerald-400" />
            <span>Sound Subsystem</span>
          </div>
          <div className="space-y-1 text-zinc-400">
            <div>Server: PipeWire 1.0.5 with WirePlumber session manager</div>
            <div>Audio Device: Family 17h/19h HD Audio Controller</div>
            <div>Profiles: Stereo Analog Out, Digital HDMI Audio</div>
          </div>
        </div>
      </div>
    </div>
  );
};
