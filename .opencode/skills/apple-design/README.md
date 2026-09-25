# Apple Design Skill

An AI design reviewer grounded in Apple's Human Interface Guidelines, vendored into this
project's OpenCode setup. It audits and improves mobile and desktop UI against 122 HIG pages
pulled straight from developer.apple.com, translates Apple's vocabulary for **Flutter**,
**React Native**, **Tauri**, **Electron**, **SwiftUI**, **UIKit**, and **AppKit**, and adds a
design-craft lens so the result feels at home on the platform without looking like a template.

## Use it

Ask your agent things like:

- *"Review my Flutter app's home screen against Apple's guidelines"*
- *"Audit this Tauri app for accessibility"*
- *"Does this settings screen follow macOS conventions?"*
- *"This looks generic. Give it a point of view without breaking iOS patterns"*
- *"How do I do Liquid Glass in React Native?"*
- *"Check this app icon"*
- *"Is this onboarding flow asking for permissions the right way?"*

The skill triggers automatically on design-review requests. It also complements the other
design skills in `.opencode/skills/`:

| Skill | Lens |
| --- | --- |
| `apple-design` | Mobile/desktop app design against Apple's HIG (this skill) |
| `frontend-design` | Distinctive, non-templated visual direction for web |
| `web-design-guidelines` | Web UI review against the Web Interface Guidelines + this project's design system |

## What a review covers

The reviewer reads the relevant guideline files before it writes a word, then works through:

1. **Apple's eight design principles** (reintroduced June 2026): purpose, agency, responsibility,
   familiarity, flexibility, simplicity, craft, delight.
2. **Accessibility**, blocking: text scaling, contrast ratios, control sizes, screen readers,
   keyboard access, motion and transparency settings, with the actual numbers.
3. **Platform conventions**: tab bars, toolbars, sheets, search, and safe areas on mobile; the
   menu bar, windows, sidebars, shortcuts, and settings on desktop; light and dark everywhere.
4. **Visual design and craft**: color, type, layout, icons, materials, motion, and then whether
   the design has a point of view or is one of the three looks that dominate generated UI.
5. **Interaction**: loading, feedback, alerts, modality, destructive actions, undo, data entry.
6. **Content and writing**: labels that say what happens, platform-correct capitalization,
   errors and empty states that direct people.

Every finding has a What, a Why that cites the guideline file and heading, and a Fix written in
your framework. Specialized modes cover app icons, accessibility audits, dark mode, Liquid Glass,
navigation structure, onboarding and permissions, forms, generative AI, and single components.

**Improvement mode** goes further: it grounds the design in the product, plans a token system
(palette, type roles, layout wireframe, one signature element, motion), critiques that plan
against generic defaults before proposing it, and sequences the fixes from accessibility to
polish.

## What's inside

```text
.opencode/skills/apple-design/
├── SKILL.md                     # The skill: stance, principles, lenses, report format, improvement mode
├── README.md                    # This file: usage and maintenance
├── scripts/
│   └── pull-hig.mjs             # Re-pulls the guidelines from developer.apple.com
└── references/
    ├── hig-lookup.md            # Generated routing table with Apple's summaries and change dates
    └── hig/                     # 122 generated pages + 1 curated guide
        ├── design-principles.md
        ├── accessibility.md
        ├── buttons.md
        ├── tab-bars.md
        ├── liquid-glass.md      # Curated: rules, review checklist, cross-platform translation
        └── ...
```

| Section | Files | Includes |
| --- | --- | --- |
| Getting started | 5 | Design principles; designing for iOS, iPadOS, macOS, and games |
| Foundations | 16 | Accessibility, color, typography, layout, materials, dark mode, icons, SF Symbols, images, motion, branding, privacy, inclusion, right to left, writing, app icons |
| Patterns | 24 | Onboarding, launching, loading, feedback, modality, searching, settings, notifications, accounts, data entry, undo, sharing, files, charts, audio, video, haptics, printing, multitasking, full screen, help, drag and drop, ratings, live viewing |
| Components | 57 | Buttons, menus, the menu bar, toolbars, tab bars, sidebars, split views, sheets, alerts, action sheets, popovers, panels, windows, lists and tables, collections, text fields, pickers, toggles, sliders, steppers, segmented controls, search fields, progress indicators, gauges, labels, charts, widgets, notifications, Live Activities, controls, status bars, and more |
| Inputs | 7 | Gestures, keyboards, pointing devices, focus and selection, game controls, Apple Pencil, gyroscope and accelerometer |
| Technologies | 13 | Apple Pay, in-app purchase, Sign in with Apple, Siri, Maps, augmented reality, machine learning, generative AI, iCloud, AirPlay, NFC, App Clips, VoiceOver |
| Curated | 1 | Liquid Glass |

