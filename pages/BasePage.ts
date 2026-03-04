import * as fs from 'fs';
import * as path from 'path';
import { type Page, type TestInfo } from '@playwright/test';
import { SCREENSHOTS_DIR } from '../constants';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract goto(): Promise<void>;

  /**
   * Takes a full-page screenshot, saves it to /screenshots, and attaches it
   * to both the Playwright HTML report and the Allure report via testInfo.
   */
  async takeScreenshot(name: string, testInfo: TestInfo): Promise<void> {
    const screenshotsDir = path.resolve(process.cwd(), SCREENSHOTS_DIR);
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const screenshotBuffer = await this.page.screenshot({
      path: path.join(screenshotsDir, `${name}.png`),
      fullPage: true,
    });

    await testInfo.attach(name, {
      body: screenshotBuffer,
      contentType: 'image/png',
    });
  }
}
