import { type Page } from '@playwright/test';
import { AJAX_GLOB } from '../constants';
import { STATUS_CODES, type StatusCode } from '../types';

export class AjaxMock {
  constructor(private readonly page: Page) {}

  /**
   * Intercept the AJAX form endpoint and respond with the given body and status.
   * Defaults to 200 OK with { success: true } when called without arguments.
   *
   * @example
   * await ajaxMock.mockResponse({ body: { success: false }, status: STATUS_CODES.INTERNAL_SERVER_ERROR });
   */
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
