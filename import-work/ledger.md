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
