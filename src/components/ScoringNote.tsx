import { officialLinks } from '../data/topics'
import { ALMOST_SKILL_FLOOR, GUESS_CREDIT, PASS_LINE, READY_LINE } from '../lib/scoring'

export function ScoringNote() {
  return <details className="scoring-note"><summary>How is readiness calculated?</summary><div className="scoring-content">
    <p>A correct, sure answer earns 1 point. A correct guess earns {GUESS_CREDIT} points. A wrong or skipped answer earns 0. Each skill has 5 questions; the overall score is the average of the three skill scores.</p>
    <ul><li><strong>Ready to book:</strong> at least {READY_LINE}% overall and at least {PASS_LINE}% in every skill.</li><li><strong>Almost there:</strong> at least {PASS_LINE}% overall and at least {ALMOST_SKILL_FLOOR}% in every skill.</li><li><strong>Not yet:</strong> below either of those minimums.</li></ul>
    <p>The {PASS_LINE}% marker is our diagnostic benchmark, inspired by <a href={officialLinks.goetheRules} target="_blank" rel="noreferrer">Goethe A1’s overall pass rule</a>. It is not an official pass mark for individual skills. <a href={officialLinks.osdScoring} target="_blank" rel="noreferrer">ÖSD A1 uses separate module and subtest minimums</a>.</p>
    <p>Our {READY_LINE}% target adds a cautious margin for a small sample and untested skills. These bands are product assumptions, not a validated prediction of passing. Practice timelines are estimates, not promises. We use unrounded scores to decide your band.</p>
  </div></details>
}
