import { useEffect, useRef, useState } from 'react'
import { questions } from '../data/questions'
import { officialLinks } from '../data/topics'
import { PASS_LINE, READY_LINE, creditForAnswer } from '../lib/scoring'
import { SKILLS, SKILL_LABELS } from '../types'
import type { Answer, AttemptSummary, Band, Result } from '../types'
import { Icon } from './Icon'
import { PassageCard } from './PassageCard'
import { ScoringNote } from './ScoringNote'

const verdicts: Record<Band, { title: string; eyebrow: string; advice: string }> = {
  ready: { title: 'Ready to book', eyebrow: 'YOUR NEXT CHAPTER IS GETTING CLOSER', advice: 'Your foundations look strong. Do one full official mock test before you book.' },
  almost: { title: 'Almost there', eyebrow: 'A LITTLE PRACTICE. A BIG DIFFERENCE.', advice: 'Focus on the topics below for about 2–3 weeks, then take the check again.' },
  'not-yet': { title: 'Not yet', eyebrow: 'YOU HAVE A STARTING POINT. NOW, A PLAN.', advice: 'Give yourself about 4–6 weeks of focused practice before booking. Start with the topics below.' },
}

interface ResultsProps {
  result: Result
  answers: Answer[]
  previous: AttemptSummary | null
  saved: boolean
  onRetake: () => void
}

