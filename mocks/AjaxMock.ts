import { type Page } from '@playwright/test';
import { AJAX_GLOB } from '../constants';

export class AjaxMock {
  constructor(private readonly page: Page) {}

  /** Intercept the AJAX form endpoint and respond with the given HTTP status. */
  async mockServerError(status: number = 500): Promise<void> {
    await this.page.route(AJAX_GLOB, route =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      }),
    );
  }
}
