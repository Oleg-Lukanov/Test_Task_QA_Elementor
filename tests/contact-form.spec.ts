import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/base.fixture';

const AJAX_GLOB = '**/admin-ajax.php';

// ---------------------------------------------------------------------------
// Scenario 1 – Happy Path (real network request)
// ---------------------------------------------------------------------------

test.describe('Contact Form – Happy Path', () => {
  test('submits the form successfully and shows a success message', async ({
    page,
    contactFormPage,
  }) => {
    await contactFormPage.fillName(faker.person.fullName());
    await contactFormPage.fillEmail(faker.internet.email());
    await contactFormPage.fillMessage(faker.lorem.sentence());

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
  }, testInfo) => {
    // Intercept and mock the AJAX endpoint before submission
    await page.route(AJAX_GLOB, route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      }),
    );

    await contactFormPage.fillName(faker.person.fullName());
    await contactFormPage.fillEmail(faker.internet.email());
    await contactFormPage.fillMessage(faker.lorem.sentence());

    await contactFormPage.submit();

    // Wait for Elementor to render the error state
    await expect(contactFormPage.errorMessage).toBeVisible();

    // ── Screenshot — attached to Playwright HTML report & Allure report ────
    const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const screenshotBuffer = await page.screenshot({
      path: path.join(screenshotsDir, 'error-500.png'),
      fullPage: true,
    });

    await testInfo.attach('error-500-screenshot', {
      body: screenshotBuffer,
      contentType: 'image/png',
    });

    // ── UI assertion ───────────────────────────────────────────────────────
    await expect(contactFormPage.errorMessage).toContainText('error');
  });
});
