import { type Page, type Locator } from '@playwright/test';

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

    this.nameField = page.locator('#form-field-name');
    this.emailField = page.locator('#form-field-email');
    this.messageField = page.locator('#form-field-message');

    this.submitButton = page.getByRole('button', { name: 'Send' });

    this.successMessage = page
      .getByRole('alert')
      .and(page.locator('.elementor-message-success'));

    this.errorMessage = page
      .getByRole('alert')
      .and(page.locator('.elementor-message-danger'));
  }

  /** Navigate to the contact-form page and wait until the form is visible. */
  async goto(): Promise<void> {
    await this.page.goto('/elementor-36/');
    await this.nameField.waitFor({ state: 'visible' });
  }

  /** Fill the Name field. */
  async fillName(name: string): Promise<void> {
    await this.nameField.fill(name);
  }

  /** Fill the Email field. */
  async fillEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  /** Fill the Message field. */
  async fillMessage(message: string): Promise<void> {
    await this.messageField.fill(message);
  }

  /** Fill all three form fields by delegating to the individual fill methods. */
  async fillForm(name: string, email: string, message: string): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillMessage(message);
  }

  /** Click the Submit button. */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
