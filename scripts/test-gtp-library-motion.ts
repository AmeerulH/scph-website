import assert from "node:assert/strict";
import fs from "node:fs";
import { resolve } from "node:path";
import { chromium, type Locator, type Page } from "playwright";
import { expect } from "playwright/test";

const origin = process.env.GTP_LIBRARY_TEST_ORIGIN || "http://127.0.0.1:3026";
const out = resolve(".impeccable/review/gtp-library");

async function sample(locator: Locator) {
  return locator.evaluate(element => {
    const style = getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return { opacity: Number(style.opacity), duration: style.transitionDuration, scale: matrix.a,
      background: style.backgroundColor, translateY: matrix.f, inert: (element as HTMLElement).inert,
      animations: element.getAnimations().map(animation => ({ duration: animation.effect?.getTiming().duration, state: animation.playState })) };
  });
}

async function nextFrame(page: Page) {
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
}

async function pointerClose(page: Page) {
  // Dispatch the pointer-originated click without Playwright waiting for the entrance to settle.
  await page.getByRole("button", { name: "Close video" }).evaluate(element =>
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
  await nextFrame(page);
}

async function main() {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  await context.route("https://www.youtube-nocookie.com/**", route => route.abort());
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const evidence: Record<string, unknown> = {};

  try {
    await page.goto(origin + "/dev/gtp-library-review");
    const trigger = page.locator("#daily-highlights button").first();
    const dialog = page.locator('[role="dialog"]');
    await trigger.click();
    await expect(dialog).toHaveAttribute("data-state", "open");
    evidence.pointerEntrance = await sample(dialog);
    assert.equal((evidence.pointerEntrance as Awaited<ReturnType<typeof sample>>).duration, "0.2s, 0.2s");
    await expect(dialog).toHaveCSS("opacity", "1");
    assert.equal(await page.locator("iframe").count(), 1);
    const title = await dialog.locator("h2").innerText();
    const height = (await dialog.boundingBox())!.height;
    await page.screenshot({ path: out + "/motion-desktop-open.png" });
    await pointerClose(page);
    evidence.pointerExit = await sample(dialog);
    assert.equal((evidence.pointerExit as Awaited<ReturnType<typeof sample>>).duration, "0.15s");
    assert.equal(await page.locator("iframe").count(), 0, "Playback must stop before the fade finishes");
    assert.equal(await dialog.locator("h2").innerText(), title);
    assert.equal(await dialog.evaluate(element => (element as HTMLElement).inert), true);
    await page.waitForTimeout(40);
    evidence.pointerExitPhase = await sample(dialog);
    const exitPhase = evidence.pointerExitPhase as Awaited<ReturnType<typeof sample>>;
    assert.ok(exitPhase.opacity > 0 && exitPhase.opacity < 1 && exitPhase.scale > 0.95 && exitPhase.scale < 1, "Exit must interpolate opacity and scale");
    assert.ok(Math.abs((await dialog.boundingBox())!.height / (await sample(dialog)).scale - height) < 1, "The frame placeholder preserves the closing geometry");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    assert.equal(await page.locator("body").getAttribute("data-scroll-locked"), null);
    assert.notEqual(await page.locator("body").evaluate(element => getComputedStyle(element).pointerEvents), "none");
    assert.equal(await trigger.evaluate(element => element.closest('[aria-hidden="true"]') !== null), false);

    // Retarget a still-running exit and wait beyond its cancelled cleanup fallback.
    await trigger.click();
    await page.evaluate(() => {
      document.getAnimations().filter(animation => {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        return target instanceof Element && ["70", "71"].includes(getComputedStyle(target).zIndex);
      }).forEach(animation => { animation.pause(); animation.currentTime = 40; });
    });
    evidence.slowEntrancePhase = await sample(dialog);
    const entrancePhase = evidence.slowEntrancePhase as Awaited<ReturnType<typeof sample>>;
    assert.ok(entrancePhase.opacity > 0 && entrancePhase.opacity < 1 && entrancePhase.scale > 0.95 && entrancePhase.scale < 1, "Entrance must interpolate opacity and scale");
    await page.screenshot({ path: out + "/motion-desktop-phase-40ms.png" });
    await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "paused").forEach(animation => animation.finish()));
    await expect(dialog).toHaveCSS("opacity", "1");
    await pointerClose(page);
    await trigger.evaluate(element => element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
    await page.waitForTimeout(250);
    await expect(dialog).toHaveAttribute("data-state", "open");
    assert.equal(await page.locator("iframe").count(), 1);
    assert.equal(await dialog.evaluate(element => element.contains(document.activeElement)), true);
    evidence.reopen = "Player survives the previous close fallback and retains focus";

    // Escape removes the dialog on the next render, including during a pointer entrance.
    await page.keyboard.press("Escape");
    await nextFrame(page);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await nextFrame(page);
    evidence.keyboardEntrance = await sample(dialog);
    assert.equal((evidence.keyboardEntrance as Awaited<ReturnType<typeof sample>>).duration, "0s");
    assert.equal((evidence.keyboardEntrance as Awaited<ReturnType<typeof sample>>).animations.length, 0);
    await page.getByRole("button", { name: "Close video" }).focus();
    await page.keyboard.press("Enter");
    await nextFrame(page);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();

    // A missing transitionend is bounded, without requiring a media-query JS subscription.
    await trigger.click();
    await expect(dialog).toHaveCSS("opacity", "1");
    await dialog.evaluate(element => { (element as HTMLElement).style.transition = "none"; });
    await pointerClose(page);
    await expect(dialog).toHaveAttribute("data-state", "closed");
    await expect(dialog).toHaveCount(0, { timeout: 500 });
    await expect(trigger).toBeFocused();
    evidence.fallback = "Missing transitionend releases presence, scroll lock and focus within 200ms";

    await page.emulateMedia({ reducedMotion: "reduce" });
    await trigger.click();
    evidence.reducedEntrance = await sample(dialog);
    assert.equal((evidence.reducedEntrance as Awaited<ReturnType<typeof sample>>).duration, "0.15s");
    assert.equal((evidence.reducedEntrance as Awaited<ReturnType<typeof sample>>).scale, 1);
    await expect(dialog).toHaveCSS("opacity", "1");
    await pointerClose(page);
    evidence.reducedExit = await sample(dialog);
    assert.equal((evidence.reducedExit as Awaited<ReturnType<typeof sample>>).duration, "0.15s");
    assert.equal((evidence.reducedExit as Awaited<ReturnType<typeof sample>>).scale, 1);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    assert.equal((await sample(dialog)).duration, "0s", "Keyboard mode must override the reduced-motion fade");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(origin + "/dev/gtp-library-review?view=resources&case=partial");
    const download = page.getByRole("link", { name: /^Download Sample Faith/ });
    const icon = download.locator("svg");
    await download.hover();
    await expect(icon).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 2)");
    await download.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    assert.equal((await sample(icon)).translateY, 0, "Keyboard focus must not inherit the hover nudge");
    evidence.desktopControls = "Fine-pointer icon nudge is 2px; keyboard focus remains still";

    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "no-preference" });
    await touchContext.route("https://www.youtube-nocookie.com/**", route => route.abort());
    const touchPage = await touchContext.newPage();
    touchPage.on("pageerror", error => errors.push(error.message));
    await touchPage.goto(origin + "/dev/gtp-library-review?view=resources&case=partial");
    assert.equal(await touchPage.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches), false);
    const touchDownload = touchPage.getByRole("link", { name: /^Download Sample Faith/ });
    await touchDownload.scrollIntoViewIfNeeded();
    await touchDownload.evaluate(element => element.addEventListener("click", event => event.preventDefault(), { once: true }));
    const background = (await sample(touchDownload)).background;
    const cdp = await touchContext.newCDPSession(touchPage);
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument");
    const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: 'a[href*="sample-booklet.pdf"]' });
    // CDP's synthetic held touch does not activate :active in headless Chrome.
    // Force only that pseudo-state to inspect the CSS; real taps below check behaviour.
    await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["active"] });
    await touchPage.waitForTimeout(120);
    evidence.touchPress = await sample(touchDownload);
    assert.ok((evidence.touchPress as Awaited<ReturnType<typeof sample>>).scale < 0.98);
    assert.equal((evidence.touchPress as Awaited<ReturnType<typeof sample>>).duration, "0.1s");
    assert.equal((evidence.touchPress as Awaited<ReturnType<typeof sample>>).background, background);
    await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
    await touchPage.waitForTimeout(200);
    assert.equal((await sample(touchDownload)).scale, 1);
    assert.equal((await sample(touchDownload)).background, background, "Touch must not leave a hover colour behind");
    assert.equal((await sample(touchDownload.locator("svg"))).translateY, 0);
    await touchDownload.tap();
    await touchPage.waitForTimeout(200);
    assert.equal((await sample(touchDownload)).background, background);
    await touchPage.emulateMedia({ reducedMotion: "reduce" });
    await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["active"] });
    await touchPage.waitForTimeout(120);
    assert.equal((await sample(touchDownload)).scale, 1, "Reduced motion removes the press transform");
    await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
    evidence.touchMethod = "Coarse-pointer CSS press sampled with forced :active; real taps confirm no sticky hover. Physical held-touch feel remains unverified.";
    await touchPage.emulateMedia({ reducedMotion: "no-preference" });
    await touchPage.goto(origin + "/dev/gtp-library-review");
    await touchPage.getByRole("button", { name: "Play Sample Day 1 highlights" }).tap();
    evidence.mobileEntrance = await sample(touchPage.locator('[role="dialog"]'));
    assert.equal((evidence.mobileEntrance as Awaited<ReturnType<typeof sample>>).duration, "0.2s, 0.2s");
    await expect(touchPage.locator('[role="dialog"]')).toHaveCSS("opacity", "1");
    assert.equal(await touchPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await touchPage.locator("#daily-highlights img").first().evaluate(element => getComputedStyle(element).objectFit), "contain");
    await touchPage.screenshot({ path: out + "/motion-mobile-open.png" });
    await touchContext.close();

    assert.deepEqual(errors, []);
    fs.writeFileSync(out + "/motion-results.json", JSON.stringify({ passed: true, evidence, errors }, null, 2));
    console.log("Library motion checks passed: pointer presence, immediate playback stop, focus/scroll cleanup, interruption, keyboard, reduced motion, fine hover, touch and mobile geometry.");
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
