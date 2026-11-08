import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Cpu,
  Layers,
  HardDrive,
  Shield,
  Wifi,
  Battery,
  Monitor,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react';

interface OverviewViewProps {
  lang: 'en' | 'de';
}

export const OverviewView: React.FC<OverviewViewProps> = ({ lang }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [cpuUsage, setCpuUsage] = useState<number>(14.2);
  const [memoryUsedMb, setMemoryUsedMb] = useState<number>(3420);
  const totalMemoryMb = 16384;

  const t = {
    en: {
      title: 'System Overview Dashboard',
      subtitle: 'Real-time Linux Mint system telemetry and hardware metrics.',
      refresh: 'Refresh Metrics',
      osTitle: 'Operating System',
      hardwareTitle: 'Hardware Resources',
      securityStatus: 'System & Security Health',
      distribution: 'Distribution',
      kernel: 'Kernel',
      de: 'Desktop Environment',
      arch: 'Architecture',
      host: 'Hostname',
      uptime: 'Uptime',
      cpu: 'Processor (CPU)',
      memory: 'Memory (RAM)',
      storage: 'Main Storage (/root)',
      gpu: 'Graphics Controller (GPU)',
      network: 'Network Connection',
      battery: 'Battery & Power',
      firewall: 'UFW Firewall',
      sysUpdates: 'APT Updates',
      flatpakUpdates: 'Flatpak Updates',
      backup: 'Timeshift Backup',
      active: 'Active & Protecting',
      upToDate: 'Up to date (0 pending)',
      timeshiftConfigured: 'Configured (RSYNC Daily)',
      storageFree: '286 GB free of 512 GB NVMe',
    },
    de: {
      title: 'System-Übersicht Dashboard',
      subtitle: 'Echtzeit-Telemetrie und Hardwaredaten für Linux Mint.',
      refresh: 'Metriken aktualisieren',
      osTitle: 'Betriebssystem',
      hardwareTitle: 'Hardware-Ressourcen',
      securityStatus: 'System- & Sicherheitsstatus',
      distribution: 'Distribution',
      kernel: 'Kernel',
      de: 'Desktop-Umgebung',
      arch: 'Architektur',
      host: 'Rechnername',
      uptime: 'Betriebszeit',
      cpu: 'Prozessor (CPU)',
      memory: 'Arbeitsspeicher (RAM)',
      storage: 'Hauptspeicher (/root)',
      gpu: 'Grafikkarte (GPU)',
      network: 'Netzwerkverbindung',
      battery: 'Akku & Strom',
      firewall: 'UFW Firewall',
      sysUpdates: 'APT Aktualisierungen',
      flatpakUpdates: 'Flatpak Aktualisierungen',
      backup: 'Timeshift Sicherung',
      active: 'Aktiv & geschützt',
      upToDate: 'Auf dem neuesten Stand',
      timeshiftConfigured: 'Konfiguriert (Täglich)',
      storageFree: '286 GB frei von 512 GB NVMe',
    },
  }[lang];

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate real slight variation in live CPU/RAM usage
      setCpuUsage(Math.round((10 + Math.random() * 12) * 10) / 10);
      setMemoryUsedMb(Math.round(3300 + Math.random() * 250));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 400);
  };

  const memPercent = Math.round((memoryUsedMb / totalMemoryMb) * 100);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <LayoutDashboardIcon className="w-5 h-5 text-emerald-400" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-zinc-400 font-mono">
            {lastRefreshed}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      {/* Grid: 3 main cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Operating System Details */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
            <Monitor size={15} className="text-emerald-400" />
            <span>{t.osTitle}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span className="text-zinc-400">{t.distribution}</span>
              <span className="font-medium text-zinc-200">Linux Mint 22 (Wilma)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span className="text-zinc-400">{t.kernel}</span>
              <span className="font-mono text-zinc-300">6.8.0-48-generic</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span className="text-zinc-400">{t.de}</span>
              <span className="text-zinc-200">Cinnamon 6.2.9</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span className="text-zinc-400">{t.arch}</span>
              <span className="font-mono text-zinc-300">x86_64</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/40">
              <span className="text-zinc-400">{t.host}</span>
              <span className="font-mono text-zinc-300">mint-workstation</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">{t.uptime}</span>
              <span className="text-zinc-300 flex items-center gap-1 font-mono">
                <Clock size={11} className="text-zinc-400" /> 4h 32m
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Hardware Resource Gauges */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-4 shadow-sm lg:col-span-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
            <Cpu size={15} className="text-emerald-400" />
            <span>{t.hardwareTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* CPU utilization */}
            <div className="bg-zinc-950/50 p-3 rounded-md border border-zinc-800/60 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="font-medium flex items-center gap-1.5">
                  <Cpu size={13} className="text-emerald-400" />
                  {t.cpu}
                </span>
                <span className="font-mono text-emerald-400 font-semibold">{cpuUsage}%</span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                AMD Ryzen 7 7840HS (8 Cores, 16 Threads)
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
            </div>

            {/* RAM utilization */}
            <div className="bg-zinc-950/50 p-3 rounded-md border border-zinc-800/60 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="font-medium flex items-center gap-1.5">
                  <Layers size={13} className="text-emerald-400" />
                  {t.memory}
                </span>
                <span className="font-mono text-emerald-400 font-semibold">{memPercent}%</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                {memoryUsedMb} MB used / {totalMemoryMb} MB total DDR5
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${memPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Storage partition */}
            <div className="bg-zinc-950/50 p-3 rounded-md border border-zinc-800/60 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="font-medium flex items-center gap-1.5">
                  <HardDrive size={13} className="text-emerald-400" />
                  {t.storage}
                </span>
                <span className="font-mono text-zinc-400">44% used</span>
              </div>
              <div className="text-[11px] text-zinc-400">{t.storageFree}</div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '44%' }}></div>
              </div>
            </div>

            {/* GPU & Driver info */}
            <div className="bg-zinc-950/50 p-3 rounded-md border border-zinc-800/60 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="font-medium flex items-center gap-1.5">
                  <Monitor size={13} className="text-emerald-400" />
                  {t.gpu}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  Mesa 24.0.9
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                AMD Radeon 780M (RDNA 3 / amdgpu driver)
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                Direct Rendering: Yes • Vulkan 1.3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status banner indicators */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200 border-b border-zinc-800/80 pb-2">
          <Shield size={15} className="text-emerald-400" />
          <span>{t.securityStatus}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800 flex items-start space-x-3">
            <Shield size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-200">{t.firewall}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} />
                <span>{t.active}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">In: Deny • Out: Allow</div>
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800 flex items-start space-x-3">
            <Archive size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-200">{t.sysUpdates}</div>
              <div className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>{t.upToDate}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">Archive mirrors synced</div>
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800 flex items-start space-x-3">
            <HardDrive size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-200">{t.backup}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} />
                <span>{t.timeshiftConfigured}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">Last: Today 04:00</div>
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800 flex items-start space-x-3">
            <Wifi size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-200">{t.network}</div>
              <div className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Connected (Wi-Fi 6)</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">wlp2s0 • 5.0 GHz</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