Each generated page keeps Apple's wording, headings, tables, notes, and change log, links to its
source, relabels platform headings by device class (phone, tablet, mobile, desktop), and omits
the sections that apply only to tvOS, visionOS, or watchOS. The 35 pages Apple publishes for
other platforms or Apple-only services are listed, with the reason, at the end of
`references/hig-lookup.md`.

## Keeping the references current

Apple revises the HIG several times a year. To pull the latest version:

```bash
node .opencode/skills/apple-design/scripts/pull-hig.mjs
```

Node 18 or newer, no dependencies, about 150 requests. The script crawls Apple's section index,
renders each page from the same JSON Apple's site uses, writes `references/hig/*.md` and
`references/hig-lookup.md`, and removes pages Apple has retired. Pass `--cache <dir>` to keep the
raw JSON for instant re-runs, and `--no-prune` to keep files the crawl no longer finds. Running
the script twice produces identical output, so a clean `git status` after a second run is the
test.

### What the script does

- Crawls Apple's six HIG sections and their sub-collections (157 pages as of September 2026).
- Keeps every page that applies to iOS, iPadOS, or macOS, omits Apple-only hardware and services
  listed in `OMITTED_PAGES`, and records every omission with a reason in `hig-lookup.md`.
- Renders Apple's JSON to Markdown faithfully: headings, paragraphs, lists, tables, notes, and
  tabbed content as sub-headings. Images and videos are dropped except for check-mark glyphs in
  comparison tables.
- Relabels platform headings by device class (`Phone (iOS)`, `Tablet (iPadOS)`,
  `Mobile (iOS, iPadOS)`, `Desktop (macOS)`, and combinations), drops sections that apply only
  to tvOS, visionOS, or watchOS (sentences that mention them stay), and rewrites cross-references
  as local links whose anchors match the relabeled headings. Links to headings that were dropped
  or that Apple no longer publishes point at the file instead.
- Keeps each page's change log and turns Apple's "Related" links into a "Related guidelines"
  list.
- Prunes generated files for pages Apple removed. Curated files are never pruned, and a run
  that would prune more than a tenth of the files stops and asks for `--force-prune`.

### Checks before finishing a refresh

```bash
node --check .opencode/skills/apple-design/scripts/pull-hig.mjs
node .opencode/skills/apple-design/scripts/pull-hig.mjs --cache .cache && git status --short   # second run must change nothing
grep -rl 'doc://' .opencode/skills/apple-design/references/hig                          # must print nothing
```

Also confirm that every guideline file named in `SKILL.md` exists in `references/hig/`. Ignore
the `file.md` placeholder in the report template and `hig-lookup.md`, which lives one level up.

After running it: review `git diff --stat`, spot-check a changed file, refresh `liquid-glass.md`
if `materials.md` or `color.md` changed, and update the counts in this README if the file count
changed.

### Conventions

- Keep `SKILL.md` under about 400 lines. It loads in full every time the skill triggers.
- Apple's text in `references/hig/` is quoted, not paraphrased. Cross-platform translation lives
  in `SKILL.md` and `liquid-glass.md`, not in the pulled files.
- Don't add pages to `references/hig/` by hand. Change `OMITTED_PAGES` or the platform rule in
  the script instead.
- A hand-written file in `references/hig/` must be registered in `CURATED_FILES` and must not
  start with the generated header (a `> Source: <...>` line followed by `> Section:`). Open it
  with `> Curated guide` as `liquid-glass.md` does, so prune can never mistake it for output.
- Commit generated changes separately from hand-written changes.
- Do not commit `.cache/`, `.omc/`, or other local state.

## Origin and license

The guideline text belongs to Apple Inc. and is reproduced from the public
[Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
for AI-assisted design review, with a source link at the top of every file. This project is not
affiliated with or endorsed by Apple. The skill, the curated guide, and the script are provided
as they are; use them at your own discretion.