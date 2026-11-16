# Am I Exam-Ready?

A five-minute, 15-question A1 German diagnostic for learners deciding what to practise before booking a Goethe or ÖSD exam. Built for the Globio Founder’s Office assignment.

App: https://am-i-exam-ready-globio.buffprawn8.chatgpt.site

Code: https://github.com/cseazeem/am-i-exam-ready

Verification: **40 unit tests and 14 desktop/mobile browser tests passed**, including axe accessibility checks on the introduction, quiz and results, light/dark modes, all three verdicts, storage failure and sharing fallback. `npm run build` also passed.

## Run locally

Use Node.js 24 (recommended), or Node.js 22.12+. Run `nvm use` if you use nvm. The starter’s Vitest 5 requires Node.js 22.12+ even though Vite also supports newer Node.js 20 releases.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For a production preview:

```sh
npm run build
npm run preview
```

## What works

- Fifteen German questions: five each in vocabulary, grammar and reading, with English instructions and complete German reading passages.
- One question at a time, native radio inputs, explicit Next, Back with preserved answers, honest skips, and a confidence toggle.
- Three readiness bands, confidence-weighted skill scores, and visible 60%/80% markers.
- Two or three specific practice actions, ranked by lost credit and topic impact.
- Complete answer review with correct answers, explanations and reading texts.
- Latest-attempt comparison stored only on the device, with graceful handling of blocked or corrupted storage.
- Retake and sharing via the Web Share API, clipboard, or selectable text when those are unavailable. The result is shared as text; no public result page or personal data is created.
- Responsive layout, system dark mode, reduced-motion support, focus management, labelled controls and keyboard navigation.

## Scoring decisions

Correct + sure = 1 point; correct + guessed = 0.5; incorrect or skipped = 0. Each skill score is earned credit / five × 100. The overall score is the unrounded average of the three skills. Percentages are rounded only for display.

| Band | Overall | Every skill |
| --- | --- | --- |
| Ready to book | ≥80% | ≥60% |
| Almost there | ≥60% | ≥40% |
| Not yet | Below either Almost there minimum | — |

A 100/100/40 profile averages 80%, but remains Almost there because of the reading floor. The plan’s “85% with reading 40%” example cannot occur with three equally weighted skills capped at 100%; the gate itself is implemented and tested.

Recommendations sum `1 − credit` per topic, keep losses ≥0.5, sort by lost credit descending, then topic rank ascending, and take at most three. If fewer than two qualify, untested-skill practice fills the space. A perfect attempt gets **Listening & speaking** and **Writing & a full mock test**; a single filler alone would not meet the plan’s two-item minimum.

### Official rules versus this diagnostic

The 60% marker is a diagnostic benchmark inspired by [Goethe A1’s overall pass rule](https://www.goethe.de/en/spr/prf/pes/pas1.html), not an official per-skill cutoff. Goethe requires at least 60/100 and completion of all sections. [ÖSD A1 has separate written, oral and subtest minimums](https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf); it does not share a universal 60% rule. Our 80% target, skill gates and estimated practice timelines are product assumptions that need learner validation. This app does not estimate a probability of passing.

Questions are original A1-style items, not copied official exam items. The word-order distractor was adjusted to avoid an arguably valid alternative in the plan. An independent German teacher review is still a pre-launch content task; it has not been claimed as completed.

## Tests

```sh
npm test
npm run build
```

Unit tests cover scoring credit, exact band boundaries, skill gates, question-bank integrity, skips, edited answers, ranking, coverage fillers and unavailable/corrupt storage.

For browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright covers desktop and mobile, complete quiz journeys, confidence, skip/back, all three bands, repeat attempts, sharing fallback and accessibility with axe. On macOS, the configuration automatically uses installed Google Chrome. Elsewhere, install Playwright Chromium once. `PLAYWRIGHT_CHROME=1 npm run test:e2e` explicitly selects installed Chrome on other platforms.

## Code map

```text
src/data/questions.ts       15 questions and German passages
src/data/topics.ts          ranked practice catalogue and official resources
src/lib/scoring.ts          pure readiness and recommendation functions
src/lib/storage.ts          validated, failure-tolerant device storage
src/components/Intro.tsx    introduction and expectations
src/components/Quiz.tsx     question, confidence and navigation controls
src/components/Results.tsx  verdict, skill scores, practice and review
src/App.tsx                 intro → quiz → results state
```

React 19, TypeScript, Vite, plain CSS, Vitest and Playwright. No backend, login, analytics or API keys. External Google Fonts are optional: system fallbacks keep the app usable if fonts fail to load.

## Deploy

`base: './'` allows hosting at a domain root or a subpath. The build output is `dist/`.

**GitHub Pages:** create a public repository, push this directory, select **Settings → Pages → Source → GitHub Actions**, then run the included Deploy to GitHub Pages workflow. It tests and builds before deploying. CI checks pull requests without publishing them.

```sh
git init -b main
git add .
git commit -m "Build A1 German readiness diagnostic"
gh repo create am-i-exam-ready --public --source=. --remote=origin --push
```

The GitHub Pages URL for this repository is `https://cseazeem.github.io/am-i-exam-ready/` once Pages is enabled and its deployment workflow succeeds. The app link above uses Sites hosting.

**Vercel / Netlify:** import the repository; use `npm run build` and output directory `dist`. No environment variables are required. Sites hosting can publish the same static output through `.openai/hosting.json`.

## Submission materials

- [Half-page written note](docs/written-note.md)
- [5–7 minute video script and demo route](docs/video-outline.md)
- [Email reply draft and remaining checklist](docs/submission.md)

Only a score summary (timestamp, overall, band and skills) is saved under `exam-ready:last-attempt:v1`. Answers exist in tab memory and reset on reload. Retakes reuse the same questions, so improved scores may reflect memorisation. Listening, writing and speaking are not assessed; the app always points to a full official mock test before booking.
