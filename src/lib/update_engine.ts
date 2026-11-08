/**
 * Pure logic engine for mint-helper Update Center.
 * Handles semver comparison, update categorization, restart requirement analysis,
 * and update history filtering/exporting.
 */

export type ReleaseChannel = 'stable' | 'beta' | 'dev';

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

export interface AptPackageUpdate {
  packageName: string;
  currentVersion: string;
  newVersion: string;
  sizeBytes: number;
  category: 'Security' | 'Recommended' | 'Optional' | 'Kernel';
  isSecurity: boolean;
  isKernel: boolean;
  requiresReboot: boolean;
  willRemove: string[];
  newDependencies: string[];
  selected: boolean;
}

export interface FlatpakAppUpdate {
  appId: string;
  name: string;
  currentVersion: string;
  newVersion: string;
  remote: string;
  downloadSizeBytes: number;
  isRuntime: boolean;
  selected: boolean;
}

export interface MintHelperRelease {
  version: string;
  channel: ReleaseChannel;
  releaseDate: string;
  changelog: string[];
  downloadSizeBytes: number;
  sha256: string;
  signatureVerified: boolean;
  supportedArch: string[];
  appImageFilename: string;
}

export interface UpdateHistoryEntry {
  id: string;
  timestamp: string;
  packageName: string;
  oldVersion: string;
  newVersion: string;
  manager: 'mint-helper' | 'APT' | 'Flatpak';
  operationType: 'update' | 'security-patch' | 'rollback';
  result: 'SUCCESS' | 'FAILED' | 'ROLLEDBACK';
  errorDetails?: string;
}

export interface UpdateSettingsState {
  autoCheckEnabled: boolean;
  frequency: 'startup' | 'daily' | 'weekly' | 'manual';
  channel: ReleaseChannel;
  notifyOnUpdate: boolean;
  onlyNotifySecurity: boolean;
  autoDownloadAppImage: boolean;
  retentionDays: number;
}

export const DEFAULT_UPDATE_SETTINGS: UpdateSettingsState = {
  autoCheckEnabled: true,
  frequency: 'daily',
  channel: 'stable',
  notifyOnUpdate: true,
  onlyNotifySecurity: false,
  autoDownloadAppImage: false,
  retentionDays: 90,
};

/**
 * Parses a semantic version string into major, minor, patch, and optional prerelease.
 */
export function parseSemver(v: string): SemVer | null {
  const clean = v.trim().replace(/^[vV]/, '');
  const match = clean.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || undefined,
  };
}

/**
 * Compares two semantic versions.
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 == v2
 */
export function compareSemver(v1: string, v2: string): number {
  const s1 = parseSemver(v1);
  const s2 = parseSemver(v2);
  if (!s1 || !s2) {
    return v1.localeCompare(v2);
  }

  if (s1.major !== s2.major) return s1.major > s2.major ? 1 : -1;
  if (s1.minor !== s2.minor) return s1.minor > s2.minor ? 1 : -1;
  if (s1.patch !== s2.patch) return s1.patch > s2.patch ? 1 : -1;

  // Prerelease comparison: non-prerelease is greater than prerelease
  if (!s1.prerelease && s2.prerelease) return 1;
  if (s1.prerelease && !s2.prerelease) return -1;
  if (s1.prerelease && s2.prerelease) {
    return s1.prerelease.localeCompare(s2.prerelease);
  }

  return 0;
}

/**
 * Determines if a new release should be recommended based on release channel.
 */
export function isEligibleUpdate(currentVersion: string, release: MintHelperRelease, channel: ReleaseChannel): boolean {
  if (channel === 'stable' && release.channel !== 'stable') {
    return false;
  }
  if (channel === 'beta' && release.channel === 'dev') {
    return false;
  }
  return compareSemver(release.version, currentVersion) > 0;
}

/**
 * Calculates total download size in megabytes from APT and Flatpak updates.
 */
export function calculateTotalDownloadSizeMb(
  aptUpdates: AptPackageUpdate[],
  flatpakUpdates: FlatpakAppUpdate[],
  mintHelperUpdate?: MintHelperRelease | null
): number {
  let bytes = 0;
  for (const a of aptUpdates) {
    if (a.selected) bytes += a.sizeBytes;
  }
  for (const f of flatpakUpdates) {
    if (f.selected) bytes += f.downloadSizeBytes;
  }
  if (mintHelperUpdate) {
    bytes += mintHelperUpdate.downloadSizeBytes;
  }
  return Math.round((bytes / 1024 / 1024) * 10) / 10;
}

/**
 * Determines if a reboot is needed after selected APT packages are applied.
 */
export function checkRebootRequired(aptUpdates: AptPackageUpdate[]): {
  rebootRequired: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  for (const u of aptUpdates) {
    if (u.selected && u.isKernel) {
      reasons.push(`Kernel upgrade: ${u.packageName} (${u.newVersion}) replaces active kernel.`);
    } else if (u.selected && u.requiresReboot) {
      reasons.push(`Core system library upgrade: ${u.packageName}`);
    }
  }
  return {
    rebootRequired: reasons.length > 0,
    reasons,
  };
}

/**
 * Exports update history to CSV formatted text.
 */
export function exportUpdateHistoryToCsv(entries: UpdateHistoryEntry[]): string {
  const header = 'ID,Timestamp,Manager,Package,OldVersion,NewVersion,Operation,Result,Details\n';
  const rows = entries.map((e) =>
    [
      e.id,
      e.timestamp,
      e.manager,
      `"${e.packageName}"`,
      `"${e.oldVersion}"`,
      `"${e.newVersion}"`,
      e.operationType,
      e.result,
      `"${(e.errorDetails || '').replace(/"/g, '""')}"`,
    ].join(',')
  );
  return header + rows.join('\n');
}
