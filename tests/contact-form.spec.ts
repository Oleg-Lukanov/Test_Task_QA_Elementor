import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/base.fixture';
import { AJAX_GLOB } from '../constants';
import type { FormFields } from '../types';

// ---------------------------------------------------------------------------
// Scenario 1 – Happy Path (real network request)
// ---------------------------------------------------------------------------

test.describe('Contact Form – Happy Path', () => {
  test.beforeEach(async ({ contactFormPage }) => {
    await contactFormPage.goto();
  });

  test('submits the form successfully and shows a success message', async ({
    page,
    contactFormPage,
  }) => {
    const formData: FormFields = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      message: faker.lorem.sentence(),
    };

    await contactFormPage.fillForm(formData);

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
  test.beforeEach(async ({ contactFormPage }) => {
    await contactFormPage.goto();
  });

  test('shows an error notification when the server returns 500', async ({
    contactFormPage,
    ajaxMock,
  }, testInfo) => {
    await ajaxMock.mockServerError(500);

    const formData: FormFields = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      message: faker.lorem.sentence(),
    };

    await contactFormPage.fillForm(formData);
    await contactFormPage.submit();

    // ── Wait for Elementor to render the error state ─────────────────────
    await expect(contactFormPage.errorMessage).toBeVisible();

    // ── Screenshot — saved to /screenshots and attached to both reports ────
    await contactFormPage.takeScreenshot('error-500-screenshot', testInfo);

    // ── UI assertion ───────────────────────────────────────────────────────
    await expect(contactFormPage.errorMessage).toContainText('error');
  });
});
