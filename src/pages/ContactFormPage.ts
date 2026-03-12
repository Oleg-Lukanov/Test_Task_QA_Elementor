import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavMenu } from '../components';
import type { ContactFormFields } from '../types';

export class ContactFormPage extends BasePage {
  readonly greenMenu = new NavMenu(
    this.page.locator('.elementor-widget-n-menu').first(),
  );
  readonly redMenu = new NavMenu(
    this.page.locator('.elementor-widget-n-menu').last(),
  );

  readonly nameField: Locator = this.page.locator('#form-field-name');
  readonly emailField: Locator = this.page.locator('#form-field-email');
  readonly messageField: Locator = this.page.locator('#form-field-message');
  readonly submitButton: Locator = this.page.getByRole('button', { name: 'Send' });

  readonly successMessage: Locator = this.page
    .getByRole('alert')
    .and(this.page.locator('.elementor-message-success'));

  readonly errorMessage: Locator = this.page
    .getByRole('alert')
    .and(this.page.locator('.elementor-message-danger'));

  async goto(): Promise<void> {
    await this.page.goto('/elementor-36/');
    await this.nameField.waitFor({ state: 'visible' });
  }

  async fillForm(data: Partial<ContactFormFields>): Promise<void> {
    if (data.name !== undefined) await this.nameField.fill(data.name);
    if (data.email !== undefined) await this.emailField.fill(data.email);
    if (data.message !== undefined) await this.messageField.fill(data.message);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
