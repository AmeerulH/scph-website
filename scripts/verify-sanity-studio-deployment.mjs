import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import cli from '../studio/sanity.cli.ts';

const [mode, manifestDir] = process.argv.slice(2);
assert.ok(['before', 'after'].includes(mode));
assert.ok(manifestDir);
assert.equal(cli.api.projectId, 'y0tkemxm');
assert.equal(cli.api.dataset, 'production');
assert.equal(cli.deployment.appId, 'bb8tkwqf3paqa2krcwj129i8');

function checkWorkspace(manifest) {
  assert.equal(manifest.workspaces.length, 1);
  const workspace = manifest.workspaces[0];
  assert.equal(workspace.name, 'default');
  assert.equal(workspace.projectId, 'y0tkemxm');
  assert.equal(workspace.dataset, 'production');
  return workspace;
}

const manifest = JSON.parse(fs.readFileSync(path.join(manifestDir, 'create-manifest.json'), 'utf8'));
const workspace = checkWorkspace(manifest);
const planned = JSON.parse(fs.readFileSync(path.join(manifestDir, workspace.schema), 'utf8'));
const sponsorField = (schema) => schema.find(type => type.name === 'gtpAboutSponsorsBand').fields.find(field => field.name === 'sponsors');
const oldDescription = 'Set Tier on each logo (Platinum–Others). Logos without a tier stay hidden on the site. Max 5 per tier.';
const newDescription = 'Set Tier on each logo (Platinum–Others). Logos without a tier stay hidden on the site. No limit per tier.';
assert.equal(sponsorField(planned).description, newDescription);
assert.equal(sponsorField(planned).validation, undefined);

async function getJson(relativePath) {
  const url = new URL(relativePath, 'https://scph.sanity.studio/static/');
  url.searchParams.set('verification', process.env.GITHUB_SHA ?? Date.now().toString());
  const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(20000)});
  assert.ok(response.ok, 'Hosted Studio request failed: ' + response.status);
  return response.json();
}

async function checkHostedSchema() {
  const hostedManifest = await getJson('create-manifest.json');
  const hostedWorkspace = checkWorkspace(hostedManifest);
  const hosted = await getJson(hostedWorkspace.schema);
  if (mode === 'before') {
    const field = sponsorField(hosted);
    if (field.description === oldDescription) {
      assert.deepEqual(field.validation, [{level: 'error', rules: [{flag: 'custom'}]}]);
    } else {
      assert.equal(field.description, newDescription);
      assert.equal(field.validation, undefined);
    }
    field.description = newDescription;
    delete field.validation;
  }
  assert.deepEqual(hosted, planned, 'Hosted schema differs outside the reviewed sponsor limit change');
  console.log(mode === 'before'
    ? 'Preflight passed: existing production Studio; only the sponsor tier cap and help text change.'
    : 'Verified https://scph.sanity.studio/: unlimited sponsor tiers; all other schema definitions match.');
}

if (mode === 'before') {
  await checkHostedSchema();
} else {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await checkHostedSchema();
      break;
    } catch (error) {
      if (attempt >= 6) throw error;
      console.log('Waiting for the deployed Studio files to become available...');
      await delay(10000);
    }
  }
}