export function Results({ result, answers, previous, saved, onRetake }: ResultsProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  const [shareStatus, setShareStatus] = useState('')
  const [manualShare, setManualShare] = useState('')
  const [sharing, setSharing] = useState(false)
  const verdict = verdicts[result.band]
  const score = Math.round(result.overall)
  const skillGate = result.overall >= READY_LINE && result.skills[result.weakestSkill] < PASS_LINE
  const weakestLabel = SKILL_LABELS[result.weakestSkill].toLowerCase()
  const allEqual = SKILLS.every((skill) => result.skills[skill] === result.skills[SKILLS[0]])
  const difference = previous ? score - Math.round(previous.overall) : 0

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  async function shareResult() {
    const text = `My A1 German readiness check: ${score}% — ${verdict.title}. Vocabulary ${Math.round(result.skills.vocabulary)}%, grammar ${Math.round(result.skills.grammar)}%, reading ${Math.round(result.skills.reading)}%. This is a short diagnostic, not a full mock exam.`
    const url = new URL('.', window.location.href).href
    setSharing(true)
    setShareStatus('')
    setManualShare('')
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Am I Exam-Ready?', text, url })
        setShareStatus('Result shared.')
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setShareStatus('Result copied. Paste it wherever you like.')
        return
      }
      setManualShare(`${text}\n${url}`)
      setShareStatus('Copy the text below to share your result.')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setManualShare(`${text}\n${url}`)
      setShareStatus('Sharing isn’t available here. Copy the text below instead.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <main id="main-content" className="results-main">
      <div className="results-topline"><span className="eyebrow"><span className="status-dot" /> CHECK COMPLETE · YOUR NEXT STEP</span><span className="outline-tag">A1 · German</span></div>
      <section className={`verdict-card verdict--${result.band}`} aria-labelledby="result-title">
        <div className="verdict-copy"><p className="eyebrow">{verdict.eyebrow}</p><h1 id="result-title" ref={heading} tabIndex={-1}>{verdict.title}<span className="serif">{result.band === 'ready' ? '.' : result.band === 'almost' ? ' . . .' : ', and that’s okay.'}</span></h1><p className="verdict-advice">{verdict.advice}</p>{result.band !== 'ready' && <p className="timeline-note">Time estimate only. Your pace may vary.</p>}</div>
        <div className="score-circle" style={{ '--score': `${result.overall}%` } as React.CSSProperties}><div><span className="score-number">{score}<span>%</span></span><span className="score-label">readiness score</span></div></div>
        <div className="verdict-stats"><span><strong>{result.correct}/{result.total}</strong> answers correct</span><span><strong>{result.guessedCorrect}</strong> correct {result.guessedCorrect === 1 ? 'guess' : 'guesses'}</span><span><strong>{result.skipped}</strong> skipped</span></div>
      </section>

      <section className="skills-section" aria-labelledby="skills-title">
        <div className="section-heading"><div><p className="eyebrow">THE PICTURE, SKILL BY SKILL</p><h2 id="skills-title">Where you stand</h2></div><div className="bar-key"><span><i className="benchmark-key" /> 60% benchmark</span><span><i className="target-key" /> 80% readiness target</span></div></div>
        <div className="skill-cards">{SKILLS.map((skill, index) => <article key={skill} className="skill-card"><div className="skill-card-top"><span className="skill-card-number">0{index + 1}</span><span className="skill-score">{Math.round(result.skills[skill])}<small>%</small></span></div><h3>{SKILL_LABELS[skill]}</h3><div className="skill-meter" role="meter" aria-label={`${SKILL_LABELS[skill]} confidence-weighted score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.skills[skill]}><span className="skill-meter-fill" style={{ width: `${result.skills[skill]}%` }} /><i className="benchmark-marker" /><i className="target-marker" /></div><p>{result.skills[skill] >= READY_LINE ? 'A strong foundation' : result.skills[skill] >= PASS_LINE ? 'Building confidence' : 'A little more practice here'}</p></article>)}</div>
        {skillGate ? <p className="skill-insight"><Icon name="info" /> Your {weakestLabel} is below the 60% skill floor. That keeps your result at “Almost there”, even with a strong overall score.</p> : !allEqual && result.band !== 'ready' && <p className="skill-insight"><Icon name="info" /> {SKILL_LABELS[result.weakestSkill]} is your lowest-scoring skill. Start there for focused practice.</p>}
      </section>

      <section className="practice-section" aria-labelledby="practice-title"><div className="section-heading"><div><p className="eyebrow">SMALL HABITS. REAL PROGRESS.</p><h2 id="practice-title">Practise these before booking</h2></div><span className="muted">Your next {result.recommendations.length} priorities</span></div><div className={`practice-grid practice-grid--${result.recommendations.length}`}>{result.recommendations.map((topic, index) => <article className="practice-card" key={topic.id}><div className="practice-card-top"><span className="priority-number">0{index + 1}</span><span className="practice-duration">{topic.minutes}</span></div><h3>{topic.name}</h3><p className="practice-why">{topic.why}</p><div className="daily-action"><span className="eyebrow">{topic.lostCredit > 0 ? 'YOUR DAILY ACTION' : 'CHECK THE UNTESTED SKILLS'}</span><p>{topic.action}</p></div>{topic.lostCredit === 0 && <a className="text-link" href={officialLinks.goethePractice} target="_blank" rel="noreferrer">Official practice materials <Icon name="external" /></a>}</article>)}</div></section>

      <div className="result-notes"><aside className="honesty-note"><Icon name="shield" /><div><strong>Honest answers, a more useful result.</strong><p>{result.guessedCorrect > 0 ? `${result.guessedCorrect} correct ${result.guessedCorrect === 1 ? 'answer was a guess' : 'answers were guesses'}, so we counted ${result.guessedCorrect === 1 ? 'it' : 'them'} as half credit. Your skill bars include this adjustment.` : 'You had no correct answers marked as guesses. Correct guesses would count as half credit.'}</p></div></aside><aside className="coverage-banner"><Icon name="info" /><div><strong>There’s more to the real exam.</strong><p>Listening, writing and speaking are not tested here. This result is a starting point, not a guarantee. Complete a full official mock test before booking.</p></div></aside></div>

      <section className="review-section" aria-labelledby="review-title"><details className="answer-review"><summary><span><span className="eyebrow">LEARN FROM EVERY ANSWER</span><span id="review-title" className="review-title">Review my answers</span></span><span className="review-count">{questions.length} questions <span aria-hidden="true">+</span></span></summary><div className="review-list">{questions.map((question, index) => {
        const answer = answers.find((item) => item.questionId === question.id)
        const credit = creditForAnswer(question, answer)
        const skipped = !answer || answer.choice === null
        const label = skipped ? 'Skipped · 0 points' : credit === 1 ? 'Correct · 1 point' : credit > 0 ? 'Correct guess · ½ point' : 'Incorrect · 0 points'
        return <article className="review-item" key={question.id}><div className="review-item-top"><span className="eyebrow">{index + 1}. {SKILL_LABELS[question.skill]}</span><span className={`review-status ${credit === 1 ? 'correct' : credit > 0 ? 'guessed' : 'incorrect'}`}>{label}</span></div><h3 lang="de">{question.prompt}</h3>{question.passageId && <details className="review-passage"><summary>Show reading text</summary><PassageCard id={question.passageId} /></details>}<p className="review-choice">Your answer: <span lang={skipped ? 'en' : 'de'}>{skipped ? 'I don’t know' : question.options[answer.choice!]}</span>{!skipped && answer.confidence === 'guessed' && ' (guessed)'}</p><p className="review-correct">Correct answer: <strong lang="de">{question.options[question.answer]}</strong></p><p className="review-explanation">{question.explanation}</p></article>
      })}</div></details></section>

      <ScoringNote />
      <div className="attempt-comparison"><Icon name="refresh" /><div>{previous ? <><strong>Last time: {Math.round(previous.overall)}%. Now: {score}%.</strong><p>{difference > 0 ? `That’s ${difference} percentage points of progress. Keep going.` : difference < 0 ? 'Scores can vary. Use your practice plan to guide your next step.' : 'A consistent score. Try a full mock test to see the bigger picture.'}</p></> : <><strong>Your first check. Your starting point.</strong><p>Retake after practising to compare your progress.</p></>}<span className="storage-note">{saved ? 'Only your latest score is saved on this device. No account or server.' : 'Device storage is unavailable. This result works, but won’t be saved.'} The same questions repeat, so a higher retake score may reflect memory.</span></div></div>
      <div className="results-actions"><button className="button button-primary" onClick={onRetake}><Icon name="refresh" /> Retake the check</button><button className="button button-secondary" onClick={() => { void shareResult() }} disabled={sharing}><Icon name="share" /> {sharing ? 'Sharing…' : 'Share my result'}</button></div>
      <p className="share-status" role="status">{shareStatus}</p>{manualShare && <label className="manual-share">Your shareable result<textarea readOnly value={manualShare} rows={5} onFocus={(event) => event.currentTarget.select()} /></label>}
    </main>
  )
}
