import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { registerUser } from '../../utils/apiHelper';
import { ProductPage } from '../../pages/ProductPage';

test('customer can buy a product with cash on delivery', async ({ page, request }) => {
    // ١. تحضير: حساب جديد بالـ API، ودخول بالواجهة
    const user = await registerUser(request);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible();

    // ٢. اختيار المنتج
    const productPage = new ProductPage(page);
    await productPage.goHome();
    await productPage.openProduct('Pliers');
    await expect(productPage.productName).toContainText('Pliers');
    await productPage.addToCart();

    // ٣. السلة
    await page.locator('[data-test="nav-cart"]').click();
    await expect(page.locator('[data-test="product-title"]')).toContainText('Pliers');
    await page.locator('[data-test="proceed-1"]').click();

    // ٤. خطوات الدفع
    await page.locator('[data-test="proceed-2"]').click();
    await page.locator('[data-test="proceed-3"]').click();
    await page.locator('[data-test="payment-method"]').selectOption('cash-on-delivery');
    await page.locator('[data-test="finish"]').click();
    await expect(page.getByText('Payment was successful')).toBeVisible();
    await page.locator('[data-test="finish"]').click();

    // ٥. تأكد من الطلب
    await expect(page.locator('#order-confirmation')).toContainText('Thanks for your order!');
});