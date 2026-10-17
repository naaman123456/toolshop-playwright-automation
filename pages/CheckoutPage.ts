import { Page, Locator, expect } from '@playwright/test';  


export class CheckoutPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly cartLink: Locator;
  readonly proceedButton1: Locator;
  readonly proceedButton2: Locator;
  readonly proceedButton3: Locator;
  readonly paymentMethod: Locator;
  readonly finishButton: Locator;
  readonly paymentSuccess: Locator;
  readonly orderConfirmation: Locator;


   constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="product-title"]');
    this.cartLink = page.locator('[data-test="nav-cart"]');
    this.proceedButton1 = page.locator('[data-test="proceed-1"]');
    this.proceedButton2 = page.locator('[data-test="proceed-2"]');
    this.proceedButton3 = page.locator('[data-test="proceed-3"]');
    this.paymentMethod = page.locator('[data-test="payment-method"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.paymentSuccess = page.getByText('Payment was successful');
    this.orderConfirmation = page.locator('#order-confirmation');
  }

    async openCart() {
    await this.cartLink.click();
  }

  async payWith(method: string) {
    await this.proceedButton1.click();
    await this.proceedButton2.click();
    await this.proceedButton3.click();
    await this.paymentMethod.selectOption(method);
    await this.finishButton.click();
    await expect(this.paymentSuccess).toBeVisible();
    await this.finishButton.click();
  }
}            
