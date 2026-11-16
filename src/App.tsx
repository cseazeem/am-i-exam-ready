import { useState } from 'react'
import { Intro } from './components/Intro'
import { Quiz } from './components/Quiz'
import { Results } from './components/Results'
import { Icon } from './components/Icon'
import { questions } from './data/questions'
import { officialLinks } from './data/topics'
import { scoreAttempt } from './lib/scoring'
import { readLastAttempt, saveAttempt, toSummary } from './lib/storage'
import type { Answer, AttemptSummary, Result } from './types'

interface CompletedAttempt {
  result: Result
  previous: AttemptSummary | null
  saved: boolean
}

export default function App() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'results'>('intro')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [index, setIndex] = useState(0)
  const [lastAttempt, setLastAttempt] = useState(readLastAttempt)
  const [completed, setCompleted] = useState<CompletedAttempt | null>(null)

  function startCheck() {
    setAnswers([])
    setIndex(0)
    setCompleted(null)
    setScreen('quiz')
  }

  function recordAnswer(answer: Answer) {
    setAnswers((current) => [...current.filter((item) => item.questionId !== answer.questionId), answer])
  }

  function advance(skip?: Answer) {
    const nextAnswers = skip ? [...answers.filter((item) => item.questionId !== skip.questionId), skip] : answers
    if (skip) setAnswers(nextAnswers)
    if (index < questions.length - 1) {
      setIndex(index + 1)
      return
    }
    const result = scoreAttempt(questions, nextAnswers)
    const summary = toSummary(result)
    const saved = saveAttempt(summary)
    setCompleted({ result, previous: lastAttempt, saved })
    setLastAttempt(summary)
    setScreen('results')
  }

  return <>
    <a className="skip-to-content" href="#main-content">Skip to content</a>
    <header className="site-header"><div className="header-inner"><a className="brand" href="./" aria-label="ExamReady home"><span className="brand-symbol"><Icon name="check" /></span><span>exam<span className="brand-light">ready</span><span className="brand-period">.</span></span></a><span className="header-divider" /><span className="header-product">A1 GERMAN CHECK</span><nav className="header-nav" aria-label="Main navigation">{screen === 'intro' ? <a href="#how-it-works">How it works</a> : <span className="header-journey">A little closer to your next chapter.</span>}<a href={officialLinks.goethePractice} target="_blank" rel="noreferrer">Official practice <Icon name="external" /></a></nav></div></header>
    {screen === 'intro' && <Intro onStart={startCheck} lastAttempt={lastAttempt} />}
    {screen === 'quiz' && <Quiz index={index} answers={answers} onAnswer={recordAnswer} onNext={() => advance()} onSkip={() => advance({ questionId: questions[index].id, choice: null, confidence: 'sure' })} onBack={() => setIndex(Math.max(0, index - 1))} />}
    {screen === 'results' && completed && <Results result={completed.result} previous={completed.previous} saved={completed.saved} answers={answers} onRetake={startCheck} />}
    <footer className="site-footer"><div><span className="footer-brand">A clearer path forward<span>.</span></span><p>An independent A1 diagnostic. Not affiliated with Goethe-Institut, ÖSD or Globio.</p></div><p>Made with your next chapter in mind.<br /><span>Answers stay in this tab. Only the latest score stays on this device.</span></p></footer>
  </>
}
