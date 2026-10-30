import { test, expect } from '@playwright/test';

// Login tests must start logged OUT (this matters after Step 2)
test.use({ storageState: { cookies: [], origins: [] } });

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  const emailField = (page) => page.getByRole('textbox', { name: 'Email address' });
  const passwordField = (page) => page.getByPlaceholder('••••••••');
  const signInButton = (page) => page.getByRole('button', { name: 'Sign in' });

  test('valid login and logout', async ({ page }) => {
    await emailField(page).fill(EMAIL);
    await passwordField(page).fill(PASSWORD);
    await signInButton(page).click();

    await expect(page).not.toHaveURL(/login/);
    const userMenu = page.getByRole('button', { name: /Akash Sandeepa/ });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('wrong password is rejected', async ({ page }) => {
    await emailField(page).fill(EMAIL);
    await passwordField(page).fill('Wrong@12345');
    await signInButton(page).click();

    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/invalid|incorrect/i)).toBeVisible(); // CHANGE to the real error text
  });

  test('unknown email is rejected', async ({ page }) => {
    await emailField(page).fill('nobody@example.com');
    await passwordField(page).fill('Wrong@12345');
    await signInButton(page).click();

    await expect(page).toHaveURL(/login/);
    await expect(page.getByText(/invalid|incorrect/i)).toBeVisible(); // CHANGE to the real error text
  });

  test('empty form does not log in', async ({ page }) => {
    await signInButton(page).click();

    await expect(page).toHaveURL(/login/);
  });
});

test('protected page redirects to login when logged out', async ({ page }) => {
  await page.goto('/templates'); // CHANGE to a real page path in your app
  await expect(page).toHaveURL(/login/);
});