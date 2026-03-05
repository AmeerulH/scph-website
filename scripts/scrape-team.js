/**
 * SCPH Staff Profile Scraper
 *
 * Dynamically discovers all staff slugs from both listing pages:
 *   https://sunwayuniversity.edu.my/staff-profiles/school/Planetary%20Health?page=0
 *   https://sunwayuniversity.edu.my/staff-profiles/school/Planetary%20Health?page=1
 *
 * Then scrapes each profile at:
 *   https://sunwayuniversity.edu.my/research/planetaryhealth/staff-profiles/<slug>
 *
 * Usage:
 *   node scripts/scrape-team.js
 *
 * Output:
 *   - public/images/scph/team/<slug>.<ext>  (profile photos)
 *   - scripts/team-data.json                (all profile data)
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const BASE_URL = "https://sunwayuniversity.edu.my";

// Listing pages that contain all SCPH staff cards
const LISTING_PAGES = [
  `${BASE_URL}/staff-profiles/school/Planetary%20Health?page=0`,
  `${BASE_URL}/staff-profiles/school/Planetary%20Health?page=1`,
];

const IMAGES_DIR = path.join(__dirname, "../public/images/scph/team");
const OUTPUT_JSON = path.join(__dirname, "team-data.json");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try { fs.unlinkSync(destPath); } catch (_) {}
          const redirect = res.headers.location.startsWith("http")
            ? res.headers.location
            : `${BASE_URL}${res.headers.location}`;
          return downloadFile(redirect, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(destPath); } catch (_) {}
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        try { fs.unlinkSync(destPath); } catch (_) {}
        reject(err);
      });
  });
}

async function scrapePage(page, slug, profileUrl) {
  const url = profileUrl || `${BASE_URL}/research/planetaryhealth/staff-profiles/${slug}`;
  console.log(`\n  → ${url}`);

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // ── Name ───────────────────────────────────────────────────────────────────
  const name = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1"));
    const nameH1 = headings.find(
      (h) => h.textContent.trim().toLowerCase() !== "planetary health"
    );
    return nameH1 ? nameH1.textContent.trim() : "";
  });

  // ── Titles ─────────────────────────────────────────────────────────────────
  const titles = await page.evaluate(() => {
    const nameH1 = Array.from(document.querySelectorAll("h1")).find(
      (h) => h.textContent.trim().toLowerCase() !== "planetary health"
    );
    const bioH2 = Array.from(document.querySelectorAll("h2")).find(
      (h) => h.textContent.trim().toLowerCase() === "biography"
    );
    if (!nameH1) return [];
    return Array.from(document.querySelectorAll("li"))
      .filter((li) => {
        if (!(nameH1.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
        if (bioH2 && !(bioH2.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_PRECEDING)) return false;
        if (li.closest("nav") || li.closest("header") || li.closest("footer")) return false;
        const text = li.textContent.trim();
        return text && text.toLowerCase() !== "planetary health";
      })
      .map((li) => li.textContent.trim());
  });

  // ── Email ──────────────────────────────────────────────────────────────────
  // The profile page uses a plain mailto: link with class "emailicon".
  // DevTools confirms: <a href="mailto:jemilah@sunway.edu.my" class="emailicon">
  const email = await page.evaluate(() => {
    const link =
      document.querySelector("a.emailicon[href^='mailto:']") ||
      document.querySelector("a[href^='mailto:']");
    if (!link) return "";
    return link.getAttribute("href").replace("mailto:", "").trim();
  });

  // ── Biography ──────────────────────────────────────────────────────────────
  const bio = await page.evaluate(() => {
    const bioH2 = Array.from(document.querySelectorAll("h2")).find(
      (h) => h.textContent.trim().toLowerCase() === "biography"
    );
    if (!bioH2) return "";
    const paras = [];
    let el = bioH2.nextElementSibling;
    while (el && !["H2", "H3", "H4"].includes(el.tagName)) {
      const text = el.textContent.trim();
      if (text) paras.push(text);
      el = el.nextElementSibling;
    }
    return paras.join("\n\n");
  });

  // ── Profile Image ──────────────────────────────────────────────────────────
  // The headshot is an img.img-fluid with /staff-images/ in src,
  // located above the Biography h2 in the DOM.
  const imgSrc = await page.evaluate(() => {
    const bioH2 = Array.from(document.querySelectorAll("h2")).find(
      (h) => h.textContent.trim().toLowerCase() === "biography"
    );
    const allImgs = Array.from(document.querySelectorAll("img"));
    const aboveBio = bioH2
      ? allImgs.filter(
          (img) => bioH2.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_PRECEDING
        )
      : allImgs;

    return (
      aboveBio.find((img) => img.classList.contains("img-fluid") && img.src.includes("/staff-images/"))?.src ||
      aboveBio.find((img) => img.src.includes("/staff-images/"))?.src ||
      aboveBio.find((img) => img.src.includes("/sites/default/files/styles/"))?.src ||
      aboveBio.find((img) => img.src.includes("/sites/default/files/"))?.src ||
      ""
    );
  });

  // ── Save Image ─────────────────────────────────────────────────────────────
  let savedImagePath = "";
  if (imgSrc) {
    const rawExt = imgSrc.split("?")[0].split(".").pop().toLowerCase();
    const ext = ["jpg", "jpeg", "png", "webp"].includes(rawExt) ? rawExt : "jpg";
    const filename = `${slug}.${ext}`;
    const destPath = path.join(IMAGES_DIR, filename);
    try {
      await downloadFile(imgSrc, destPath);
      savedImagePath = `/images/scph/team/${filename}`;
      console.log(`     ✅ Image: ${filename}`);
    } catch (e) {
      console.log(`     ⚠️  Image failed: ${e.message}`);
    }
  } else {
    console.log(`     ⚠️  No image found`);
  }

  const primaryTitle =
    titles.find((t) =>
      /director|manager|head|adviser|advisor|analyst|fellow|scientist|executive|coordinator|lecturer/i.test(t)
    ) ||
    titles[0] ||
    "";

  console.log(`     Name:  ${name}`);
  console.log(`     Title: ${primaryTitle}`);
  console.log(`     Email: ${email}`);
  console.log(`     Bio:   ${bio.slice(0, 80)}…`);

  return {
    slug,
    name: name || "(not found)",
    title: primaryTitle,
    allTitles: titles,
    email,
    bio,
    image: savedImagePath,
    profileUrl: url,   // actual URL used (may differ per person)
  };
}

/**
 * Visits both listing pages and collects all unique {slug, profileUrl} pairs.
 * "View Profile" links are captured as-is so we use the correct URL for each person
 * (some may be at /research/planetaryhealth/staff-profiles/<slug>,
 *  others at the generic /staff-profiles/<slug>).
 */
