import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { questions } from '../data/questions'
import { scoreAttempt } from './scoring'
import { STORAGE_KEY, readLastAttempt, saveAttempt, toSummary } from './storage'

describe('device-only attempt storage', () => {
  let values: Map<string, string>
  beforeEach(() => {
    values = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    })
  })
  afterEach(() => { vi.unstubAllGlobals() })
  it('returns null for a new device', () => { expect(readLastAttempt()).toBeNull() })
  it('round-trips a summary and replaces the previous attempt', () => {
    const summary = toSummary(scoreAttempt(questions, []))
    expect(saveAttempt(summary)).toBe(true)
    expect(readLastAttempt()).toEqual(summary)
    const next = { ...summary, overall: 80, band: 'almost' as const }
    saveAttempt(next)
    expect(readLastAttempt()).toEqual(next)
  })
  it.each(['broken', 'null', '[]', '{"version":9}', '{"version":1,"overall":101}', '{"version":1,"overall":50,"band":"ready","skills":null}'])('rejects corrupted or incompatible data: %s', (raw) => {
    values.set(STORAGE_KEY, raw)
    expect(readLastAttempt()).toBeNull()
  })
  it('rejects malformed dates, bands and skill values', () => {
    const summary = toSummary(scoreAttempt(questions, []))
    for (const override of [{ completedAt: 'bad' }, { band: 'invalid' }, { skills: { ...summary.skills, reading: -1 } }]) {
      values.set(STORAGE_KEY, JSON.stringify({ ...summary, ...override }))
      expect(readLastAttempt()).toBeNull()
    }
  })
  it('works when storage is blocked or full', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('quota') },
    })
    expect(readLastAttempt()).toBeNull()
    expect(saveAttempt(toSummary(scoreAttempt(questions, [])))).toBe(false)
  })
  it('stores no individual answers or personal data', () => {
    expect(Object.keys(toSummary(scoreAttempt(questions, []))).sort()).toEqual(['band', 'completedAt', 'overall', 'skills', 'version'])
  })
})
