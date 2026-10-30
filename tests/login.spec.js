import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

// Login tests must start logged OUT
test.use({ storageState: { cookies: [], origins: [] } });

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid login and logout', async ({ page }) => {
    await loginPage.login(EMAIL, PASSWORD);

    await expect(page).not.toHaveURL(/login/);
    const userMenu = page.getByRole('button', { name: /Akash Sandeepa/ });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('wrong password is rejected', async ({ page }) => {
    await loginPage.login(EMAIL, 'Wrong@12345');

    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/invalid|incorrect/i)).toBeVisible(); // use your real error text
  });

  test('unknown email is rejected', async ({ page }) => {
    await loginPage.login('nobody@example.com', 'Wrong@12345');

    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/invalid|incorrect/i)).toBeVisible(); // use your real error text
  });

  test('empty form does not log in', async ({ page }) => {
    await loginPage.signInButton.click();

    await expect(page).toHaveURL(/login/);
  });
});

test('protected page redirects to login when logged out', async ({ page }) => {
  await page.goto('/templates');
  await expect(page).toHaveURL(/login/);
});