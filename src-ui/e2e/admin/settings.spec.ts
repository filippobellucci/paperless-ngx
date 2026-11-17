import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/status/', (route) =>
    route.fulfill({
      json: {
        database: { status: 'OK' },
        tasks: {
          redis_status: 'DISABLED',
          celery_status: 'DISABLED',
          index_status: 'OK',
          classifier_status: 'OK',
          sanity_check_status: 'OK',
        },
      },
    })
  )
})

test('should activate / deactivate save button when settings change', async ({
  page,
}) => {
  await page.goto('/settings')
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.getByLabel('Use system setting').click()
  await page.getByRole('button', { name: 'Save' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
})

test('should warn on unsaved changes', async ({ page }) => {
  await page.goto('/settings')
  await page.getByLabel('Use system setting').click()
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('dialog')).toHaveText(/unsaved changes/)
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.getByLabel('Use system setting').click()
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('should apply appearance changes when set', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', /auto/)
  await page.getByLabel('Use system setting').click()
  await page.getByLabel('Enable dark mode').click()
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', /dark/)
})

test('should preview, save and restore the theme preset', async ({ page }) => {
  // Navigation bar colour in light mode per preset: the other presets use their own bar colour,
  // Classic keeps the user's Theme Color (#9fbf2f in the e2e backend's seed).
  const presets = [
    { name: 'Classic', id: 'classic', navbar: 'rgb(159, 191, 47)' },
    { name: 'Slate', id: 'slate', navbar: 'rgb(20, 32, 51)' },
    { name: 'Paper', id: 'paper', navbar: 'rgb(245, 241, 232)' },
    { name: 'High contrast', id: 'contrast', navbar: 'rgb(0, 0, 0)' },
    { name: 'Refined', id: 'refined', navbar: 'rgb(255, 255, 255)' },
  ]
  const html = page.locator('html')
  const navbar = page.locator('nav.navbar')
  const save = page.getByRole('button', { name: 'Save' })

  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/settings')
  await expect(html).toHaveAttribute('data-pngx-theme', 'refined')

  for (const preset of presets) {
    await page
      .getByRole('radio', { name: new RegExp(`^${preset.name}`) })
      .click()
    await expect(html).toHaveAttribute('data-pngx-theme', preset.id)
    await expect(navbar).toHaveCSS('background-color', preset.navbar)
  }

  await page.getByRole('radio', { name: /^Slate/ }).click()
  await save.scrollIntoViewIfNeeded()
  await save.click()
  await expect(save).toBeDisabled()
  await page.reload()
  await expect(html).toHaveAttribute('data-pngx-theme', 'slate')
  await expect(page.getByRole('radio', { name: /^Slate/ })).toHaveAttribute(
    'aria-checked',
    'true'
  )

  // Restore the default so other tests see the stock look.
  await page.getByRole('radio', { name: /^Refined/ }).click()
  await save.scrollIntoViewIfNeeded()
  await save.click()
  await expect(save).toBeDisabled()
})
