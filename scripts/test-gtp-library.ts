import assert from "node:assert/strict";
import { resolveResource, resolveResourceSettings } from "../src/lib/gtp-resources";
import { parseVideoParams, resolveVideo, resolveVideoIndex, selectVideoPage, videoHref, type RawVideo } from "../src/lib/gtp-videos";
import { parseYouTubeId } from "../src/lib/youtube";
import { migrationVideoDocuments, assertMigrationParity, canonicalContent } from "./lib/gtp-video-migration";
import { resourceSeedDocuments, videoSeedDocuments } from "./lib/gtp-library-seeds";
import { canReviewGtpLibrary } from "../src/lib/gtp-library-review-access";

let checks = 0;
function test(name: string, run: () => void) { run(); checks++; console.log(`PASS ${name}`); }
const base = {_id: "video-1", title: "Session", collection: "sessionRecordings", day: "1", youtubeUrl: "https://youtu.be/IR0MfiOyHtk"};

test("Samples require local opt-in or Vercel Preview and stay blocked in production", () => {
  for (const environment of [
    {nodeEnv: "production"}, {nodeEnv: "production", localMode: "1"},
    {nodeEnv: "production", vercelEnv: "production", localMode: "1"},
    {nodeEnv: "production", vercelEnv: "staging"}, {nodeEnv: "development"},
    {nodeEnv: "development", vercelEnv: "production", localMode: "1"},
    {nodeEnv: "test", vercelEnv: "preview"}, {},
  ]) assert.equal(canReviewGtpLibrary(environment), false, JSON.stringify(environment));
  assert.equal(canReviewGtpLibrary({nodeEnv: "development", localMode: "1"}), true);
  assert.equal(canReviewGtpLibrary({nodeEnv: "production", vercelEnv: "preview"}), true);
});

