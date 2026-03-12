import { type Locator } from '@playwright/test';

export class NavDropdown {
  readonly toggleButton: Locator = this.root.locator('button[aria-haspopup="true"]');
  readonly panel: Locator = this.root.locator('.e-n-menu-content');

  constructor(readonly root: Locator) {}

  async isOpen(): Promise<boolean> {
    return (await this.toggleButton.getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await this.toggleButton.click();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await this.toggleButton.click();
  }
}
