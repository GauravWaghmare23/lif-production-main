# Content files — edit these, not the code

Everything you see on the site lives in these JSON files. Save → the page updates.

| File | What it controls |
|---|---|
| `sections.json` | **Page order** (`order` array — move an id up/down) + every section's text labels. `numbered` gives automatic 01, 02… numbers, `nav` shows it in the side dots. |
| `site.json` | Brand name, header nav links, button labels, social links, footer text |
| `projects.json` | Case studies. Copy an object to add one (unique `id` + `slug`). `video` = key from `videos.json` |
| `awards.json` | Awards list. `slug` links each award to a project; `total` is the full count |
| `services.json` | Capabilities list (numbers are automatic) |
| `process.json` | The 4 pinned production stages (`summary` is what shows on screen) |
| `team.json` | Crew roster — keep names identical to `director` / `cinematographer` in projects |
| `brands.json` | Client list for the "Trusted by" marquee |
| `stats.json` | The 4 "By the numbers" cards |
| `videos.json` | Video library — add a file once under `library`, reference by key |
| `inquiry.json` | "Commission Brief" modal: project types, disciplines, budget range, success message |

Local videos go in `/public/videos/` and are referenced with a path like `/videos/hero-video.mp4`.