async function discoverProfiles(context) {
  // Map: slug → full profile URL (keeps the URL from the first listing that finds it)
  const profileMap = new Map();

  for (const listingUrl of LISTING_PAGES) {
    console.log(`\n📋 Discovering profiles from: ${listingUrl}`);
    const page = await context.newPage();
    try {
      await page.goto(listingUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      // Allow JS to render the staff cards
      await page.waitForTimeout(2500);

      const links = await page.evaluate((baseUrl) => {
        return Array.from(document.querySelectorAll("a[href*='/staff-profiles/']"))
          .map((a) => {
            const href = a.getAttribute("href");
            if (!href) return null;
            // Resolve relative hrefs
            const full = href.startsWith("http") ? href : `${baseUrl}${href}`;
            return full;
          })
          .filter(Boolean);
      }, BASE_URL);

      for (const url of links) {
        // Skip the listing pages themselves
        if (url.includes("?page=") || url.includes("/school/")) continue;

        const m = url.match(/\/staff-profiles\/([^/?#]+)\/?$/);
        if (m && m[1]) {
          const slug = m[1];
          if (!profileMap.has(slug)) {
            profileMap.set(slug, url);
          }
        }
      }

      console.log(`   Found ${profileMap.size} profiles so far…`);
    } catch (err) {
      console.log(`   ⚠️  Could not load listing page: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  const profiles = Array.from(profileMap.entries()).map(([slug, url]) => ({ slug, url }));
  console.log(`\n✅ Total unique profiles discovered: ${profiles.length}`);
  profiles.forEach(({ slug, url }) => console.log(`   • ${slug}  →  ${url}`));
  return profiles;
}

async function main() {
  console.log("🚀 Starting SCPH staff profile scraper…\n");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  // Step 1: discover all profiles dynamically from both listing pages
  const profiles = await discoverProfiles(context);

  if (profiles.length === 0) {
    console.log("\n❌ No profiles found — check that the listing pages loaded correctly.");
    await browser.close();
    process.exit(1);
  }

  // Step 2: scrape each individual profile
  const allProfiles = [];

  for (const { slug, url } of profiles) {
    const page = await context.newPage();
    try {
      const profile = await scrapePage(page, slug, url);
      allProfiles.push(profile);
    } catch (err) {
      console.log(`     ❌ Failed: ${slug} — ${err.message}`);
      allProfiles.push({ slug, name: "(error)", error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allProfiles, null, 2), "utf-8");
  console.log(`\n✅ Done! ${allProfiles.length} profiles scraped.`);
  console.log(`📁 Images → public/images/scph/team/`);
  console.log(`📄 Data   → scripts/team-data.json`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
