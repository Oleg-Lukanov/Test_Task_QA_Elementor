import { test as base } from '@playwright/test';
import { ContactFormPage } from '../pages/ContactFormPage';
import { AjaxMock } from '../mocks/AjaxMock';

type Fixtures = {
  contactFormPage: ContactFormPage;
  ajaxMock: AjaxMock;
};

export const test = base.extend<Fixtures>({
  /** Provides a ContactFormPage instance. Navigation is handled by beforeEach in each suite. */
  contactFormPage: async ({ page }, use) => {
    await use(new ContactFormPage(page));
  },

  /** Provides an AjaxMock instance for intercepting the form's AJAX endpoint. */
  ajaxMock: async ({ page }, use) => {
    await use(new AjaxMock(page));
  },
});

export { expect } from '@playwright/test';
