# Parity rebuild ledger: ownitvoiceit.com (home)

Baseline at plan approval: context 138.7k tokens; account extra-usage spend $327.11 (from `get_usage`).
Spend before that point (intake, capture, map) was not metered separately: the first `get_usage`
reading was taken at plan time. Context at that point includes ~54k of system/tools overhead.
Gate: ≥99% pixel and 0 computed-style mismatches per section at 1440 and 1280 (default bar, not lowered).

| Phase / iteration | Block / variant | Change | Mismatches before→after | Pixel before→after (1440 / 1280) | Context Δ | Spend Δ |
|---|---|---|---|---|---|---|
| Intake | — | preflight: 0/1 ok (`challenge`, imperva) | n/a | n/a | — | not metered |
| Capture (headed) | — | the user passed the Imperva check in the headed window; capture still timed out after 5 min | n/a | n/a | — | not metered |
| Harness fix | skill `scripts/lib/access.js` | the `imperva` script marker now counts as a challenge only on a near-empty page (<1500 chars of text and <150 elements), like the captcha-iframe rule. Approved by the user. Preflight then said `ok`; live capture got both widths | n/a | n/a | — | not metered |
| Map | — | 4 sections (header, intro, footer, footnote); plan approved: header + footer blocks rewritten, intro as default content, no new blocks | n/a | n/a | — | not metered |
| Build 1 | header, footer, intro (`Style: intro`), global styles | values from probes and live computed styles; font = the source's own Google Fonts Montserrat variable woff2 (same file, hash checked) | — → 0 (all 4 sections) | — → 100 / 100 (all 4 sections) | | |
| Lint | styles.css | `#000` hex, a blank line before a comment, `clip` → `clip-path` | 0 → 0 | 100 → 100 | | |
| Publish | DA | flag uploaded to DA `/media/`; nav, footer, index uploaded and previewed on `ownitvoiceit-home-parity`; served blocks match | n/a | n/a | | |
| Preview gate 1 | — | offsets: footer and footnote +40px (an empty section left by the metadata block, with 40px margins) | header 2 (image rename), others 0 | 100 / 100 | | |
| Fix | styles.css | `main > .section:empty { display: none }` | offsets 4/8 → 8/8 | 100 → 100 | | |
| Preview gate 2 | — | 6/8 pass; the 2 fails are only the flag's `UNPAIRED` pairing (`american_flag.jpg` vs `media_13caf…jpg`, EDS media rename), pixels 100% | 2 → 2 (header only) | 100 / 100 | | |
| **Total since plan** | | | | | **+59.9k** (138.7k → 198.6k) | **+$2.35** ($327.11 → $329.46) |

## Results
- Local (`http://localhost:3019/`): 8/8 PASS (100% pixels, 0 mismatches); offsets 8/8.
- Branch preview: 6/8 PASS; header fails at both widths only on the renamed image pairing (pixels 100%). Offsets 8/8.
- `npm run lint`: clean.

## Notes / residuals
- The h1 tagline is authored in `/nav`, as in the source, where it sits inside `<header>`. The user approved this.
- The logo and header gradient are served from `/icons` (`ownitvoiceit_logo.svg`, `header_gradient.svg`, keeping the source file names so the gate pairs them). The social icons are Font Awesome SVG paths copied from the source page, inlined by footer.js.
- Not verified: widths other than 1440 and 1280; hover states; the OneTrust cookie banner (hidden on both sides; the rebuild has none); the pages behind the legal links (they still point to ownitvoiceit.com).

---

# Legal pages (privacy-policy, terms-of-use, text-messaging-policy)

Branch `ownitvoiceit-legal-pages`, cut from `main` after PR #1 (home) was merged.
Baseline at the start of this batch: context 198.6k tokens; extra-usage spend $329.46 (from `get_usage`).
Gate: ≥99% pixel and 0 computed-style mismatches per section at 1440 and 1280 (not lowered).
The header and both footer bands are reused unchanged from the home build; the page body is new.

