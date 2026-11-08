import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EVERYDAY_PROFILE,
  DEVELOPER_PROFILE,
  GAMING_PROFILE,
  CREATIVE_PROFILE,
  validateProfile,
  isProtectedPath,
  generateInstallationPlan,
  SCHEMA_VERSION,
  APP_ID,
} from '../lib/profile_engine';

test('schema constants match project specification', () => {
  assert.equal(SCHEMA_VERSION, '1.0');
  assert.equal(APP_ID, 'mint-helper');
});

test('preset profiles pass schema validation', () => {
  const everyday = validateProfile(EVERYDAY_PROFILE);
  assert.equal(everyday.valid, true);
  assert.equal(everyday.profile?.name, 'Everyday User');

  const dev = validateProfile(DEVELOPER_PROFILE);
  assert.equal(dev.valid, true);
  assert.equal(dev.profile?.name, 'Developer');

  const gaming = validateProfile(GAMING_PROFILE);
  assert.equal(gaming.valid, true);

  const creative = validateProfile(CREATIVE_PROFILE);
  assert.equal(creative.valid, true);
});

test('invalid profile JSON is properly rejected', () => {
  const badVersion = validateProfile({
    schema_version: '2.5',
    app_id: 'mint-helper',
    name: 'Bad Version',
  });
  assert.equal(badVersion.valid, false);
  assert.match(badVersion.error || '', /Invalid schema version/);

  const badAppId = validateProfile({
    schema_version: '1.0',
    app_id: 'unknown-app',
    name: 'Bad App',
  });
  assert.equal(badAppId.valid, false);
  assert.match(badAppId.error || '', /Invalid app_id/);
});

test('sensitive user paths are protected from automated cleanup', () => {
  assert.equal(isProtectedPath('/home/mint/.mozilla/firefox/profile.default'), true);
  assert.equal(isProtectedPath('/home/mint/.thunderbird/user.default'), true);
  assert.equal(isProtectedPath('/home/mint/.ssh/id_ed25519'), true);
  assert.equal(isProtectedPath('/home/mint/Documents/Confidential.odt'), true);

  // Harmless caches are NOT protected
  assert.equal(isProtectedPath('/var/cache/apt/archives/pkg.deb'), false);
  assert.equal(isProtectedPath('/home/mint/.cache/thumbnails/normal/abc.png'), false);
});

test('plan generation creates partitioned operations', () => {
  const plan = generateInstallationPlan(EVERYDAY_PROFILE);

  assert.ok(plan.items.length > 0);
  assert.equal(plan.name, 'Setup Plan (Everyday User)');

  const kinds = new Set(plan.items.map((i) => i.kind));
  assert.ok(kinds.has('KEEP'), 'Must have KEEP items for preserved browser');
  assert.ok(kinds.has('INSTALL'), 'Must have INSTALL items for codecs/fonts/apps');
  assert.ok(kinds.has('CONFIGURE'), 'Must have CONFIGURE items for UFW and updates');
  assert.ok(kinds.has('OPTIONAL CLEANUP'), 'Must have OPTIONAL CLEANUP items');

  // Verify commands are present and non-empty
  for (const item of plan.items) {
    assert.ok(item.command.length > 0, `Command for ${item.title} should not be empty`);
    assert.ok(item.reason.length > 0, `Reason for ${item.title} should not be empty`);
  }
});
