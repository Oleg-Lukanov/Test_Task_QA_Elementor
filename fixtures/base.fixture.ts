import { test as base } from '@playwright/test';
import { ContactFormPage } from '../pages/ContactFormPage';

/** Extended fixture type that exposes a ready-to-use ContactFormPage. */
type Fixtures = {
  contactFormPage: ContactFormPage;
};

export const test = base.extend<Fixtures>({
  contactFormPage: async ({ page }, use) => {
    const contactFormPage = new ContactFormPage(page);
    await contactFormPage.goto();
    await use(contactFormPage);
  },
});

export { expect } from '@playwright/test';
