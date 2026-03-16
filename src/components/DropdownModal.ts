import { type Locator } from '@playwright/test';
import { type IDropdown } from '../types';
import { BaseComponent } from './BaseComponent';

export class DropdownModal extends BaseComponent implements IDropdown {
  readonly trigger: Locator = this.root.locator('.e-n-menu-title');
  readonly panel: Locator = this.root.locator('.e-n-menu-content');

  async isOpen(): Promise<boolean> {
    return this.panel.isVisible();
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await this.trigger.hover();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await this.root.page().mouse.move(0, 0);
  }
}
