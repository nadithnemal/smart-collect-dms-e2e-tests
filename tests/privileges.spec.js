import { test, expect } from '@playwright/test';
import { PrivilegesPage } from '../pages/PrivilegesPage.js';

const uniqueName = () => `AUTO Group ${Date.now()}`;

test.describe('User Privileges', () => {
  let privileges;

  test.beforeEach(async ({ page }) => {
    privileges = new PrivilegesPage(page);
    await privileges.goto();
  });

  test('privileges page loads', async ({ page }) => {
    await expect(page).toHaveURL(/admin\/privileges/);
    await expect(privileges.newGroupButton).toBeVisible();
  });

  test('create a privilege group', async () => {
    const name = uniqueName();
    await privileges.createGroup(name);

    await expect(privileges.groupCard(name)).toBeVisible();
  });

  test('edit the description of a group', async ({ page }) => {
    const name = uniqueName();
    const newDescription = `edited ${Date.now()}`;
    await privileges.createGroup(name);
    await expect(privileges.groupCard(name)).toBeVisible();

    await privileges.editDescription(name, newDescription);

    await expect(page.getByText(newDescription)).toBeVisible();
  });

  test('delete a group with no members removes it', async () => {
    const name = uniqueName();
    await privileges.createGroup(name);
    await expect(privileges.groupCard(name)).toBeVisible();

    await privileges.deleteGroup(name);

    await expect(privileges.groupCard(name)).toHaveCount(0);
  });
});