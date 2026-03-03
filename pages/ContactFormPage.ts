import { type Page, type Locator } from '@playwright/test';

/** Selectors sourced from inspecting https://wtfqsbkm.elementor.cloud/elementor-36/ */
const SELECTORS = {
  nameField: '#form-field-name',
  emailField: '#form-field-email',
  messageField: '#form-field-message',
  submitButton: 'button[type="submit"]',
  successMessage: '.elementor-message-success',
  errorMessage: '.elementor-message-danger',
} as const;

export class ContactFormPage {
  readonly page: Page;

  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly messageField: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.locator(SELECTORS.nameField);
    this.emailField = page.locator(SELECTORS.emailField);
    this.messageField = page.locator(SELECTORS.messageField);
    this.submitButton = page.locator(SELECTORS.submitButton);
    this.successMessage = page.locator(SELECTORS.successMessage);
    this.errorMessage = page.locator(SELECTORS.errorMessage);
  }

  /** Navigate to the contact-form page and wait until the form is visible. */
  async goto(): Promise<void> {
    await this.page.goto('/elementor-36/');
    await this.nameField.waitFor({ state: 'visible' });
  }

  /** Fill in all three form fields. */
  async fillForm(name: string, email: string, message: string): Promise<void> {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.messageField.fill(message);
  }

  /** Click the submit button and wait for the response to the AJAX endpoint. */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
