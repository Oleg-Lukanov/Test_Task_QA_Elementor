import { faker } from '@faker-js/faker';
import { test, expect } from '../src/fixtures/base.fixture';
import { AJAX_GLOB } from '../src/constants';
import { STATUS_CODES } from '../src/types';
import type { ContactFormFields } from '../src/types';

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
    const formData: ContactFormFields = {
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

    // ── Network assertion ──────────────────────────────────────────────────────
    expect(response.status()).toBe(STATUS_CODES.OK);

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
    await ajaxMock.mockResponse({
      body:   { success: false },
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });

    const formData: ContactFormFields = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      message: faker.lorem.sentence(),
    };

    await contactFormPage.fillForm(formData);
    await contactFormPage.submit();

    // ── UI assertions — wait for full error state before screenshotting ────
    await expect(contactFormPage.errorMessage).toBeVisible();
    await expect(contactFormPage.errorMessage).toContainText('error');

    // ── Visual snapshot — baseline in __snapshots__, diff in Playwright HTML, image in Allure ──
    await contactFormPage.takeSnapshot('error-500-snapshot', testInfo);
  });
});
