import { describe, expect, it } from 'vitest'
import { passages, questions } from '../data/questions'
import { topics } from '../data/topics'
import { SKILLS } from '../types'
import type { Answer, Skill } from '../types'
import { creditForAnswer, getBand, scoreAttempt } from './scoring'

function correctAnswers(confidence: Answer['confidence'] = 'sure'): Answer[] {
  return questions.map((question) => ({ questionId: question.id, choice: question.answer, confidence }))
}

describe('question bank integrity', () => {
  it('has 15 unique questions, with five per skill', () => {
    expect(questions).toHaveLength(15)
    expect(new Set(questions.map((q) => q.id)).size).toBe(15)
    for (const skill of SKILLS) expect(questions.filter((q) => q.skill === skill)).toHaveLength(5)
  })
  it('has valid answers, topics, explanations and reading passages', () => {
    for (const q of questions) {
      expect(Number.isInteger(q.answer)).toBe(true)
      expect(q.options[q.answer]).toBeTruthy()
      expect(new Set(q.options).size).toBe(q.options.length)
      expect(topics[q.topic]).toBeDefined()
      expect(q.explanation.length).toBeGreaterThan(25)
      if (q.skill === 'reading') expect(passages[q.passageId!]).toBeDefined()
    }
  })
})

describe('per-question credit', () => {
  const q = questions[0]
  it('gives full credit for a sure correct answer', () => {
    expect(creditForAnswer(q, { questionId: q.id, choice: q.answer, confidence: 'sure' })).toBe(1)
  })
  it('gives half credit for a correct guess', () => {
    expect(creditForAnswer(q, { questionId: q.id, choice: q.answer, confidence: 'guessed' })).toBe(0.5)
  })
  it.each(['sure', 'guessed'] as const)('gives zero for a wrong %s answer', (confidence) => {
    expect(creditForAnswer(q, { questionId: q.id, choice: (q.answer + 1) % q.options.length, confidence })).toBe(0)
  })
  it('gives zero for skipped, absent and invalid choices', () => {
    expect(creditForAnswer(q)).toBe(0)
    for (const choice of [null, -1, 99, NaN]) {
      expect(creditForAnswer(q, { questionId: q.id, choice, confidence: 'sure' })).toBe(0)
    }
  })
})

