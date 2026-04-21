import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fillValidForm = async (page: import('@playwright/test').Page) => {
  await page.fill('#firstName', 'Alice')
  await page.fill('#lastName', 'Smith')
  await page.fill('#email', 'alice@example.com')
  await page.fill('#phone', '+1 555 000 0000')
}

// ---------------------------------------------------------------------------
// 1. Page load
// ---------------------------------------------------------------------------
test.describe('Page load', () => {
  test('loads successfully and shows the hero heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Unlock the Future of')
  })

  test('shows the form card heading "Get Started Now"', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('Get Started Now')
  })

  test('form fields are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#firstName')).toBeVisible()
    await expect(page.locator('#lastName')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#phone')).toBeVisible()
  })

  test('submit button is present and enabled', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('button[type="submit"]')
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
    await expect(btn).toContainText('Sign Up Now')
  })
})

// ---------------------------------------------------------------------------
// 2. Successful submission (mocked fetch)
// ---------------------------------------------------------------------------
test.describe('Successful form submission', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the webhook and return 200
    await page.route('**/webhook/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    )
    await page.goto('/')
  })

  test('shows the success banner after submitting valid data', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Successfully submitted')).toBeVisible({ timeout: 5000 })
  })

  test('clears form fields after successful submission', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Successfully submitted')).toBeVisible({ timeout: 5000 })

    await expect(page.locator('#firstName')).toHaveValue('')
    await expect(page.locator('#lastName')).toHaveValue('')
    await expect(page.locator('#email')).toHaveValue('')
    await expect(page.locator('#phone')).toHaveValue('')
  })

  test('does not display an error banner after a successful submit', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Successfully submitted')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Failed to submit form')).not.toBeVisible()
  })

  test('submit button shows "Processing..." while request is in flight', async ({ page }) => {
    // Delay the response to observe intermediate state
    await page.route('**/webhook/**', async (route) => {
      await new Promise((r) => setTimeout(r, 800))
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })

    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.locator('button[type="submit"]')).toContainText('Processing...')
  })
})

// ---------------------------------------------------------------------------
// 3. Failed submission
// ---------------------------------------------------------------------------
test.describe('Failed form submission', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the webhook and return 500
    await page.route('**/webhook/**', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    )
    await page.goto('/')
  })

  test('displays the error banner when the server returns a non-ok status', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Failed to submit form. Please try again.')).toBeVisible({
      timeout: 5000,
    })
  })

  test('does NOT show the success banner when submission fails', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Failed to submit form')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Successfully submitted')).not.toBeVisible()
  })

  test('submit button is re-enabled after a failed submission', async ({ page }) => {
    await fillValidForm(page)
    await page.click('button[type="submit"]')
    await expect(page.getByText('Failed to submit form')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('button[type="submit"]')).toBeEnabled()
  })
})

// ---------------------------------------------------------------------------
// 4. HTML5 validation (no JS override)
// ---------------------------------------------------------------------------
test.describe('HTML5 browser validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('email field rejects a non-email value via browser validation', async ({ page }) => {
    await page.fill('#firstName', 'Alice')
    await page.fill('#lastName', 'Smith')
    await page.fill('#email', 'not-an-email')
    await page.click('button[type="submit"]')

    // Form should NOT have submitted — success or error banners must stay hidden
    await expect(page.getByText('Successfully submitted')).not.toBeVisible()
    await expect(page.getByText('Failed to submit form')).not.toBeVisible()
  })
})
