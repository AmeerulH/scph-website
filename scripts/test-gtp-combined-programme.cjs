/* eslint-disable @typescript-eslint/no-require-imports -- This CommonJS runner loads transpiled TypeScript without an extra test dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const {outputText} = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  });
  module._compile(outputText, filename);
};

const {resolveProgrammeHostedBy} = require('../src/components/gtp/programmes/resolve-hosted-by.ts');
const {buildActionWorkshopListing} = require('../src/components/gtp/programmes/action-workshop-listing.ts');
const {buildResearchSessionListing} = require('../src/components/gtp/programmes/research-session-listing.ts');
const {buildCombinedProgrammeDays} = require('../src/components/gtp/programmes/combined-programme-days.ts');
const {resolveActivityRegistration, participantEmailsFromRows, safeRegistrationUrl} = require('../src/lib/gtp-activity-registration.ts');
const {prepareResearchSchedule} = require('./lib/gtp-research-schedule.ts');

let count = 0;
function check(name, run) {run(); count++; console.log(`PASS ${name}`);}
const base = {sectionTitle: 'Hosted By', name: 'Default host', subtitle: 'Default room', showSubtitle: true, logoUrl: '/default.svg', logoAlt: 'Default logo'};

check('Legacy location-only override preserves host and logo', () => {
  const resolved = resolveProgrammeHostedBy(base, {location: 'Hall A', showLocation: false});
  assert.equal(resolved.name, base.name); assert.equal(resolved.logoUrl, base.logoUrl);
  assert.equal(resolved.subtitle, 'Hall A'); assert.equal(resolved.showSubtitle, false);
  assert.deepEqual(resolveProgrammeHostedBy(base, {showLocation: false}), base);
});
check('Ordered list replaces defaults and legacy values; child legacy host replaces list', () => {
  const hosts = [{name: 'Host B', subtitle: 'Organisation detail'}, {name: 'Host A'}];
  const resolved = resolveProgrammeHostedBy(base, {hosts, name: 'Legacy name', location: 'A room'});
  assert.deepEqual(resolved.hosts.map((host) => host.name), ['Host B', 'Host A']);
  assert.equal(resolved.hosts[0].subtitle, 'Organisation detail');
  const child = resolveProgrammeHostedBy(base, {hosts}, {name: 'Child host'});
  assert.equal(child.name, 'Child host'); assert.equal(child.hosts, undefined);
  assert.equal(resolveProgrammeHostedBy(base, {hosts: []}).name, base.name);
});
check('New research rows keep day/hall/presentation order and explicit room', () => {
  const session = {id: 'research-13', type: 'research', title: 'Research', time: '14:00–16:00', venueLine: 'Parent room', workshops: [
    {id: 'b', number: '2', title: 'Hall B', venueLine: 'Room B', presentations: [{id: 'p2', presenterName: 'Second', presentationTitle: 'Second paper'}, {id: 'p1', presenterName: 'First', presentationTitle: 'First paper'}]},
    {id: 'a', number: '1', title: 'Hall A'},
  ]};
  const blocks = buildResearchSessionListing({day2: [{...session, type: 'concurrent'}, session], day3: [{...session, id: 'research-14'}]});
  assert.deepEqual(blocks.map((block) => block.dayId), ['day2', 'day3']);
  assert.equal(blocks[0].halls[0].venue, 'Room B'); assert.equal(blocks[0].halls[1].venue, 'Parent room');
  assert.deepEqual(blocks[0].halls[0].presentations.map((row) => row.id), ['p2', 'p1']);
  assert.deepEqual(blocks[0].halls[1].presentations, []);
  assert.deepEqual(buildResearchSessionListing({day2: [], day3: []}), []);
});
check('Unmatched workshop posters and programme objectives survive', () => {
  const listing = buildActionWorkshopListing({day2: [{type: 'concurrent', title: 'Workshops', time: '14:00–16:00', workshops: [{number: '1', title: 'Matched title', objective: 'Published objective'}]}], day3: [], entries: [
    {title: 'Matched title', posterUrl: '/matched.jpg', description: 'Fallback objective'},
    {title: 'Unmatched title', posterUrl: '/unmatched.jpg', dateLabel: '14 October 2026'},
  ]});
  assert.equal(listing.length, 2); assert.equal(listing[0].workshop.objective, 'Published objective');
  assert.equal(listing[0].posterUrl, '/matched.jpg'); assert.equal(listing[1].posterUrl, '/unmatched.jpg');
  assert.equal(listing[1].parent.time, 'Time to be confirmed');
});
check('Day groups preserve partner-only dates and empty research without fake rows', () => {
  const days = buildCombinedProgrammeDays({workshops: [], research: [], partnerDays: [
    {dateLabel: '13 Oct', partners: [{name: 'Partner'}]}, {dateLabel: 'Date TBC', partners: [{name: 'Pending partner'}]},
  ]});
  assert.equal(days.length, 3); assert.equal(days[0].partnerDays.length, 1); assert.equal(days[2].partnerDays.length, 1);
  assert.equal(days.reduce((sum, day) => sum + day.research.length, 0), 0);
});
const env = {formUrl: 'https://example.org/legacy', participantSheetId: 'sheet', clientEmail: 'service', privateKey: 'key'};
check('Registration respects CMS status, readiness and CMS URL precedence', () => {
  assert.equal(resolveActivityRegistration({registrationStatus: 'comingSoon'}, env).formUrl, null);
  assert.equal(resolveActivityRegistration({registrationStatus: 'closed'}, env).status, 'closed');
  assert.equal(resolveActivityRegistration({registrationStatus: 'open'}, {}).status, 'comingSoon');
  assert.equal(resolveActivityRegistration({registrationStatus: 'open', registrationUrl: 'https://example.org/shared'}, env).formUrl, 'https://example.org/shared');
  assert.equal(resolveActivityRegistration({registrationStatus: 'open', registrationUrl: 'javascript:alert(1)'}, env).status, 'comingSoon');
  assert.equal(safeRegistrationUrl('https://user:password@example.org'), null);
});
check('Only approved email columns grant eligibility, normalized and deduplicated', () => {
  const headers = ['Name', ' EMAIL ', 'Assistant email', 'SECONDARY'];
  const rows = [['Person', ' A@Example.org ', 'unrelated@example.org', 'b@example.org'], ['Again', 'a@example.org', 'other@example.org', 'c@example.org']];
  assert.deepEqual([...participantEmailsFromRows(headers, rows)], ['a@example.org']);
  assert.deepEqual([...participantEmailsFromRows(headers, rows, ['EMAIL', 'SECONDARY'])], ['a@example.org', 'b@example.org', 'c@example.org']);
  assert.throws(() => participantEmailsFromRows(headers, rows, ['MISSING']));
});
check('Research imports preserve existing metadata and refuse non-research targets', () => {
  const source = {sessions: [{key: 'r13', day: 'day2', title: 'Research', time: '14:00–16:00', halls: [{key: 'hall', number: '1', title: 'Hall 1', presentations: [{key: 'p', presenterName: 'Presenter', presentationTitle: 'Paper'}]}]}]};
  const document = {days: [{_key: 'd2', tabId: 'day2', sessions: [{_key: 'r13', type: 'research', hostedByLogo: {asset: {_ref: 'logo'}}, workshops: [{_key: 'hall', venueLine: 'Existing room', speakers: [{name: 'Chair', image: {asset: {_ref: 'photo'}}}], presentations: []}]}]}]};
  const [operation] = prepareResearchSchedule(source, document);
  assert.equal(operation.existing, true); assert.deepEqual(operation.session.hostedByLogo, {asset: {_ref: 'logo'}});
  assert.equal(operation.session.workshops[0].venueLine, 'Existing room');
  assert.equal(operation.session.workshops[0].speakers[0].image.asset._ref, 'photo');
  const invalid = structuredClone(document); invalid.days[0].sessions[0].type = 'concurrent';
  assert.throws(() => prepareResearchSchedule(source, invalid), /non-research/);
  const duplicate = structuredClone(source); duplicate.sessions.push(duplicate.sessions[0]);
  assert.throws(() => prepareResearchSchedule(duplicate, document), /duplicate/);
});
console.log(`${count} behavior checks passed.`);