test("YouTube video URL formats and hostile hosts", () => {
  for (const link of ["https://youtu.be/IR0MfiOyHtk", "https://www.youtube.com/watch?v=IR0MfiOyHtk", "https://youtube.com/embed/IR0MfiOyHtk", "https://youtube.com/shorts/IR0MfiOyHtk", "https://youtube.com/live/IR0MfiOyHtk"]) assert.equal(parseYouTubeId(link), "IR0MfiOyHtk");
  for (const link of ["javascript:alert(1)", "https://youtube.com.evil.test/watch?v=IR0MfiOyHtk", "https://youtube.com/playlist?list=PL123", "https://youtu.be/short"]) assert.equal(parseYouTubeId(link), null);
});
test("Drafts, release versions and incomplete recordings stay private", () => {
  for (const patch of [{_id: "drafts.test"}, {_id: "versions.release.test"}, {day: "5"}, {youtubeUrl: "bad"}, {title: " "}, {collection: "unknown"}]) assert.equal(resolveVideo({...base, ...patch}), undefined);
});
test("Pending highlight slots remain visible without a playable URL", () => {
  const pending = resolveVideo({...base, collection: "dailyHighlights", youtubeUrl: undefined});
  assert.ok(pending); assert.equal(pending.youtubeId, undefined);
  assert.equal(selectVideoPage([]).highlights.length, 4);
});
test("Cutover never resurrects legacy videos after unpublishing", () => {
  const legacy = [{...base, _key: "old"}];
  assert.equal(resolveVideoIndex(false, [], legacy).length, 1);
  assert.equal(resolveVideoIndex(false, [base], legacy)[0].collection, "playlist");
  assert.deepEqual(resolveVideoIndex(true, [], legacy), []);
  assert.equal(resolveVideoIndex(true, [base], legacy)[0].collection, "sessionRecordings");
});
test("Search, day filter, ordering and pagination across a 200-session archive", () => {
  const index = Array.from({length: 200}, (_, i) => resolveVideo({...base, _id: `video-${i}`, day: String(i % 4 + 1), order: 200 - i, speakers: [i % 2 ? "Amina" : "Ravi"], description: "Climate action"} as RawVideo)!);
  const result = selectVideoPage(index, {q: "amina climate", day: "2", page: "2"});
  assert.equal(result.total, 50); assert.equal(result.recordings.length, 12); assert.equal(result.pages, 5);
  assert.ok(result.recordings.every(v => v.day === "2" && v.speakers.includes("Amina")));
  assert.equal(selectVideoPage(index, {q: "missing"}).total, 0);
  assert.equal(selectVideoPage(index, {page: "999999"}).params.page, 17);
  assert.deepEqual(parseVideoParams({day: "invalid", page: "NaN", q: ["  hello  ", "ignored"]}), {day: "all", page: 1, q: "hello"});
  assert.equal(videoHref({q: "", day: "all", page: 2}, "/dev/gtp-library-review", {case: "many"}), "/dev/gtp-library-review?case=many&page=2#session-recordings");
  assert.equal(videoHref({q: "climate & action", day: "2", page: 2}), "/events/gtp-2026/media/videos?q=climate+%26+action&day=2&page=2#session-recordings");
});
test("PDF validation, safe download headers and partial availability", () => {
  const resource = resolveResource({_id: "toolkit", title: "Toolkit", downloads: [
    {_key: "summary", label: "Summary booklet", url: "https://cdn.sanity.io/files/y0tkemxm/production/abc.pdf", mimeType: "application/pdf", filename: "Summary booklet.pdf", size: 1048576},
    {_key: "full", label: "Full toolkit"},
    {label: "Wrong file", url: "https://cdn.sanity.io/files/y0tkemxm/production/abc.exe", mimeType: "application/pdf"},
    {label: "Untrusted", url: "https://evil.test/file.pdf", mimeType: "application/pdf"},
  ]})!;
  assert.equal(new URL(resource.downloads[0].href!).searchParams.get("dl"), "Summary booklet.pdf");
  assert.equal(resource.downloads[0].size, "1.0 MB");
  assert.ok(resource.downloads.slice(1).every(d => !d.href));
  assert.equal(resolveResource({_id: "drafts.toolkit", title: "Toolkit"}), undefined);
  assert.equal(resolveResourceSettings({title: "Editor title", intro: " "}).title, "Editor title");
});
test("Migration preserves all original content and image references", () => {
  const source = {_id: "gtp2026MediaPage", _type: "gtp2026MediaPage", videos: [{_key: "existing", _type: "gtpMediaVideo", title: "Original title", topic: "Original topic", youtubeUrl: base.youtubeUrl, thumbnail: {asset: {_ref: "image-original"}}}]};
  const docs = migrationVideoDocuments(source);
  assert.deepEqual(docs, migrationVideoDocuments(source));
  assert.equal(docs[0].title, "Original title"); assert.equal(docs[0].topic, "Original topic");
  assert.deepEqual(docs[0].thumbnail, source.videos[0].thumbnail);
  assertMigrationParity(docs, [{...docs[0], _rev: "r1", _createdAt: "yesterday"}]);
  assert.throws(() => assertMigrationParity(docs, [{...docs[0], title: "Editor changed"}]), /differs/);
  assert.throws(() => assertMigrationParity(docs, [{...docs[0], _id: `drafts.${docs[0]._id}`}]), /draft/);
  assert.throws(() => migrationVideoDocuments({...source, videos: [...source.videos, ...source.videos]}), /unique key/);
  assert.notEqual(canonicalContent({sourceRevision: "one"}), canonicalContent({sourceRevision: "two"}));
});
test("Seeds contain only known pending shells and never enable cutover", () => {
  assert.equal(resourceSeedDocuments.length, 4); assert.equal(videoSeedDocuments.length, 5);
  assert.ok(!JSON.stringify(resourceSeedDocuments).includes('"file":'));
  assert.ok(!JSON.stringify(videoSeedDocuments).includes("useVideoLibrary"));
  assert.ok(!JSON.stringify(videoSeedDocuments).includes("youtubeUrl"));
});
console.log(`${checks} behavioural test groups passed.`);
