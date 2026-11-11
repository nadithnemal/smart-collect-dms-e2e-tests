import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/UsersPage.js';

const uniqueEmail = () => `auto.${Date.now()}@example.com`;
const NEW_PASSWORD = 'Auto@800700'; // throwaway password for the test user only

test.describe('User Accounts', () => {
  let users;

  test.beforeEach(async ({ page }) => {
    users = new UsersPage(page);
    await users.goto();
  });

  test('user accounts page loads', async ({ page }) => {
    await expect(page).toHaveURL(/admin\/users/);
    await expect(users.newUserButton).toBeVisible();
    await expect(users.searchField).toBeVisible();
  });

  test('creating a user shows the activation link', async ({ page, context, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });

    await users.createUser('AUTO Tester', uniqueEmail());

    await expect(users.invitationHeading).toBeVisible();
    await users.copyLinkButton.click();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toContain('/activate?token=');
  });

  test('new user activates the account and gets view-only access', async ({ page, context, browser, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });

    await users.createUser('AUTO Tester', uniqueEmail());
    await users.copyLinkButton.click();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    await users.doneButton.click();

    // A separate, logged-out browser session for the new user
    const newContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const newPage = await newContext.newPage();

    await newPage.goto(link);
    await expect(newPage.getByText(/Welcome, AUTO/)).toBeVisible();
    await newPage.getByRole('textbox', { name: /Choose a password/ }).fill(NEW_PASSWORD);
    await newPage.getByRole('textbox', { name: 'Confirm password' }).fill(NEW_PASSWORD);
    await newPage.getByRole('button', { name: 'Activate Account' }).click();

    await newPage.getByRole('link', { name: 'Templates', exact: true }).click();
    await expect(newPage.getByText(/Read-only mode/)).toBeVisible();

    await newContext.close();
  });

    test('deleting a user removes the account from the list', async ({ page }) => {
        const email = uniqueEmail();
        const fullName = `AUTO Delete ${Date.now()}`;

        await users.createUser(fullName, email);
        await users.doneButton.click();
        await expect(page.getByText(email)).toBeVisible();

        await users.deleteUser(fullName, email);

        await expect(page.getByText(email)).toHaveCount(0);
    });
});