describe('readiness bands and boundaries', () => {
  const scores = (vocabulary: number, grammar: number, reading: number): Record<Skill, number> => ({ vocabulary, grammar, reading })
  it.each([
    [80, scores(80, 80, 80), 'ready'],
    [80, scores(100, 80, 60), 'ready'],
    [79.99, scores(80, 80, 79.97), 'almost'],
    [80, scores(100, 100, 40), 'almost'],
    [85, scores(100, 100, 40), 'almost'],
    [60, scores(100, 40, 40), 'almost'],
    [60, scores(100, 50, 30), 'not-yet'],
    [59.99, scores(60, 60, 59.97), 'not-yet'],
    [0, scores(0, 0, 0), 'not-yet'],
  ] as const)('classifies %s overall with skill floors', (overall, skills, band) => {
    expect(getBand(overall, skills)).toBe(band)
  })
  it('scores all sure and correct as 100 and ready', () => {
    const result = scoreAttempt(questions, correctAnswers())
    expect(result.overall).toBe(100)
    expect(result.band).toBe('ready')
    expect(result.skills).toEqual(scores(100, 100, 100))
    expect(result.correct).toBe(15)
    expect(result.guessedCorrect).toBe(0)
  })
  it('scores all correct guesses as 50 and not yet', () => {
    const result = scoreAttempt(questions, correctAnswers('guessed'))
    expect(result.overall).toBe(50)
    expect(result.band).toBe('not-yet')
    expect(result.guessedCorrect).toBe(15)
  })
  it('implements the plan example: 100, 70, 80 gives 83.33 and ready', () => {
    const answers = correctAnswers()
    answers[8].confidence = 'guessed'
    answers[9].choice = null
    answers[14].choice = null
    const result = scoreAttempt(questions, answers)
    expect(result.skills).toEqual(scores(100, 70, 80))
    expect(result.overall).toBeCloseTo(83.33333)
    expect(result.band).toBe('ready')
    expect(result.guessedCorrect).toBe(1)
    expect(result.skipped).toBe(2)
  })
  it('blocks ready at 80 overall when reading is 40', () => {
    const answers = correctAnswers().map((answer, i) => i >= 12 ? { ...answer, choice: null } : answer)
    const result = scoreAttempt(questions, answers)
    expect(result.overall).toBe(80)
    expect(result.skills.reading).toBe(40)
    expect(result.weakestSkill).toBe('reading')
    expect(result.band).toBe('almost')
  })
  it('scores all skips and missing answers as zero without crashing', () => {
    for (const answers of [[], correctAnswers().map((answer) => ({ ...answer, choice: null }))]) {
      const result = scoreAttempt(questions, answers)
      expect(result.overall).toBe(0)
      expect(result.skipped).toBe(15)
      expect(result.band).toBe('not-yet')
    }
  })
  it('handles an empty bank and missing skills without NaN', () => {
    expect(scoreAttempt([], []).overall).toBe(0)
    expect(scoreAttempt([questions[0]], [correctAnswers()[0]]).skills.grammar).toBe(0)
  })
  it('uses the last answer once when a learner changes their choice', () => {
    const answers = correctAnswers()
    answers.push({ ...answers[0], choice: null })
    const result = scoreAttempt(questions, answers)
    expect(result.skills.vocabulary).toBe(80)
    expect(result.skipped).toBe(1)
    expect(result.correct).toBe(14)
  })
  it('ignores answers to unknown questions and does not mutate inputs', () => {
    const answers = correctAnswers()
    const before = JSON.stringify(answers)
    expect(scoreAttempt(questions, [...answers, { questionId: 'unknown', choice: 0, confidence: 'sure' }]).overall).toBe(100)
    scoreAttempt(questions, answers)
    expect(JSON.stringify(answers)).toBe(before)
  })
})

describe('practice recommendations', () => {
  it('has two distinct coverage actions on a perfect score', () => {
    const result = scoreAttempt(questions, correctAnswers())
    expect(result.recommendations.map((topic) => topic.id)).toEqual(['listening-speaking', 'writing-mock'])
    expect(result.recommendations.every((topic) => topic.lostCredit === 0)).toBe(true)
  })
  it('adds a coverage action when only one topic lost credit', () => {
    const answers = correctAnswers()
    answers[9].confidence = 'guessed'
    expect(scoreAttempt(questions, answers).recommendations.map((topic) => topic.id)).toEqual(['word-order', 'listening-speaking'])
  })
  it('sorts by total lost credit, then impact rank, and returns at most three', () => {
    const result = scoreAttempt(questions, [])
    expect(result.recommendations.map((topic) => topic.id)).toEqual(['numbers', 'verbs', 'articles'])
    expect(result.recommendations.map((topic) => topic.lostCredit)).toEqual([2, 2, 2])
  })
  it('prioritises two correct guesses over one when both are knowledge gaps', () => {
    const answers = correctAnswers()
    answers[0].confidence = 'guessed'
    answers[5].confidence = 'guessed'
    answers[6].confidence = 'guessed'
    expect(scoreAttempt(questions, answers).recommendations.map((topic) => topic.id)).toEqual(['verbs', 'numbers'])
  })
  it('always returns two or three useful, unique recommendations', () => {
    for (let skipCount = 0; skipCount <= questions.length; skipCount++) {
      const result = scoreAttempt(questions, correctAnswers().slice(skipCount))
      expect(result.recommendations.length).toBeGreaterThanOrEqual(2)
      expect(result.recommendations.length).toBeLessThanOrEqual(3)
      expect(new Set(result.recommendations.map((topic) => topic.id)).size).toBe(result.recommendations.length)
    }
  })
})
