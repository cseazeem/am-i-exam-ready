import { officialLinks } from '../data/topics'
import type { AttemptSummary } from '../types'
import { Icon } from './Icon'

export function Intro({ onStart, lastAttempt }: { onStart: () => void; lastAttempt: AttemptSummary | null }) {
  return (
    <main id="main-content" className="intro-main">
      <section className="hero" aria-labelledby="intro-title">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="status-dot" /> A SMALL CHECK. A BIG NEXT STEP.</div>
          <h1 id="intro-title">Your A1 exam.<br />A little more<br /><span className="serif accent-word">confidence.</span></h1>
          <p className="hero-description">Finished your German course? Find out where you stand before you book your exam, and what to practise next.</p>
          <div className="hero-action"><button className="button button-primary button-large" onClick={onStart}>Start the check <Icon name="arrow" /></button><span>Free. No sign-up.<br />Just you and your next step.</span></div>
          <p className="hero-trust"><Icon name="shield" /> Built for A1 learners preparing for Goethe or ÖSD</p>
          {lastAttempt && <p className="last-attempt">Welcome back. Your last check: <strong>{Math.round(lastAttempt.overall)}%</strong>. Ready to see your progress?</p>}
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <span className="visual-spark spark-one">✳</span><span className="visual-spark spark-two">✧</span>
          <div className="sample-report" aria-label="Example result, not your score">
            <div className="sample-heading"><span className="eyebrow">YOUR READINESS SNAPSHOT</span><span className="sample-tag">Example</span></div>
            <div className="sample-score-row"><div className="sample-score">83<span>%</span></div><div className="sample-verdict"><span className="badge"><Icon name="check" /> Ready to book</span><p>A strong start.<br />Make your next move.</p></div></div>
            <div className="sample-bars">{[['Vocabulary', 100], ['Grammar', 70], ['Reading', 80]].map(([label, score]) => <div key={label}><div><span>{label}</span><strong>{score}%</strong></div><div className="sample-track"><span style={{ width: `${score}%` }} /></div></div>)}</div>
            <div className="sample-next"><span className="small-icon"><Icon name="spark" /></span><div><strong>A plan, not just a percentage.</strong><p>Know exactly what to practise next.</p></div></div>
          </div>
          <div className="journey-tag"><span className="german-flag" aria-hidden="true"><i /><i /><i /></span><div><strong lang="de">Du schaffst das.</strong><span>You’ve got this.</span></div><span className="journey-arrow" aria-hidden="true">↗</span></div>
        </div>
      </section>

      <section className="quick-facts" aria-label="About this check">
        <div><Icon name="clock" /><p><strong>About 5 minutes</strong><span>A small pause before a big decision</span></p></div>
        <div><Icon name="book" /><p><strong>15 real-world questions</strong><span>Vocabulary, grammar & reading</span></p></div>
        <div><Icon name="spark" /><p><strong>Your own practice plan</strong><span>2–3 clear things to work on next</span></p></div>
      </section>

      <section id="how-it-works" className="how-section" aria-labelledby="how-title">
        <div className="section-heading"><div><p className="eyebrow">LESS GUESSWORK. MORE DIRECTION.</p><h2 id="how-title">A clearer next step, in three.</h2></div><p>You’ve put in the work.<br />Let’s see where it’s taking you.</p></div>
        <div className="steps-grid">
          <article><span className="step-number">01</span><h3>Show what you know</h3><p>Answer 15 short questions, one at a time. Take your time—there’s no countdown.</p></article>
          <article><span className="step-number">02</span><h3>Be honest about guesses</h3><p>Mark “I guessed this one” when you’re unsure. Skip anything you don’t know.</p></article>
          <article><span className="step-number">03</span><h3>Leave with a plan</h3><p>See your skill breakdown and specific daily practice to help you move forward.</p></article>
        </div>
      </section>

      <aside className="coverage-banner"><Icon name="info" /><div><strong>A useful starting point, not a full mock exam.</strong><p>This check doesn’t test listening, writing or speaking. Before booking, try a full <a href={officialLinks.goethePractice} target="_blank" rel="noreferrer">official A1 practice test <Icon name="external" /></a>.</p></div><span className="outline-tag">A1 · German</span></aside>
    </main>
  )
}
