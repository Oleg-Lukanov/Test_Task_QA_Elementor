import * as fs from 'fs';
import * as path from 'path';
import { test, expect } from '../fixtures/base.fixture';

const FORM_DATA = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  message: 'Hello from automated Playwright tests!',
};

const AJAX_GLOB = '**/admin-ajax.php';

// ---------------------------------------------------------------------------
// Scenario 1 – Happy Path (real network request)
// ---------------------------------------------------------------------------

test.describe('Contact Form – Happy Path', () => {
  test('submits the form successfully and shows a success message', async ({
    page,
    contactFormPage,
  }) => {
    await contactFormPage.fillForm(
      FORM_DATA.name,
      FORM_DATA.email,
      FORM_DATA.message,
    );

    // Capture the AJAX response while clicking submit
    const [response] = await Promise.all([
      page.waitForResponse(AJAX_GLOB),
      contactFormPage.submit(),
    ]);

    // ── Network assertion ──────────────────────────────────────────────────
    expect(response.status()).toBe(200);

    // ── UI assertion ───────────────────────────────────────────────────────
    await expect(contactFormPage.successMessage).toBeVisible();
    await expect(contactFormPage.successMessage).toContainText(
      'Your submission was successful.',
    );
  });
});

// ---------------------------------------------------------------------------
// Scenario 2 – Network Mocking (500 Internal Server Error)
// ---------------------------------------------------------------------------

test.describe('Contact Form – Network Error (Mocked 500)', () => {
  test('shows an error notification when the server returns 500', async ({
    page,
    contactFormPage,
  }) => {
    // Intercept and mock the AJAX endpoint before submission
    await page.route(AJAX_GLOB, route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      }),
    );

    await contactFormPage.fillForm(
      FORM_DATA.name,
      FORM_DATA.email,
      FORM_DATA.message,
    );

    await contactFormPage.submit();

    // Wait for Elementor to render the error state
    await expect(contactFormPage.errorMessage).toBeVisible();

    // ── Screenshot ─────────────────────────────────────────────────────────
    const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotsDir, 'error-500.png'),
      fullPage: true,
    });

    // ── UI assertion ───────────────────────────────────────────────────────
    await expect(contactFormPage.errorMessage).toContainText('error');
  });
});
