import { useEffect, useRef } from 'react'
import { questions } from '../data/questions'
import { SKILLS, SKILL_LABELS } from '../types'
import type { Answer } from '../types'
import { Icon } from './Icon'
import { PassageCard } from './PassageCard'

interface QuizProps {
  index: number
  answers: Answer[]
  onAnswer: (answer: Answer) => void
  onNext: () => void
  onSkip: () => void
  onBack: () => void
}

export function Quiz({ index, answers, onAnswer, onNext, onSkip, onBack }: QuizProps) {
  const question = questions[index]
  const selected = answers.find((answer) => answer.questionId === question.id)
  const hasChoice = selected?.choice !== undefined && selected.choice !== null
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [index])

  function choose(choice: number) {
    onAnswer({ questionId: question.id, choice, confidence: selected?.confidence ?? 'sure' })
  }

  return (
    <main id="main-content" className="quiz-main">
      <aside className="quiz-sidebar" aria-label="Check sections">
        <p className="eyebrow">YOUR READINESS CHECK</p>
        <h2>One step closer.</h2>
        <p>Go with what you know.<br />It’s okay to be unsure.</p>
        <ol className="skill-steps">{SKILLS.map((skill, skillIndex) => {
          const active = question.skill === skill
          const done = index >= (skillIndex + 1) * 5
          return <li key={skill} className={`${active ? 'active' : ''} ${done ? 'done' : ''}`} aria-current={active ? 'step' : undefined}><span className="skill-step-icon">{done ? <Icon name="check" /> : `0${skillIndex + 1}`}</span><div><strong>{SKILL_LABELS[skill]}</strong><span>5 questions</span></div>{active && <span className="status-dot" />}</li>
        })}</ol>
        <div className="sidebar-note"><Icon name="shield" /><p>No pressure. Honest answers make your result more useful.</p></div>
      </aside>

      <section className="question-area" aria-label="Current question">
        <div className="quiz-progress-top"><span>Question <strong>{index + 1}</strong> of {questions.length}</span><span className="skill-chip">{SKILL_LABELS[question.skill]}</span></div>
        <progress className="quiz-progress" value={index + 1} max={questions.length} aria-label={`Question ${index + 1} of ${questions.length}`} />
        <form key={question.id} className="question-card" onSubmit={(event) => { event.preventDefault(); if (hasChoice) onNext() }}>
          {question.passageId && <PassageCard id={question.passageId} />}
          <fieldset className="question-fieldset">
            <legend className="sr-only">{question.instruction} {question.prompt}</legend>
            <p className="question-instruction">{question.instruction}</p>
            <h1 ref={heading} tabIndex={-1} className="question-title" lang="de">{question.prompt}</h1>
            <div className="answer-options">{question.options.map((option, optionIndex) => <label className={`answer-option ${selected?.choice === optionIndex ? 'selected' : ''}`} key={optionIndex}>
              <input type="radio" name={question.id} value={optionIndex} checked={selected?.choice === optionIndex} onChange={() => choose(optionIndex)} />
              <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span><span lang="de">{option}</span><span className="option-check" aria-hidden="true">{selected?.choice === optionIndex && <Icon name="check" />}</span>
            </label>)}</div>
          </fieldset>
          <div className="confidence-row"><label className={`confidence-toggle ${!hasChoice ? 'disabled' : ''}`}><input type="checkbox" checked={selected?.confidence === 'guessed'} disabled={!hasChoice} onChange={(event) => { if (selected) onAnswer({ ...selected, confidence: event.target.checked ? 'guessed' : 'sure' }) }} /><span className="toggle-track" aria-hidden="true"><span /></span><span>I guessed this one</span></label><span className="confidence-hint">Honesty helps.</span></div>
          <div className="question-actions"><button type="button" className="button button-quiet" onClick={onBack} disabled={index === 0}><Icon name="back" /> Back</button><button type="submit" className="button button-primary" disabled={!hasChoice}>{index === questions.length - 1 ? 'See my results' : 'Next question'}<Icon name="arrow" /></button></div>
          <button type="button" className="skip-button" onClick={onSkip}>Skip — I don’t know</button>
        </form>
        <p className="question-footnote"><Icon name="clock" /> About 5 minutes in total. Take the time you need.</p>
      </section>
    </main>
  )
}
