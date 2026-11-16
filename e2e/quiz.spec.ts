import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { questions } from '../src/data/questions'

async function start(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start the check' }).click()
}

async function finish(page: Page, mode: 'perfect' | 'guessed' | 'gate' | 'skip' = 'perfect') {
  for (const [index, question] of questions.entries()) {
    if (mode === 'skip' || (mode === 'gate' && index >= 12)) {
      await page.getByRole('button', { name: 'Skip — I don’t know' }).click()
    } else {
      await page.getByRole('radio').nth(question.answer).check()
      if (mode === 'guessed') await page.getByRole('checkbox', { name: 'I guessed this one' }).check()
      await page.getByRole('button', { name: index === 14 ? 'See my results' : 'Next question' }).click()
    }
  }
}

async function checkAccessibility(page: Page) {
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(report.violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('perfect attempt, two coverage actions, answer review and accessibility', async ({ page }) => {
  await page.goto('/')
  await checkAccessibility(page)
  await page.screenshot({ path: test.info().outputPath('intro.png'), fullPage: true })
  await page.getByRole('button', { name: 'Start the check' }).click()
  await expect(page.getByRole('button', { name: 'Next question' })).toBeDisabled()
  await expect(page.getByRole('checkbox')).toBeDisabled()
  await checkAccessibility(page)
  await page.screenshot({ path: test.info().outputPath('quiz.png'), fullPage: true })
  await finish(page)
  await expect(page.getByRole('heading', { name: 'Ready to book.' })).toBeVisible()
  await expect(page.locator('.score-number')).toHaveText('100%')
  await expect(page.locator('.practice-card')).toHaveCount(2)
  await expect(page.getByRole('heading', { name: 'Listening & speaking' })).toBeVisible()
  await page.screenshot({ path: test.info().outputPath('results.png'), fullPage: true })
  await page.locator('.answer-review > summary').click()
  await expect(page.locator('.review-item')).toHaveCount(15)
  await expect(page.locator('.review-status.correct')).toHaveCount(15)
  await checkAccessibility(page)
})

test('back keeps choices and confidence; choosing does not advance', async ({ page }) => {
  await start(page)
  await page.getByRole('radio').nth(1).check()
  await page.getByRole('checkbox').check()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1')
  await page.getByRole('button', { name: 'Next question' }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByRole('radio').nth(1)).toBeChecked()
  await expect(page.getByRole('checkbox')).toBeChecked()
  await page.getByRole('button', { name: 'Skip — I don’t know' }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  await expect(page.getByRole('checkbox')).not.toBeChecked()
  await expect(page.getByRole('button', { name: 'Next question' })).toBeDisabled()
})

test('all correct guesses get half credit and Not yet', async ({ page }) => {
  await start(page)
  await finish(page, 'guessed')
  await expect(page.getByRole('heading', { name: /Not yet/ })).toBeVisible()
  await expect(page.locator('.score-number')).toHaveText('50%')
  await expect(page.locator('.honesty-note')).toContainText('15 correct answers were guesses')
})

test('weak reading gates an 80% overall result', async ({ page }) => {
  await start(page)
  await finish(page, 'gate')
  await expect(page.getByRole('heading', { name: /Almost there/ })).toBeVisible()
  await expect(page.locator('.score-number')).toHaveText('80%')
  await expect(page.locator('.skill-insight')).toContainText('reading is below the 60% skill floor')
  await expect(page.locator('.practice-card')).toHaveCount(2)
})

test('all skips, retake, comparison, reload and manual sharing fallback', async ({ page }) => {
  await start(page)
  await finish(page, 'skip')
  await expect(page.getByRole('heading', { name: /Not yet/ })).toBeVisible()
  await expect(page.locator('.score-number')).toHaveText('0%')
  await expect(page.locator('.verdict-stats')).toContainText('15 skipped')
  await page.getByRole('button', { name: 'Retake the check' }).click()
  await finish(page)
  await expect(page.locator('.attempt-comparison')).toContainText('Last time: 0%. Now: 100%.')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  })
  await page.getByRole('button', { name: 'Share my result' }).click()
  await expect(page.getByRole('textbox', { name: 'Your shareable result' })).toHaveValue(/100% — Ready to book/)
  await page.reload()
  await expect(page.locator('.last-attempt')).toContainText('100%')
})

test('dark mode, keyboard selection and no horizontal overflow', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await start(page)
  await page.getByRole('radio').first().focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('radio').first()).toBeChecked()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('radio').nth(1)).toBeChecked()
  await checkAccessibility(page)
  await finish(page)
  await checkAccessibility(page)
  await page.screenshot({ path: test.info().outputPath('results-dark.png'), fullPage: true })
})

test('blocked storage still completes the check and explains persistence', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable') } })
  })
  await start(page)
  await finish(page)
  await expect(page.getByRole('heading', { name: 'Ready to book.' })).toBeVisible()
  await expect(page.locator('.storage-note')).toContainText('Device storage is unavailable')
})
