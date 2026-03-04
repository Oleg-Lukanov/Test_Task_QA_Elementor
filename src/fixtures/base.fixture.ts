import { test as base, expect } from '@playwright/test';
import { ContactFormPage } from '../pages/ContactFormPage';
import { AjaxMock } from '../mocks/AjaxMock';

type Fixtures = {
  contactFormPage: ContactFormPage;
  ajaxMock: AjaxMock;
};

export const test = base.extend<Fixtures>({
  contactFormPage: async ({ page }, use) => {
    await use(new ContactFormPage(page));
  },
  ajaxMock: async ({ page }, use) => {
    await use(new AjaxMock(page));
  },
});

export { expect };
