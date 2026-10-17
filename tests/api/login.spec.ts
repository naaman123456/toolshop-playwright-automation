import { test, expect } from '@playwright/test';
import { API_URL } from '../../test-data/testData';
import { newUser } from '../../utils/userFactory';
import { registerUser } from '../../utils/apiHelper';

test('login with valid credentials returns a token', async ({ request }) => {
  // ١. اعمل حساب جديد
  const user = await registerUser(request);
  // ٢. ادخل فيه
  const response = await request.post(`${API_URL}/users/login`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });

  // ٣. تأكد
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.access_token).toBeTruthy();
});

test('login with invalid password', async ({ request }) => {
  // ١. اعمل حساب جديد
 const user = await registerUser(request);

  // ٢. ادخل فيه بباسورد غلط
  const response = await request.post(`${API_URL}/users/login`, {
    data: {
      email: user.email,
      password: 'wrongpassword',
    },
  });

  // ٣. تأكد
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.error).toBe('Unauthorized');
});