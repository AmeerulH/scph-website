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
require.extensions['.tsx'] = require.extensions['.ts'];

const {resolveProgrammeHostedBy} = require('../src/components/gtp/programmes/resolve-hosted-by.ts');
const {buildActionWorkshopListing} = require('../src/components/gtp/programmes/action-workshop-listing.ts');
const {buildResearchSessionListing} = require('../src/components/gtp/programmes/research-session-listing.ts');
const {buildCombinedProgrammeDays} = require('../src/components/gtp/programmes/combined-programme-days.ts');
const {resolveActivityRegistration, participantEmailsFromRows, safeRegistrationUrl} = require('../src/lib/gtp-activity-registration.ts');
const {prepareResearchSchedule} = require('./lib/gtp-research-schedule.ts');
const {buildSpecialSessionRegistrationLink} = require('../src/lib/gtp-programme-session-link.ts');
const {prepareWorkshopMigration, sameWorkshopMigrationChanges} = require('./lib/gtp-workshop-migration.ts');
const {actionWorkshopPeople, programmePersonRoleLabel} = require('../src/components/gtp/programmes/programme-person-roles.ts');
const {ProgrammeRoleOptionsInput} = require('../studio/components/programme-role-options-input.tsx');
const {PatchEvent, set, unset} = require('../studio/node_modules/sanity');

