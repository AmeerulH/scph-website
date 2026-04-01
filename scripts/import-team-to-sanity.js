/**
 * SCPH Team Data → Sanity Import Script
 *
 * Reads scripts/team-data.json, uploads each member's profile photo to
 * Sanity's asset pipeline, then creates (or replaces) the corresponding
 * `teamMember` document in the dataset.
 *
 * Pre-requisites:
 *   1. Install the client:  npm install @sanity/client
 *   2. Add to .env.local:   SANITY_API_TOKEN=<your-token>
 *      → Create a token at: https://www.sanity.io/manage/project/y0tkemxm/api
 *        (Permissions: Editor or above)
 *
 * Usage:
 *   node scripts/import-team-to-sanity.js
 *
 * Re-running is safe — existing documents are replaced (createOrReplace).
 */

const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

// ── Sanity client ─────────────────────────────────────────────────────────────

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "❌  SANITY_API_TOKEN is not set.\n" +
    "    Add it to .env.local — see the header of this script for instructions."
  );
  process.exit(1);
}

const client = createClient({
  projectId: "y0tkemxm",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Group & order mapping ─────────────────────────────────────────────────────
// Maps each member's slug → { group, order }
// order controls display position within the group (lower = first)

const MEMBER_CONFIG = {
  // Leadership
  'professor-tan-sri-dr-jemilah-mahmood':               {group: 'leadership', order: 1},
  'oliver-lacey-hall':                                  {group: 'leadership', order: 2},

  // Policy & Strategic Advocacy
  'saidatul-maisarah-faiesall-binti-ahmad-faiesall':    {group: 'policy-and-strategic-advocacy', order: 1},
  'maneesha-kaur-khalae':                               {group: 'policy-and-strategic-advocacy', order: 2},
  'aina-aaliyah':                                       {group: 'policy-and-strategic-advocacy', order: 3},
  'matthew-carvalho':                                   {group: 'policy-and-strategic-advocacy', order: 4},

  // Knowledge & Learning
  'dr-fatimah-ahamad':                                  {group: 'knowledge-and-learning', order: 1},
  'dr-loo-yen-yi':                                      {group: 'knowledge-and-learning', order: 2},
  'dr-noorul-ezyan-binti-nor-hashim':                   {group: 'knowledge-and-learning', order: 3},
  'aiza-nadira-shahrizal':                              {group: 'knowledge-and-learning', order: 4},
  'siti-hannah-zuhairah-binti-mohamad-ariff':           {group: 'knowledge-and-learning', order: 5},
  'sharifah-husna-binti-syed-zainal-yussof':            {group: 'knowledge-and-learning', order: 6},
  'alaa-binti-zain-al-aabideen':                        {group: 'knowledge-and-learning', order: 7},

  // Programmes
  'nazia-ahmad':                                        {group: 'programmes', order: 1},
  'hanis-azemi':                                        {group: 'programmes', order: 2},
  'damia-munira':                                       {group: 'programmes', order: 3},
  'nurul-hamizah-binti-nor-ahmad-kefli':                {group: 'programmes', order: 4},
  'misfahulhairah-binti-shariff':                       {group: 'programmes', order: 5},
  'nor-wahyuni-binti-abdull-rahim':                     {group: 'programmes', order: 6},
  'mohd-shahrul-aziezan-bin-abdul-aziz':                {group: 'programmes', order: 7},

  // Communications
  'laila-iskandar':                                     {group: 'communications', order: 1},
  'hamizah-norrizam':                                   {group: 'communications', order: 2},
  'aina-masturina':                                     {group: 'communications', order: 3},
  'nurul-nadia-radzif':                                 {group: 'communications', order: 4},
  'radin-nasuha-radin-shamsulkamar':                    {group: 'communications', order: 5},

  // Other
  'zebo-khamraeva':                                     {group: 'other', order: 1},
};

// ── Paths ─────────────────────────────────────────────────────────────────────

const TEAM_DATA_PATH = path.join(__dirname, "team-data.json");
const PUBLIC_DIR = path.join(__dirname, "../public");

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Uploads a local image file to Sanity and returns the asset reference object,
 * or null if the file doesn't exist / upload fails.
 */
async function uploadImage(imagePath, memberName) {
  if (!imagePath) return null;

  // imagePath looks like "/images/scph/team/some-slug.jpg"
  // Strip the leading "/" and resolve relative to the public folder
  const localPath = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ""));

  if (!fs.existsSync(localPath)) {
    console.log(`   ⚠️  Image not found locally, skipping: ${localPath}`);
    return null;
  }

  const ext = path.extname(localPath).replace(".", "") || "jpg";
  const fileStream = fs.createReadStream(localPath);

  try {
    const asset = await client.assets.upload("image", fileStream, {
      filename: path.basename(localPath),
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
    console.log(`   ✅ Image uploaded: ${asset._id}`);
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    console.log(`   ⚠️  Image upload failed for ${memberName}: ${err.message}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting Sanity import…\n");

  const teamData = JSON.parse(fs.readFileSync(TEAM_DATA_PATH, "utf-8"));
  console.log(`📄 Found ${teamData.length} team members in team-data.json\n`);

  let created = 0;
  let failed = 0;

  for (const member of teamData) {
    console.log(`→ ${member.name}`);

    // Upload profile photo (if available)
    const imageField = await uploadImage(member.image, member.name);

    const config = MEMBER_CONFIG[member.slug] || {group: 'other', order: 99};
    if (!MEMBER_CONFIG[member.slug]) {
      console.log(`   ⚠️  No group config found for slug "${member.slug}", defaulting to "other"`);
    }

    // Build the Sanity document
    const doc = {
      _type: "teamMember",
      // Use the slug as a deterministic _id so re-runs are idempotent
      _id: `teamMember-${member.slug}`,
      name: member.name,
      slug: {
        _type: "slug",
        current: member.slug,
      },
      title: member.title || "",
      allTitles: Array.isArray(member.allTitles) ? member.allTitles : [],
      email: member.email || "",
      bio: member.bio || "",
      profileUrl: member.profileUrl || "",
      group: config.group,
      order: config.order,
      ...(imageField ? { image: imageField } : {}),
    };

    try {
      await client.createOrReplace(doc);
      console.log(`   ✅ Document created/updated\n`);
      created++;
    } catch (err) {
      console.log(`   ❌ Failed to create document: ${err.message}\n`);
      failed++;
    }
  }

  console.log("─────────────────────────────────────────");
  console.log(`✅ Imported:  ${created} members`);
  if (failed > 0) console.log(`❌ Failed:    ${failed} members`);
  console.log("\nDone! Open your Sanity Studio to verify the documents.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
