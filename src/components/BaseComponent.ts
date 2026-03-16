import { type Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(readonly root: Locator) {}

  async isDisplayed(): Promise<boolean> {
    return this.root.isVisible();
  }
}
