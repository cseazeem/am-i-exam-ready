# One video, 5–7 minutes

Record a personal introduction and live walkthrough. Replace the bracketed prompts with your own facts; do not read them as claims. This file is a script, not a recorded video.

| Time | What to show and say |
| --- | --- |
| 0:00–1:15 | Introduce yourself: [name], [background], one concrete example of work you have owned, and why working with founders and Globio’s learners interests you. |
| 1:15–1:50 | Explain the user problem: finishing a course does not prove exam readiness. A premature booking can cost a learner money and delay their plans. The app offers a short foundation check and a practical next step. |
| 1:50–3:10 | Open the app at a phone-sized width. Start, choose an answer, mark one correct answer as a guess, skip another, and go Back to show preserved answers. Finish the check. Show the verdict, three skill bars, practice actions and expanded answer review. |
| 3:10–4:25 | Explain sure correct = 1, correct guess = 0.5, wrong/skip = 0. Skill scores are equally weighted. Ready requires 80% overall AND 60% per skill. 100/100/40 gives 80 overall but Almost there. The 60% benchmark is inspired by Goethe; ÖSD has different official module rules. Listening, writing and speaking are untested. |
| 4:25–5:40 | Show `src/data/questions.ts`, including a passage and explanation; then `src/lib/scoring.ts`, its named thresholds and ranking. Run `npm test`, and show the reading-floor test. Show how `Results.tsx` renders recommendations. |
| 5:40–6:30 | Explain validation: pair diagnostic and actual exam results with consent, prioritise Ready-but-failed errors, use held-out learners, and ask five real learners about trust, confusing questions and feasible practice. No data collection is shipped in v1. |
| 6:30–7:00 | Close with limits and next steps: teacher review, a larger item bank and assessment of the untested skills once learner evidence supports it. |

## Predictable demo route

For a **Ready** result at 83%: answer Q1–Q8 correctly and surely; answer Q9 correctly but mark guessed; skip Q10; answer Q11–Q14 correctly and surely; skip Q15. The resulting skill scores are 100%, 70%, 80%.

For **Almost there** with the skill gate: get Q1–Q12 correct and sure, then skip Q13–Q15. Overall is 80%, reading is 40%.

For **Not yet**: skip all questions or mark all correct answers as guesses (50%).

Before sharing the recording, confirm that the video and live link open without login in a private browser window. Reply in the original email thread. The user must record their own introduction and voice; no video has been recorded by this implementation.
