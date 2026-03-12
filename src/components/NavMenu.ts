import { type Locator } from '@playwright/test';
import { type IMenu } from '../types';
import { NavDropdown } from './NavDropdown';

export class NavMenu implements IMenu {
  readonly textDropdown = new NavDropdown(this.root.locator('.e-n-menu-item').first());
  readonly imageDropdown = new NavDropdown(this.root.locator('.e-n-menu-item').last());

  constructor(readonly root: Locator) {}
}
