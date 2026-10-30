import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.TEST_USER_EMAIL);
  await page.getByPlaceholder('••••••••').fill(process.env.TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).not.toHaveURL(/login/);

  await page.context().storageState({ path: authFile });
});

// Why: logging in through the screen before every test is slow and repeats work. 
// Instead, one setup file logs in once and saves the session. Every other test then starts already logged in.