import { type Locator } from '@playwright/test';

export interface IDropdown {
  readonly root: Locator;
  readonly toggleButton: Locator;
  readonly panel: Locator;
  isOpen(): Promise<boolean>;
  open(): Promise<void>;
  close(): Promise<void>;
}

export interface IMenu {
  readonly root: Locator;
  readonly textDropdown: IDropdown;
  readonly imageDropdown: IDropdown;
}

export interface ContactFormFields {
  name: string;
  email: string;
  message: string;
}

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
