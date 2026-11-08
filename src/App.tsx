import React, { useState } from 'react';
import { WebsiteView } from './components/website/WebsiteView';
import { DesktopApp } from './components/desktop/DesktopApp';
import { AppViewMode, LanguageCode, ThemeMode } from './types';
import { Globe, Monitor, Sparkles } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('website');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<ThemeMode>('mint-y-dark');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Application / Website Mode Switcher Bar */}
      <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3 text-xs select-none shrink-0 z-50">
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-2 hidden sm:inline">
            mint-helper Project Suite:
          </span>

          <button
            onClick={() => setViewMode('website')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
              viewMode === 'website'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Globe size={13} />
            <span>Official Website</span>
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
              viewMode === 'desktop'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Monitor size={13} />
            <span>Desktop Application (GTK4 Simulator)</span>
          </button>
        </div>

        {/* Global Language quick switch */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-400 font-mono hidden md:inline">
            Linux Mint 22 (Cinnamon)
          </span>
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] border border-zinc-700"
            title="Toggle Language: English / Deutsch"
          >
            {lang === 'en' ? '🇺🇸 EN' : '🇩🇪 DE'}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'website' ? (
          <WebsiteView
            onLaunchDesktopApp={() => setViewMode('desktop')}
            lang={lang}
            onSetLang={setLang}
            theme={theme}
            onSetTheme={setTheme}
          />
        ) : (
          <DesktopApp
            lang={lang}
            onSetLang={setLang}
            theme={theme}
            onSetTheme={setTheme}
          />
        )}
      </div>
    </div>
  );
}
