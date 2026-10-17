import { APIRequestContext, expect } from '@playwright/test';
import { API_URL } from '../test-data/testData';
import { newUser } from './userFactory';

export async function registerUser(request: APIRequestContext) {
  const user = newUser();
  const response = await request.post(`${API_URL}/users/register`, { data: user });
  expect(response.status()).toBe(201);
  return user;
}