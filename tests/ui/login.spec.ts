import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { API_URL } from '../../test-data/testData';
import { newUser } from '../../utils/userFactory';
import { registerUser } from '../../utils/apiHelper';

test('new customer can login through the UI', async ({ page, request }) => {
  // ١. تحضير بالـ API: اعمل حساب جديد
  const user = await registerUser(request);

  // ٢. اختبار بالواجهة: ادخل بالحساب الجديد
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);

  // ٣. تأكد إنه اسمه ظاهر فوق
  await expect(page.locator('[data-test="nav-menu"]'))
    .toContainText(`${user.first_name} ${user.last_name}`);
});