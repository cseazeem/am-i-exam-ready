import { SKILLS } from '../types'
import type { AttemptSummary, Result } from '../types'

export const STORAGE_KEY = 'exam-ready:last-attempt:v1'

function isScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
}

export function readLastAttempt(): AttemptSummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<AttemptSummary> | null
    if (!value || value.version !== 1 || !isScore(value.overall)) return null
    if (!['ready', 'almost', 'not-yet'].includes(value.band ?? '')) return null
    if (!value.skills || !SKILLS.every((skill) => isScore(value.skills?.[skill]))) return null
    if (typeof value.completedAt !== 'string' || !Number.isFinite(Date.parse(value.completedAt))) return null
    return value as AttemptSummary
  } catch {
    return null
  }
}

export function toSummary(result: Result): AttemptSummary {
  return {
    version: 1, completedAt: new Date().toISOString(),
    overall: result.overall, band: result.band, skills: { ...result.skills },
  }
}

export function saveAttempt(summary: AttemptSummary): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summary))
    return true
  } catch {
    return false
  }
}
