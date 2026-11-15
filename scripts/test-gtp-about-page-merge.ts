import assert from "node:assert/strict";

import { DEFAULT_GTP_WHY_MATTERS } from "../src/data/gtp-about-page-defaults";
import { mergeGtpAboutPage } from "../src/sanity/gtp-about-page-merge";

const body = "First published paragraph.\n\nSecond published paragraph.";
const section = mergeGtpAboutPage({
  whyMattersBand: {
    body,
    title: "The Kuala Lumpur Tipping Points Declaration",
    ctaHref: "https://example.com/declaration",
    tallImageSrc: "https://example.com/cover.png",
  },
}).whyMatters;

assert.deepEqual(section.bodyParagraphs, [
  "First published paragraph.",
  "Second published paragraph.",
], "Deleted paragraphs must not be restored from defaults");
assert.equal(section.title, "The Kuala Lumpur Tipping Points Declaration");
assert.equal(section.ctaHref, "https://example.com/declaration");
assert.equal(section.tallImageSrc, "https://example.com/cover.png");

for (const value of [undefined, null, "", " \n\n\t "]) {
  assert.deepEqual(
    mergeGtpAboutPage({ whyMattersBand: { body: value } }).whyMatters.bodyParagraphs,
    [],
    "A cleared or unset CMS body must remain hidden",
  );
}

assert.deepEqual(
  mergeGtpAboutPage({ whyMattersBand: { body: "One paragraph." } }).whyMatters.bodyParagraphs,
  ["One paragraph."],
);
assert.deepEqual(
  mergeGtpAboutPage({ whyMattersBand: { body: " One.\r\n \r\nTwo.\n\n\nThree.\n\nFour. " } }).whyMatters.bodyParagraphs,
  ["One.", "Two.", "Three.", "Four."],
  "Keep all authored paragraphs and accept whitespace between paragraphs",
);

for (const doc of [undefined, null, {}, { whyMattersBand: null }]) {
  assert.deepEqual(mergeGtpAboutPage(doc).whyMatters, DEFAULT_GTP_WHY_MATTERS);
}
assert.equal(
  mergeGtpAboutPage({ whyMattersBand: { body, enabled: false } }).whyMatters.enabled,
  false,
);

console.log("PASS About body: deleted, cleared, single, multiple, fallback and hidden-section cases");
