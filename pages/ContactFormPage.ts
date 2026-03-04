import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { FormFields } from '../types';

export class ContactFormPage extends BasePage {
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly messageField: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.nameField = this.page.locator('#form-field-name');
    this.emailField = this.page.locator('#form-field-email');
    this.messageField = this.page.locator('#form-field-message');

    this.submitButton = this.page.getByRole('button', { name: 'Send' });

    this.successMessage = this.page
      .getByRole('alert')
      .and(this.page.locator('.elementor-message-success'));

    this.errorMessage = this.page
      .getByRole('alert')
      .and(this.page.locator('.elementor-message-danger'));
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

  /** Fill all three form fields from a typed FormFields object. */
  async fillForm(data: FormFields): Promise<void> {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillMessage(data.message);
  }

  /** Click the Submit button. */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
