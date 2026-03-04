import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/base.fixture';
import { AJAX_GLOB } from '../constants';
import { STATUS_CODES } from '../types';
import type { ContactFormFields } from '../types';

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

    const [response] = await Promise.all([
      page.waitForResponse(AJAX_GLOB),
      contactFormPage.submit(),
    ]);

    expect(response.status()).toBe(STATUS_CODES.OK);

    await expect(contactFormPage.successMessage).toBeVisible();
    await expect(contactFormPage.successMessage).toContainText('Your submission was successful.');
  });
});

test.describe('Contact Form – Network Error (Mocked 500)', () => {
  test.beforeEach(async ({ contactFormPage }) => {
    await contactFormPage.goto();
  });

  test('shows an error notification when the server returns 500', async ({
    contactFormPage,
    ajaxMock,
  }, testInfo) => {
    await ajaxMock.mockResponse({
      body: { success: false },
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });

    const formData: ContactFormFields = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      message: faker.lorem.sentence(),
    };

    await contactFormPage.fillForm(formData);
    await contactFormPage.submit();

    await expect(contactFormPage.errorMessage).toBeVisible();
    await expect(contactFormPage.errorMessage).toContainText('error');

    await contactFormPage.takeSnapshot('error-500-snapshot', testInfo);
  });
});
