import { test, expect } from '@playwright/test';

test('login and logout with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3001/login');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('admin@example.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('Admin@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).not.toHaveURL(/login/);
  await page.getByRole('button', { name: 'AS Akash Sandeepa' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/login/);
});