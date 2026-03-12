import { type Locator } from '@playwright/test';
import { type IDropdown } from '../types';

export class NavDropdown implements IDropdown {
  readonly toggleButton: Locator = this.root.locator('button[aria-haspopup="true"]');
  readonly panel: Locator = this.root.locator('.e-n-menu-content');

  constructor(readonly root: Locator) {}

  async isOpen(): Promise<boolean> {
    return (await this.toggleButton.getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await this.root.hover();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await this.root.page().mouse.move(0, 0);
  }
}
