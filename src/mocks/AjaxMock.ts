import { type Page } from '@playwright/test';
import { AJAX_GLOB } from '../constants';
import { STATUS_CODES, type StatusCode } from '../types';

export class AjaxMock {
  constructor(private readonly page: Page) {}

  async mockResponse<T extends object>(
    data: { body: T; status?: StatusCode | number } = { body: { success: true } as T },
  ): Promise<void> {
    await this.page.route(AJAX_GLOB, route =>
      route.fulfill({
        status: data.status ?? STATUS_CODES.OK,
        contentType: 'application/json',
        body: JSON.stringify(data.body),
      }),
    );
  }
}
