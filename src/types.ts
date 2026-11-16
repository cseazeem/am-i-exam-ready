export const SKILLS = ['vocabulary', 'grammar', 'reading'] as const
export type Skill = (typeof SKILLS)[number]

export const SKILL_LABELS: Record<Skill, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
}

export type TopicId =
  | 'numbers'
  | 'verbs'
  | 'articles'
  | 'word-order'
  | 'messages'
  | 'notices'
  | 'ads'
  | 'everyday'
  | 'phrases'

export interface Topic {
  id: TopicId | 'listening-speaking' | 'writing-mock'
  name: string
  rank: number
  why: string
  action: string
  minutes: string
}

export interface Question {
  id: string
  skill: Skill
  topic: TopicId
  passageId?: string
  instruction: string
  prompt: string
  options: readonly string[]
  answer: number
  explanation: string
}

export interface Passage {
  kind: 'email' | 'notice' | 'ads'
  label: string
  title: string
  text?: string
  sender?: string
  ads?: { label: string; title: string; text: string }[]
}

export interface Answer {
  questionId: string
  choice: number | null
  confidence: 'sure' | 'guessed'
}

export type Band = 'ready' | 'almost' | 'not-yet'

export interface Recommendation extends Topic {
  lostCredit: number
}

export interface Result {
  overall: number
  skills: Record<Skill, number>
  band: Band
  weakestSkill: Skill
  recommendations: Recommendation[]
  guessedCorrect: number
  correct: number
  skipped: number
  total: number
}

export interface AttemptSummary {
  version: 1
  completedAt: string
  overall: number
  band: Band
  skills: Record<Skill, number>
}
