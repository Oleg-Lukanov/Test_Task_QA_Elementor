import * as fs from 'fs';
import * as path from 'path';
import { expect, type Page, type TestInfo } from '@playwright/test';
import { SCREENSHOTS_DIR } from '../constants';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async takeScreenshot(name: string, testInfo: TestInfo): Promise<void> {
    const screenshotsDir = path.resolve(process.cwd(), SCREENSHOTS_DIR);
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const screenshotBuffer = await this.page.screenshot({
      path: path.join(screenshotsDir, `${name}.png`),
      fullPage: true,
    });
    await testInfo.attach(name, { body: screenshotBuffer, contentType: 'image/png' });
  }

  async takeSnapshot(name: string, testInfo: TestInfo): Promise<void> {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });
    await testInfo.attach(name, { body: screenshotBuffer, contentType: 'image/png' });
  }
}
