# 001 — Give the library player and controls purposeful motion

- Status: DONE — approved by the user's 19 October 2026 motion correction and subsequent proceed instruction; implemented and independently reviewed.
- Baseline commit: b041f77 on codex/gtp-resources-video-library; the user authorized subsequent feature commit/push/PR on 19 October 2026.
- Severity: MEDIUM
- Categories: state continuity, feedback, accessibility, interruption
- Scope: src/components/gtp/library/video-player.tsx and library.module.css; a targeted browser check and local documentation may accompany the pass.

## Motion thesis

Impeccable retains the existing GTP Read/Experience direction. The focal moment is selecting a film and bringing the player into protected focus, then returning to the selected film. Resources earns direct press/hover feedback on available downloads. Routine reading, search results and pending content stay steady. Preserve all content and whole artwork.

## Current seams

`video-player.tsx:17` derives Dialog open directly from the selected video and deletes that video immediately on close; the player and overlay appear/disappear with no continuity. `library.module.css:18-19,37-41,51-52,64-68` has instant control state changes and no local player transitions. The global reduced-motion rule in `src/app/globals.css:160-168` sets transition duration to 0.01ms with !important, so a deliberate local reduced-motion alternative must account for that.

Current player lifecycle:

```tsx
<Dialog.Root open={Boolean(active)} onOpenChange={open => { if (!open) setActive(undefined); }}>
```

## Target and ingredients

Use the established `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` from globals.css:173. Follow ~/.agents/skills/animate/SKILL.md and RECIPES.md, then review against ~/.agents/skills/review-animations/STANDARDS.md.

1. Pointer/touch player entrance: opacity 0 → 1 and centered scale(0.95) → scale(1), 200ms, existing strong ease-out. Preserve the current translate(-50%, -50%) placement and center origin. Overlay fades with the same entrance. Exit follows the same path in 150ms. No page-load or scroll choreography.
2. Use interruptible CSS transitions and @starting-style, not resetting keyframes or an additional animation library. Keep Radix accessibility. Separate visual presence/selected data from open state so closing can animate while the iframe is removed immediately. Keep closing title/description stable; finish removal on the dialog's own opacity transition end, with a bounded 200ms cleanup fallback that is cancelled on reopen. Stale close completions must never remove a reopened player. Closing controls must not accept focus/actions. Body scroll/focus locks must be released and the trigger restored at removal.
3. Keyboard-originated activation (`click.detail === 0`), keyboard close and Escape are immediate, with no spatial or opacity delay. Pointer outside/close interactions use normal motion. The reduced-motion pointer path removes scale/translation changes and keeps a 150ms opacity fade. Scope overrides of the existing global !important duration reset to these library player elements only; instant keyboard mode must still win. Honour live preference changes through CSS.
4. Available downloads, search/channel/browse buttons, play controls and close affordances get explicit, retargetable feedback: pointer/touch press scale(0.97), 100ms into press and 160ms release, strong ease-out. Prefer changing the play glyph's control rather than its whole thumbnail. Keyboard :focus-visible must not move. Fine-pointer hover only: a 2px download-icon nudge and subtle control colour feedback, 160ms; never zoom/crop/filter supplied images. Pending entries remain inert. Reduced motion removes the press/icon transforms; focus and colour acknowledgement remain immediate/legible. No new dependency or looping animation.

## Boundaries

Keep page composition, CMS models/content/data loading, search/filter/navigation semantics, iframe URL/security attributes and all prior feature changes intact. Do not change shared global motion rules, the site-wide navbar/motion system, root checkout files or dependencies. Do not stage, commit, push, deploy, publish, or write CMS data.

## Verification

- Run the existing behavioural/browser checks, root TypeScript, npm run lint and npm run build with the native Node runtime. Full lint must stay exactly at the existing 17-error/11-warning baseline; no new finding in changed files.
- Add a targeted Chrome check for normal open/exit durations, immediate iframe removal, close-completion focus restoration, rapid close/reopen without stale unmount, keyboard open/Escape with no animation, touch feedback without sticky hover, and reduced-motion fade without scale. Check reduced-motion CSS computed values despite the global reset.
- Inspect normal motion at desktop and 390px phone widths, including a slow-motion/player phase check. Confirm content/artwork stay whole and the document has no new layout shift or overflow.
- Have a separate review-animations pass report the required Before/After/Why table and explicit Approve/Block verdict.
- Recheck affected-route mobile performance after a fresh production build. Preserve ≥80 on Resources/Videos/Media; leave the four separately recorded route findings outside this pass.

## Independent motion review

Source-only review on 19 October 2026 returned **Approve**, with no actionable motion, interruption, lifecycle or accessibility defects. Browser and performance verification are recorded separately in `docs/gtp-library-validation.md`.

| Before | After | Why |
| --- | --- | --- |
| Immediate player removal | Separate open state and retained selected video; iframe removed immediately; visual presence ends on opacity exit or bounded fallback | Playback stops promptly while the close remains coherent; reopen cancels cleanup. |
| Instant pointer state changes | Interruptible 200ms entrance / 150ms exit, strong easing, centered .95 scale and opacity | Brief focus transition without layout animation or keyframe restarts. |
| No input/preference distinction | Immediate keyboard/Escape; reduced-motion pointer fade without scale | Fast keyboard use and preference-specific movement handling. |
| No control acknowledgement | 100ms press / 160ms release, gated hover and stationary keyboard focus | Available controls acknowledge action while artwork and pending states remain steady. |

## Execution evidence

Chrome motion and existing browser checks, eight behavioural groups, root TypeScript, focused lint and fresh production build passed. Full lint matched the existing 17-error/11-warning baseline exactly. Parent inspected desktop, paused-40ms and 390px player captures; no material fixes. Test JSON records actual 200/150ms interpolation, interruption, focus/scroll release, keyboard instant and reduced-motion fade. Coarse-pointer press styling used forced :active plus real emulated taps; physical held-touch feel and real playback remain manual checks.

Fresh mobile results: Resources 86, Videos 82, Media initially 78 then three-sample median 80 without source changes. The borderline Media result and raw evidence are preserved in `docs/gtp-library-validation.md`; no unrelated optimisation was added. Nothing was staged, committed, pushed, deployed or written to CMS.
