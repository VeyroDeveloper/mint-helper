import React, { useState } from 'react';
import { HomeSection } from './HomeSection';
import { DownloadsSection } from './DownloadsSection';
import { FeaturesSection } from './FeaturesSection';
import { TutorialsSection } from './TutorialsSection';
import { AboutSection } from './AboutSection';
import { ContributingSection } from './ContributingSection';
import { RepoBrowserSection } from './RepoBrowserSection';
import { WebsitePage, LanguageCode, ThemeMode } from '../../types';
import { Sparkles, Globe, Download, BookOpen, Layers, Info, GitPullRequest, Code2 } from 'lucide-react';

interface WebsiteViewProps {
  onLaunchDesktopApp: () => void;
  lang: LanguageCode;
  onSetLang: (lang: LanguageCode) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  onLaunchDesktopApp,
  lang,
  onSetLang,
}) => {
  const [currentPage, setCurrentPage] = useState<WebsitePage>('home');

  const navItems: { id: WebsitePage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Globe size={14} /> },
    { id: 'downloads', label: 'Downloads', icon: <Download size={14} /> },
    { id: 'features', label: 'Features', icon: <Layers size={14} /> },
    { id: 'tutorials', label: 'Tutorials (14)', icon: <BookOpen size={14} /> },
    { id: 'about', label: 'About', icon: <Info size={14} /> },
    { id: 'contributing', label: 'Contributing', icon: <GitPullRequest size={14} /> },
    { id: 'repobrowser', label: 'Source Code', icon: <Code2 size={14} /> },
  ];

  return (
    <div className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Website Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <img src="/mint-helper.svg" alt="mint-helper" className="w-7 h-7 rounded-md" />
            <span className="font-bold text-sm tracking-tight text-zinc-100">mint-helper</span>
            <span className="hidden sm:inline-block text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              v1.0.0
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3 py-1.5 rounded-md transition font-medium flex items-center gap-1.5 ${
                    active
                      ? 'text-emerald-400 bg-emerald-950/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Simulator launch button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSetLang(lang === 'en' ? 'de' : 'en')}
              className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={onLaunchDesktopApp}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition shadow-sm"
            >
              <Sparkles size={13} />
              <span>Launch Desktop App</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="md:hidden overflow-x-auto flex space-x-1 px-3 py-1.5 border-t border-zinc-800/60 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-emerald-900/60 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main page content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {currentPage === 'home' && (
          <HomeSection
            onNavigate={setCurrentPage}
            onLaunchDesktopApp={onLaunchDesktopApp}
            lang={lang}
          />
        )}
        {currentPage === 'downloads' && <DownloadsSection />}
        {currentPage === 'features' && <FeaturesSection />}
        {currentPage === 'tutorials' && <TutorialsSection />}
        {currentPage === 'about' && <AboutSection />}
        {currentPage === 'contributing' && <ContributingSection />}
        {currentPage === 'repobrowser' && <RepoBrowserSection />}
      </main>

      {/* Website Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 text-xs text-zinc-400 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/mint-helper.svg" alt="logo" className="w-5 h-5 rounded" />
            <span className="font-semibold text-zinc-200">mint-helper</span>
            <span>— The Linux Mint Desktop Companion</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <button onClick={() => setCurrentPage('about')} className="hover:text-zinc-200">
              GPL-3.0 License
            </button>
            <button onClick={() => setCurrentPage('tutorials')} className="hover:text-zinc-200">
              Tutorials
            </button>
            <button onClick={() => setCurrentPage('downloads')} className="hover:text-zinc-200">
              AppImage & Flatpak
            </button>
            <button onClick={() => setCurrentPage('contributing')} className="hover:text-zinc-200">
              GitHub
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
