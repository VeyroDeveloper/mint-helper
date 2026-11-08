export type AppViewMode = 'website' | 'desktop';

export type DesktopNavPage =
  // MAIN
  | 'overview'
  | 'updates'
  | 'wizard'
  | 'apps'
  | 'health'
  // SYSTEM
  | 'maintenance'
  | 'security'
  | 'storage'
  | 'hardware'
  | 'customization'
  | 'recovery'
  // ADVANCED
  | 'devtools'
  | 'history'
  | 'settings'
  | 'about';

export type WebsitePage =
  | 'home'
  | 'downloads'
  | 'features'
  | 'tutorials'
  | 'about'
  | 'contributing'
  | 'repobrowser';

export interface TutorialItem {
  id: string;
  title: string;
  category: 'Getting Started' | 'Post-Install' | 'Security & Maintenance' | 'Packaging & Advanced';
  description: string;
  steps: {
    title: string;
    description: string;
    command?: string;
    note?: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'PENDING';
  details: string;
}

export type LanguageCode = 'en' | 'de';
export type ThemeMode = 'system' | 'light' | 'dark' | 'mint-y-dark';
