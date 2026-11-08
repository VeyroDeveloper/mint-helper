import React, { useState } from 'react';
import { Palette, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

interface CustomizationViewProps {
  lang: 'en' | 'de';
  onLogAction?: (action: string, category: string, status: 'SUCCESS' | 'WARNING', details: string) => void;
}

export const CustomizationView: React.FC<CustomizationViewProps> = ({ lang, onLogAction }) => {
  const [selectedTheme, setSelectedTheme] = useState('Mint-Y-Dark');
  const [selectedIcon, setSelectedIcon] = useState('Mint-Y-Aqua');

  const t = {
    en: {
      title: 'Desktop Customization',
      subtitle: 'Tailor Linux Mint Cinnamon appearance, themes, icon packs, and Spices applets.',
      gtkThemes: 'Desktop & Window Themes (GTK)',
      iconThemes: 'Icon Themes',
      cinnamonSpices: 'Cinnamon Spices Repository',
      spicesDesc: 'Download verified applets, desklets, and extensions from the official Cinnamon Spices directory.',
      openThemesBtn: 'Launch Cinnamon Themes Settings',
    },
    de: {
      title: 'Desktop-Anpassung',
      subtitle: 'Passen Sie das Erscheinungsbild von Linux Mint Cinnamon, Themes und Applets an.',
      gtkThemes: 'Desktop- & Fensterthemes (GTK)',
      iconThemes: 'Symbol-Themes',
      cinnamonSpices: 'Cinnamon Spices Online-Katalog',
      spicesDesc: 'Laden Sie verifizierte Applets und Desklets aus dem offiziellen Katalog herunter.',
      openThemesBtn: 'Cinnamon Theme-Einstellungen öffnen',
    },
  }[lang];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" />
          <span>{t.title}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* GTK Themes */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
            {t.gtkThemes}
          </div>
          <div className="space-y-2">
            {['Mint-Y-Dark', 'Mint-Y', 'Mint-X', 'Adwaita-Dark'].map((theme) => (
              <div
                key={theme}
                onClick={() => {
                  setSelectedTheme(theme);
                  onLogAction?.(`Theme changed to ${theme}`, 'Customization', 'SUCCESS', `Cinnamon theme set to ${theme}`);
                }}
                className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition ${
                  selectedTheme === theme
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-medium'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>{theme}</span>
                {selectedTheme === theme && <CheckCircle2 size={14} className="text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Icon Themes */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
            {t.iconThemes}
          </div>
          <div className="space-y-2">
            {['Mint-Y-Aqua', 'Mint-Y-Sand', 'Mint-Y-Teal', 'Papirus-Dark'].map((icon) => (
              <div
                key={icon}
                onClick={() => {
                  setSelectedIcon(icon);
                  onLogAction?.(`Icon set changed to ${icon}`, 'Customization', 'SUCCESS', `Cinnamon icon set to ${icon}`);
                }}
                className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition ${
                  selectedIcon === icon
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-medium'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>{icon}</span>
                {selectedIcon === icon && <CheckCircle2 size={14} className="text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm text-xs">
        <div>
          <div className="font-semibold text-zinc-200">{t.cinnamonSpices}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{t.spicesDesc}</div>
        </div>
        <button
          onClick={() => alert('Command to open on Linux Mint: cinnamon-settings themes')}
          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 transition flex items-center gap-1.5 shrink-0"
        >
          <span>{t.openThemesBtn}</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};
