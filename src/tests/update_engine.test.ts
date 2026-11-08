import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSemver,
  compareSemver,
  isEligibleUpdate,
  calculateTotalDownloadSizeMb,
  checkRebootRequired,
  exportUpdateHistoryToCsv,
  MintHelperRelease,
  AptPackageUpdate,
  FlatpakAppUpdate,
  UpdateHistoryEntry,
} from '../lib/update_engine.ts';

describe('update_engine - SemVer parser & comparison', () => {
  it('parses standard semver strings correctly', () => {
    const v1 = parseSemver('1.2.3');
    assert.deepEqual(v1, { major: 1, minor: 2, patch: 3, prerelease: undefined });

    const v2 = parseSemver('v2.0.1-beta.1');
    assert.deepEqual(v2, { major: 2, minor: 0, patch: 1, prerelease: 'beta.1' });

    assert.equal(parseSemver('invalid'), null);
  });

  it('compares semver versions accurately', () => {
    assert.equal(compareSemver('1.0.0', '1.0.1'), -1);
    assert.equal(compareSemver('2.0.0', '1.9.9'), 1);
    assert.equal(compareSemver('1.5.0', '1.5.0'), 0);
    // Non-prerelease is greater than prerelease
    assert.equal(compareSemver('1.0.0', '1.0.0-beta.1'), 1);
    assert.equal(compareSemver('1.0.0-alpha.1', '1.0.0-beta.1'), -1);
  });
});

describe('update_engine - Release channel eligibility', () => {
  const stableRelease: MintHelperRelease = {
    version: '1.1.0',
    channel: 'stable',
    releaseDate: '2026-11-08',
    changelog: ['Feature A'],
    downloadSizeBytes: 25000000,
    sha256: 'abc123hash',
    signatureVerified: true,
    supportedArch: ['x86_64'],
    appImageFilename: 'mint-helper-1.1.0-x86_64.AppImage',
  };

  const betaRelease: MintHelperRelease = {
    ...stableRelease,
    version: '1.2.0-beta.1',
    channel: 'beta',
  };

  const devRelease: MintHelperRelease = {
    ...stableRelease,
    version: '1.3.0-dev',
    channel: 'dev',
  };

  it('respects stable channel rules', () => {
    assert.equal(isEligibleUpdate('1.0.0', stableRelease, 'stable'), true);
    assert.equal(isEligibleUpdate('1.1.0', stableRelease, 'stable'), false);
    // Stable channel rejects beta and dev releases
    assert.equal(isEligibleUpdate('1.0.0', betaRelease, 'stable'), false);
    assert.equal(isEligibleUpdate('1.0.0', devRelease, 'stable'), false);
  });

  it('respects beta channel rules', () => {
    assert.equal(isEligibleUpdate('1.0.0', betaRelease, 'beta'), true);
    assert.equal(isEligibleUpdate('1.0.0', devRelease, 'beta'), false);
  });

  it('respects dev channel rules', () => {
    assert.equal(isEligibleUpdate('1.0.0', devRelease, 'dev'), true);
  });
});

describe('update_engine - Download size calculation', () => {
  it('calculates total download size in MB for selected updates only', () => {
    const apt: AptPackageUpdate[] = [
      {
        packageName: 'linux-image-generic',
        currentVersion: '6.8.0-45',
        newVersion: '6.8.0-50',
        sizeBytes: 80 * 1024 * 1024,
        category: 'Kernel',
        isSecurity: true,
        isKernel: true,
        requiresReboot: true,
        willRemove: [],
        newDependencies: ['linux-modules-extra-6.8.0-50'],
        selected: true,
      },
      {
        packageName: 'curl',
        currentVersion: '8.5.0-2',
        newVersion: '8.5.0-3',
        sizeBytes: 20 * 1024 * 1024,
        category: 'Security',
        isSecurity: true,
        isKernel: false,
        requiresReboot: false,
        willRemove: [],
        newDependencies: [],
        selected: false, // unselected!
      },
    ];

    const flatpak: FlatpakAppUpdate[] = [
      {
        appId: 'org.videolan.VLC',
        name: 'VLC Media Player',
        currentVersion: '3.0.20',
        newVersion: '3.0.21',
        remote: 'flathub',
        downloadSizeBytes: 50 * 1024 * 1024,
        isRuntime: false,
        selected: true,
      },
    ];

    const sizeMb = calculateTotalDownloadSizeMb(apt, flatpak, null);
    // 80 MB + 50 MB = 130 MB
    assert.equal(sizeMb, 130);
  });
});

describe('update_engine - Reboot check', () => {
  it('identifies kernel update as requiring restart', () => {
    const apt: AptPackageUpdate[] = [
      {
        packageName: 'linux-image-6.8.0-50-generic',
        currentVersion: '6.8.0-45',
        newVersion: '6.8.0-50',
        sizeBytes: 80000000,
        category: 'Kernel',
        isSecurity: true,
        isKernel: true,
        requiresReboot: true,
        willRemove: [],
        newDependencies: [],
        selected: true,
      },
    ];

    const res = checkRebootRequired(apt);
    assert.equal(res.rebootRequired, true);
    assert.equal(res.reasons.length, 1);
    assert.match(res.reasons[0], /Kernel upgrade/);
  });

  it('returns false when no reboot-requiring packages are selected', () => {
    const apt: AptPackageUpdate[] = [
      {
        packageName: 'htop',
        currentVersion: '3.3.0',
        newVersion: '3.3.1',
        sizeBytes: 200000,
        category: 'Recommended',
        isSecurity: false,
        isKernel: false,
        requiresReboot: false,
        willRemove: [],
        newDependencies: [],
        selected: true,
      },
    ];

    const res = checkRebootRequired(apt);
    assert.equal(res.rebootRequired, false);
    assert.equal(res.reasons.length, 0);
  });
});

describe('update_engine - History CSV export', () => {
  it('exports correctly structured CSV lines with escaped quotes', () => {
    const entries: UpdateHistoryEntry[] = [
      {
        id: 'hist-1',
        timestamp: '2026-11-08 14:00',
        packageName: 'mint-helper',
        oldVersion: '0.9.9',
        newVersion: '1.0.0',
        manager: 'mint-helper',
        operationType: 'update',
        result: 'SUCCESS',
        errorDetails: '',
      },
    ];

    const csv = exportUpdateHistoryToCsv(entries);
    assert.match(csv, /^ID,Timestamp,Manager,Package,OldVersion,NewVersion,Operation,Result,Details/);
    assert.match(csv, /hist-1,2026-11-08 14:00,mint-helper,"mint-helper","0.9.9","1.0.0",update,SUCCESS,""/);
  });
});
