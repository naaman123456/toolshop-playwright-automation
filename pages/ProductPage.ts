import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productName: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.productName = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }

  async goHome() {
    await this.homeLink.click();
  }

  async openProduct(name: string) {
    await this.productName.getByText(name, { exact: true }).click();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}