let count = 0;
function check(name, run) {run(); count++; console.log(`PASS ${name}`);}
check('Studio saves cleared role checkboxes as an empty selection and preserves other patches', () => {
  let saved;
  const input = ProgrammeRoleOptionsInput({onChange: (event) => {saved = event;}, renderDefault: (props) => props});
  input.onChange(PatchEvent.from(unset()));
  assert.deepEqual(saved.patches, [set([])]);
  input.onChange(PatchEvent.from([set(['facilitator']), unset(['unrelated'])]));
  assert.deepEqual(saved.patches, [set(['facilitator']), unset(['unrelated'])]);
});
check('Cleared roles hide generic labels while people, affiliations, photos and written roles survive', () => {
  const person = {name: 'Person', roles: [], designation: 'Organisation', imageUrl: '/photo.jpg'};
  const [visible] = actionWorkshopPeople({speakers: [person]});
  assert.deepEqual(visible, person);
  assert.equal(programmePersonRoleLabel(visible), '');
  assert.equal(programmePersonRoleLabel({...visible, sessionRole: 'Speaker'}), '');
  assert.equal(programmePersonRoleLabel({...visible, sessionRole: 'Moderator'}), 'Moderator');
  assert.equal(programmePersonRoleLabel(actionWorkshopPeople({speakers: [{name: 'Legacy'}]})[0]), 'Speaker');
  assert.equal(programmePersonRoleLabel(actionWorkshopPeople({facilitators: [{name: 'Legacy'}]})[0]), 'Facilitator');
  assert.equal(programmePersonRoleLabel({...person, roles: ['speaker', 'facilitator']}), 'Speaker & Facilitator');
  assert.equal(programmePersonRoleLabel({...person, roles: ['speaker'], sessionRole: 'Speaker (Virtual)'}), 'Speaker (Virtual)');
  assert.equal(actionWorkshopPeople({speakers: [person], facilitators: [{name: 'Person', roles: []}]}).length, 1);
});
check('Special events opt into shared registration without changing category or other session buttons', () => {
  const session = {type: 'special', subpageButtonLabel: ' Register to join this session '};
  assert.deepEqual(buildSpecialSessionRegistrationLink(session, 'day3'), {
    label: 'Register to join this session', href: '/events/gtp-2026/programmes/action-workshops#day-14',
  });
  assert.equal(buildSpecialSessionRegistrationLink(session, 'day2').href, '/events/gtp-2026/programmes/action-workshops#day-13');
  assert.equal(buildSpecialSessionRegistrationLink(session, 'day1').href, '/events/gtp-2026/programmes/action-workshops#action-workshops');
  assert.equal(buildSpecialSessionRegistrationLink({type: 'special'}, 'day3'), null);
  assert.equal(buildSpecialSessionRegistrationLink({type: 'special', subpageButtonLabel: '  '}, 'day3'), null);
  for (const type of ['concurrent', 'research', 'plenary', 'break']) {
    assert.equal(buildSpecialSessionRegistrationLink({...session, type}, 'day3'), null);
  }
  assert.equal(session.type, 'special');
});
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
  assert.deepEqual(blocks[0].halls.map((hall) => hall.title), ['Session 1', 'Session 2']);
  assert.deepEqual(blocks[0].halls[0].presentations.map((row) => row.id), ['p2', 'p1']);
  assert.deepEqual(blocks[0].halls[1].presentations, []);
  assert.deepEqual(buildResearchSessionListing({day2: [], day3: []}), []);
});
check('Existing research speaker rows supply presenters without replacing explicit presentations or inferring chairs', () => {
  const publishedRows = [{id: 'p', presenterName: 'Confirmed presenter', presentationTitle: 'Confirmed paper'}];
  const session = {id: 'r', type: 'research', time: '14:00–16:00', workshops: [
    {id: 'legacy', title: ' Existing paper ', venueLine: 'Hall 1', speakers: [{name: ' Presenter ', roles: []}, {name: 'presenter', imageUrl: '/presenter.jpg'}, {name: 'Co-presenter', imageUrl: '/co-presenter.jpg'}]},
    {id: 'new', title: 'Hall 2', presentations: publishedRows, speakers: [{name: 'Chair'}]},
    {id: 'pending', title: 'Pending paper', facilitators: [{name: 'Facilitator'}]},
  ]};
  const original = structuredClone(session);
  const blocks = buildResearchSessionListing({day2: [session], day3: [session]});
  assert.deepEqual(blocks.map((block) => block.dayId), ['day2', 'day3']);
  assert.deepEqual(blocks[0].halls[0].presentations, [{id: 'legacy-presentation', presenterName: 'Presenter, Co-presenter', presentationTitle: 'Existing paper', presenters: [{name: 'Presenter', imageUrl: '/presenter.jpg'}, {name: 'Co-presenter', imageUrl: '/co-presenter.jpg'}]}]);
  assert.deepEqual(blocks[0].halls[1].presentations, publishedRows);
  assert.deepEqual(blocks[0].halls[2].presentations, []);
  assert.deepEqual(session, original);
});
check('Published paper slots become two session tables, preserving order, presenters, photos and the source', () => {
  const paper = (id, venueLine, name) => ({id, title: `Paper ${id}`, venueLine, speakers: [{name, imageUrl: `/${id}.jpg`}]});
  const session = {id: 'research', type: 'research', time: '14:00–16:00', workshops: [
    paper('a', ' Hall 1 ', 'First'), paper('b', 'Hall 2', 'Second'),
    paper('c', 'hall  1', 'Third'), paper('d', 'Hall 2 ', 'Fourth'),
  ]};
  const original = structuredClone(session);
  const blocks = buildResearchSessionListing({day2: [session], day3: [session]});
  for (const block of blocks) {
    assert.deepEqual(block.halls.map((hall) => hall.title), ['Session 1', 'Session 2']);
    assert.deepEqual(block.halls.map((hall) => hall.presentations.map((row) => row.presentationTitle)), [['Paper a', 'Paper c'], ['Paper b', 'Paper d']]);
    assert.equal(block.halls[0].presentations[1].presenters[0].imageUrl, '/c.jpg');
    assert.equal(block.halls[1].presentations[0].presenterName, 'Second');
  }
  assert.deepEqual(session, original);
});
check('Missing research assignments stay visible and separate; different time blocks never merge', () => {
  const session = {id: 'early', type: 'research', time: '14:00–15:00', venueLine: 'Venue to be confirmed', workshops: [
    {id: 'assigned', title: 'Assigned paper', venueLine: 'Hall 1', speakers: [{name: 'Assigned presenter'}]},
    {id: 'pending', title: 'Unassigned paper', speakers: [{name: 'Pending presenter'}]},
  ]};
  const blocks = buildResearchSessionListing({day2: [session, {...session, id: 'late', time: '15:00–16:00'}], day3: []});
  assert.equal(blocks.length, 2);
  assert.deepEqual(blocks.map((block) => block.time), ['14:00–15:00', '15:00–16:00']);
  assert.deepEqual(blocks[0].halls.map((hall) => hall.title), ['Session 1', 'Session to be confirmed']);
  assert.equal(blocks[0].halls[1].presentations[0].presentationTitle, 'Unassigned paper');
});
check('Research table overrides rename and reorder tables without moving papers or changing photos', () => {
  const paper = (id, venueLine) => ({id, title: `Paper ${id}`, venueLine, speakers: [{name: id, imageUrl: `/${id}.jpg`}]});
  const session = {id: 'r', type: 'research', time: '14:00', workshops: [paper('a', 'Hall 1'), paper('b', 'Hall 2'), paper('c', 'Hall 1')], researchTables: [
    {sourceVenue: ' hall  2 ', title: ' Oceans and resilience ', venueLabel: ' Seminar Room B '},
    {sourceVenue: 'Hall 1', title: 'Climate and health'},
    {sourceVenue: 'No matching room', title: 'Never creates a table'},
  ]};
  const original = structuredClone(session);
  const [block] = buildResearchSessionListing({day2: [session], day3: []});
  assert.deepEqual(block.halls.map((hall) => [hall.title, hall.venue]), [['Oceans and resilience', 'Seminar Room B'], ['Climate and health', 'Hall 1']]);
  assert.deepEqual(block.halls.map((hall) => hall.presentations.map((row) => row.presentationTitle)), [['Paper b'], ['Paper a', 'Paper c']]);
  assert.equal(block.halls[1].presentations[1].presenters[0].imageUrl, '/c.jpg');
  assert.deepEqual(session, original);
});
check('Blank research table copy retains defaults and unconfigured or pending tables stay visible', () => {
  const session = {id: 'r', type: 'research', time: '14:00', workshops: [
    {id: 'one', title: 'Paper', venueLine: 'Hall 1', speakers: [{name: 'Presenter'}]},
    {id: 'two', title: 'Hall 2', venueLine: 'Hall 2', presentations: [{id: 'p', presenterName: 'Second', presentationTitle: 'Second paper'}]},
    {id: 'pending', title: 'Pending', speakers: [{name: 'Third'}]},
  ]};
  const [original] = buildResearchSessionListing({day2: [session], day3: []});
  const [withBlank] = buildResearchSessionListing({day2: [{...session, researchTables: [{sourceVenue: 'Hall 1', title: ' ', venueLabel: ' '}, {sourceVenue: 'Hall 1', title: 'Duplicate ignored'}]}], day3: []});
  assert.deepEqual(withBlank, original);
  const [withOverride] = buildResearchSessionListing({day2: [{...session, researchTables: [{sourceVenue: 'Hall 2', title: 'Confirmed session'}]}], day3: []});
  assert.deepEqual(withOverride.halls.map((hall) => hall.title), ['Confirmed session', 'Session 1', 'Session to be confirmed']);
  assert.equal(withOverride.halls[0].presentations[0].id, 'p');
});
check('Only canonical workshop slots render, with stable identities and explicit artwork', () => {
  const workshop = {id: 'w1', number: '10', title: 'Renamed workshop', objective: 'Published objective', posterUrl: '/canonical.jpg'};
  const parent = {id: 's1', type: 'concurrent', title: 'Workshops', time: '14:00–16:00', workshops: [workshop, {id: 'w2', number: '10', title: 'Pending poster'}]};
  // Legacy artwork is intentionally ignored, even if supplied by older callers.
  const input = {day2: [], day3: [parent, {...parent, type: 'research'}, {...parent, type: 'special'}], entries: [{title: 'Old name', posterUrl: '/old.jpg'}]};
  const listing = buildActionWorkshopListing(input);
  assert.equal(listing.length, 2);
  assert.equal(listing[0].posterUrl, '/canonical.jpg');
  assert.equal(listing[0].workshop.objective, 'Published objective');
  assert.equal(listing[1].posterUrl, undefined);
  assert.equal(new Set(listing.map(item => item.id)).size, 2);
  assert.equal(listing[0].dateLabel, '14 October 2026');
  const identity = listing[0].id;
  workshop.title = 'Another rename'; workshop.posterUrl = undefined;
  const changed = buildActionWorkshopListing(input);
  assert.equal(changed[0].id, identity);
  assert.equal(changed[0].posterUrl, undefined);
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
  const document = {days: [{_key: 'd2', tabId: 'day2', sessions: [{
    _key: 'r13', type: 'research', hostedByLogo: {asset: {_ref: 'logo'}}, researchTables: [{sourceVenue: 'Existing room', title: 'Edited heading', venueLabel: 'Edited venue'}],
    workshops: [{
      _key: 'hall', venueLine: 'Existing room', speakers: [{name: 'Chair', image: {asset: {_ref: 'photo'}}}],
      presentations: [{_key: 'p', presenterImage: {asset: {_ref: 'presenter-photo'}}}],
    }],
  }]}]};
  const [operation] = prepareResearchSchedule(source, document);
  assert.equal(operation.existing, true); assert.deepEqual(operation.session.hostedByLogo, {asset: {_ref: 'logo'}});
  assert.deepEqual(operation.session.researchTables, document.days[0].sessions[0].researchTables);
  assert.equal(operation.session.workshops[0].venueLine, 'Existing room');
  assert.equal(operation.session.workshops[0].speakers[0].image.asset._ref, 'photo');
  assert.equal(operation.session.workshops[0].presentations[0].presenterImage.asset._ref, 'presenter-photo');
  const invalid = structuredClone(document); invalid.days[0].sessions[0].type = 'concurrent';
  assert.throws(() => prepareResearchSchedule(source, invalid), /non-research/);
  const duplicate = structuredClone(source); duplicate.sessions.push(duplicate.sessions[0]);
  assert.throws(() => prepareResearchSchedule(duplicate, document), /duplicate/);
});
function migrationFixture() {
  const poster = {_type: 'image', asset: {_type: 'reference', _ref: 'image-existing'}, alt: '13', crop: {top: 0.1}, hotspot: {x: 0.4}};
  const mapping = [
    {_key: 'poster-1', artworkTitle: 'Old name', assetRef: 'image-existing', dayKey: 'nnQWSTO81w83COfmAOS6GV', sessionKey: 'nnQWSTO81w83COfmAOS6Mz', workshopKey: 'w1', workshopTitle: 'Renamed workshop', transferPoster: true},
    {_key: 'action-workshops-10', artworkTitle: 'Rethinking', assetRef: 'image-existing', dayKey: 'nnQWSTO81w83COfmAOS6GV', sessionKey: 'nnQWSTO81w83COfmAOS6Mz', workshopKey: 'w2', workshopTitle: 'Rethinking', transferPoster: false},
    {_key: 'retired', artworkTitle: 'Retired workshop', assetRef: 'image-existing', archived: true},
  ];
  const programme = {_id: 'gtp2026Programme', _rev: 'p-rev', days: [{_key: 'nnQWSTO81w83COfmAOS6GV', tabId: 'day3', sessions: [
    {_key: 'nnQWSTO81w83COfmAOS6Mz', type: 'concurrent', time: '14:00–16:00', workshops: [
      {_key: 'w1', number: '2', title: 'Renamed workshop', objective: 'Published objective', speakers: [{name: 'Person', image: {asset: {_ref: 'headshot'}}}]},
      {_key: 'w2', number: '10', title: 'Rethinking'},
      {_key: '24519529148b', title: 'REACH - Advancing Research for Climate and Health in Asia'},
    ]},
    {_key: '696b4f0c831f', type: 'research', title: 'REACH - Advancing Research for Climate and Health in Asia', time: '14:00', speakers: [{name: 'REACH person'}], hostedByLogo: poster, venueLine: 'Room A'},
    {_key: 'research', type: 'research', title: 'Research', workshops: [{title: 'Hall', presentations: [{presenterName: 'Research person'}]}]},
  ]}]};
  const artwork = {_id: 'gtp2026ProgrammeActivityPage-action-workshops', _rev: 'a-rev', hero: poster, entries: mapping.map(row => ({_key: row._key, title: row.artworkTitle, description: 'Fallback objective', dateLabel: '13 October 2026', poster}))};
  const draft = {...structuredClone(programme), _id: 'drafts.gtp2026Programme', _rev: 'd-rev', internalTitle: 'Unpublished editor change'};
  return {documents: [programme, artwork, draft], mapping};
}
check('Migration preserves assets and draft edits, removes only REACH duplicate, archives obsolete artwork', () => {
  const {documents, mapping} = migrationFixture();
  const original = structuredClone(documents);
  const {preview, patches} = prepareWorkshopMigration(documents, mapping);
  assert.deepEqual(documents, original);
  const sessions = preview[0].days[0].sessions;
  assert.equal(sessions[0].workshops.length, 2);
  const workshop = sessions[0].workshops[0];
  assert.deepEqual(workshop.poster.crop, {top: 0.1}); assert.deepEqual(workshop.poster.hotspot, {x: 0.4});
  assert.equal(workshop.poster.asset._ref, 'image-existing');
  assert.equal(workshop.poster.alt, 'Renamed workshop poster');
  assert.equal(workshop.objective, 'Published objective'); assert.equal(workshop.speakers[0].image.asset._ref, 'headshot');
  assert.equal(sessions[0].workshops[1].poster, undefined); assert.equal(sessions[0].workshops[1].objective, 'Fallback objective');
  assert.equal(sessions[1].type, 'special'); assert.equal(sessions[1].subpageButtonLabel, 'Register to Join this Session');
  assert.deepEqual(sessions[1].speakers, original[0].days[0].sessions[1].speakers);
  assert.deepEqual(sessions[1].hostedByLogo, original[0].days[0].sessions[1].hostedByLogo);
  assert.deepEqual(sessions[2], original[0].days[0].sessions[2]);
  assert.equal(preview[2].internalTitle, 'Unpublished editor change');
  assert.equal(preview[1].entries.length, original[1].entries.length);
  assert.deepEqual(preview[1].entries[2], original[1].entries[2]);
  assert.equal(preview[1].entries[1].dateLabel, '14 October 2026');
  assert.equal(patches.length, 3); assert.equal(patches[0].revision, 'p-rev');
  assert.equal(patches[0].unset.length, 1);
  assert.ok(Object.keys(patches[0].set).every(path => path !== 'days' && !path.endsWith('.workshops')));
});
check('Migration cannot resurrect artwork after an editor clears it and preserves existing posters', () => {
  const {documents, mapping} = migrationFixture();
  const existing = {_type: 'image', asset: {_ref: 'editor-selected'}};
  documents[0].days[0].sessions[0].workshops[0].poster = existing;
  const first = prepareWorkshopMigration(documents, mapping);
  assert.deepEqual(first.preview[0].days[0].sessions[0].workshops[0].poster, existing);
  delete first.preview[0].days[0].sessions[0].workshops[0].poster;
  assert.deepEqual(prepareWorkshopMigration(first.preview, mapping).patches, []);
});
check('Migration refuses ambiguous mappings, changed titles and changed image references', () => {
  const {documents, mapping} = migrationFixture();
  assert.throws(() => prepareWorkshopMigration(documents, [...mapping, mapping[0]]), /Duplicate/);
  const titleChange = structuredClone(documents); titleChange[0].days[0].sessions[0].workshops[0].title = 'Editor changed title';
  assert.throws(() => prepareWorkshopMigration(titleChange, mapping), /Title changed/);
  const assetChange = structuredClone(documents); assetChange[1].entries[0].poster.asset._ref = 'new-upload';
  assert.throws(() => prepareWorkshopMigration(assetChange, mapping), /Artwork changed/);
});
check('Reviewed migration tolerates unrelated editor revisions but rejects changed targets or field values', () => {
  const {documents, mapping} = migrationFixture();
  const approved = prepareWorkshopMigration(documents, mapping);
  documents[0]._rev = 'new-editor-revision'; documents[0].internalTitle = 'New editor copy';
  const current = prepareWorkshopMigration(documents, mapping);
  assert.equal(sameWorkshopMigrationChanges(approved.patches, current.patches), true);
  assert.equal(current.patches[0].revision, 'new-editor-revision');
  assert.equal(current.preview[0].internalTitle, 'New editor copy');
  assert.equal(sameWorkshopMigrationChanges(approved.patches, current.patches.slice(1)), false);
  assert.equal(sameWorkshopMigrationChanges(approved.patches, current.patches.filter(patch => !patch.id.startsWith('drafts.'))), true);
  assert.equal(sameWorkshopMigrationChanges(approved.patches, [...current.patches, {...current.patches[0], id: 'drafts.unreviewed'}]), false);
  documents[0].days[0].sessions[0].workshops[0].poster = {asset: {_ref: 'new-editor-poster'}};
  assert.equal(sameWorkshopMigrationChanges(approved.patches, prepareWorkshopMigration(documents, mapping).patches), false);
});
console.log(`${count} behavior checks passed.`);
