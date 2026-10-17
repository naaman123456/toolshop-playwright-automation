import { test, expect } from '@playwright/test';
import { API_URL } from '../../test-data/testData';
import { newUser } from '../../utils/userFactory';



test('register a new customer returns 201', async ({ request }) => {
  const user = newUser();

  const response = await request.post(`${API_URL}/users/register`, {
    data: user,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.email).toBe(user.email);
});

test('register with an existing email returns 409', async ({ request }) => {
  const user = newUser();

  // التسجيل الأول
  const first = await request.post(`${API_URL}/users/register`, { data: user });
  expect(first.status()).toBe(201);

  // التسجيل التاني بنفس البيانات
  const second = await request.post(`${API_URL}/users/register`, { data: user });
  expect(second.status()).toBe(409);

  const body = await second.json();
  expect(body.email).toContain('A customer with this email address already exists.');
});