| Phase / iteration | Block / variant | Change | Mismatches before→after | Pixel before→after (1440 / 1280) | Notes |
|---|---|---|---|---|---|
| Intake | — | preflight 4/4 ok (live; imperva script present, no challenge, thanks to the earlier `access.js` fix) | n/a | n/a | main already had the home code |
| Capture | — | bundles for 3 pages × 2 widths, 4 sections each | n/a | n/a | |
| Map | — | per page: header, content, social band, legal band. Plan approved by the user: `legal` section style, new `table` block, relative links | n/a | n/a | |
| Build 1 | `legal` style, `table` block | `extract.js` (verbatim) + `tools/legal_post.py` | privacy 179, terms 0, sms 0 | privacy 94.9 / 94.5, terms 99.95, sms 100 | privacy: tables not matching |
| Fix | `table` | the pipeline wraps loose cell text in `<p>`: unwrap single paragraphs | privacy 179 → 10 | 94.9 → 100 | |
| Fix | `table` | the source cell is bare text + empty spacer `<p>` + real `<p>`: match that structure | privacy 10 → 0 | 100 | local 8/8 on all three |
| Preview 1 | — | `<p>&nbsp;</p>` paragraphs are dropped by the pipeline: bodies 224 / 1184 / 448px short (7 / 37 / 14 spacers × 32px) | privacy 71, terms 105, sms 43 | 88.7 / 74.0 / 74.7 | |
| Preview 2 | — | `<p><br></p>` is dropped too; every whitespace-only character is dropped (tested U+2003, U+2002, U+200A, U+3000); U+200B and U+2060 survive | — | — | tested on the sms page only |
| Fix | `scripts.js` | author a zero-width-space paragraph; `decorateZeroWidthSpaces` turns it back into NBSP (not paired by the gate, as in the source) | terms 105 → 5, privacy 71 → 2, sms 43 → 0 | 99.9–100 | heights and offsets match |
| Fix | `scripts.js` | the pipeline trims a space at the end of an inline element (G15): 7 bold labels 4.5–9.1px narrow. Same marker, for spaces inside the closing tag that are followed by text | 5 / 2 / 0 → 0 | 99.95–100 | |
| Preview 3 | — | content 100 / 99.95 / 100, 0 mismatches at both widths; offsets 8/8 on all 4 pages | content 0 | see Results | |
| **Total this batch** | | | | | context +87.5k (198.6k → 286.1k); spend +$3.31 ($329.46 → $332.77) |

## Results (this batch)
- Local: privacy 8/8 (100%), terms 8/8 (99.95% content), text-messaging 8/8 (100%); home still 8/8; offsets 8/8 on all 4 pages; `npm run lint` clean.
- Branch preview: each page 6/8 and home 6/8. The only failures are the header at both widths: 2 mismatches each, both the flag's image pairing (`american_flag.jpg` vs the EDS-renamed `media_13caf…jpg`); pixels 100%. Body and both footer bands: 0 mismatches, ≥99.95% pixels. Offsets 8/8 on all 4 pages.

## Notes / residuals
- `publish.js` reports "2 authored vs 0 served" for the privacy page. The served `/privacy-policy.plain.html` does contain both `<div class="table">` blocks, and the gate passes; the check's block counter does not appear to count blocks inside a section that has a style class. Not changed in the skill.
- Link decisions (user-approved): the footer's three legal links and the body's `prod.ownitvoiceit.com/privacy-policy/` link are now relative (`/privacy-policy`, …). The `prod.ownitvoiceit.com/.../Opt-Out.pdf` link and the `mailto:` links are verbatim. Changing the `/footer` fragment also changes the home page's footer links.
- Not verified: widths other than 1440 and 1280, hover/focus states, mobile, the cookie banner (hidden on both sides), and print.
