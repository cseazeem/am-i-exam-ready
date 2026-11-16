import { coverageTopics, topics } from '../data/topics'
import { SKILLS } from '../types'
import type { Answer, Band, Question, Recommendation, Result, Skill, TopicId } from '../types'

export const PASS_LINE = 60
export const READY_LINE = 80
export const ALMOST_SKILL_FLOOR = 40
export const GUESS_CREDIT = 0.5

export function creditForAnswer(question: Question, answer?: Answer): number {
  if (!answer || answer.choice === null || answer.choice !== question.answer) return 0
  return answer.confidence === 'guessed' ? GUESS_CREDIT : 1
}

export function getBand(overall: number, skills: Record<Skill, number>): Band {
  const lowest = Math.min(...SKILLS.map((skill) => skills[skill]))
  if (overall >= READY_LINE && lowest >= PASS_LINE) return 'ready'
  if (overall >= PASS_LINE && lowest >= ALMOST_SKILL_FLOOR) return 'almost'
  return 'not-yet'
}

export function scoreAttempt(questions: readonly Question[], answers: readonly Answer[]): Result {
  const byQuestion = new Map(answers.map((answer) => [answer.questionId, answer]))
  const counts: Record<Skill, number> = { vocabulary: 0, grammar: 0, reading: 0 }
  const credits: Record<Skill, number> = { vocabulary: 0, grammar: 0, reading: 0 }
  const lostByTopic = new Map<TopicId, number>()
  let guessedCorrect = 0
  let correct = 0
  let skipped = 0

  for (const question of questions) {
    const answer = byQuestion.get(question.id)
    const credit = creditForAnswer(question, answer)
    counts[question.skill] += 1
    credits[question.skill] += credit
    lostByTopic.set(question.topic, (lostByTopic.get(question.topic) ?? 0) + 1 - credit)
    if (credit > 0) correct += 1
    if (credit > 0 && answer?.confidence === 'guessed') guessedCorrect += 1
    if (!answer || answer.choice === null) skipped += 1
  }

  const skills = Object.fromEntries(SKILLS.map((skill) => [
    skill, counts[skill] ? (credits[skill] / counts[skill]) * 100 : 0,
  ])) as Record<Skill, number>
  const overall = SKILLS.reduce((sum, skill) => sum + skills[skill], 0) / SKILLS.length
  const weakestSkill = SKILLS.reduce((weakest, skill) => skills[skill] < skills[weakest] ? skill : weakest)
  const recommendations: Recommendation[] = [...lostByTopic]
    .filter(([, lost]) => lost >= 0.5)
    .map(([id, lostCredit]) => ({ ...topics[id], lostCredit }))
    .sort((a, b) => b.lostCredit - a.lostCredit || a.rank - b.rank)
    .slice(0, 3)

  for (const topic of coverageTopics) {
    if (recommendations.length >= 2) break
    recommendations.push({ ...topic, lostCredit: 0 })
  }

  return {
    overall, skills, band: getBand(overall, skills), weakestSkill,
    recommendations, guessedCorrect, correct, skipped, total: questions.length,
  }
}
