import { test, expect } from '@playwright/test';
import { HeaderFooterPage } from '../pages/HeaderFooterPage.js';

const uniqueName = () => `AUTO-HF ${Date.now()}`;

test.describe('Header and Footer', () => {
  let hf;

  test.beforeEach(async ({ page }) => {
    hf = new HeaderFooterPage(page);
    await hf.goto();
  });

  test('header footer page loads', async ({ page }) => {
    await expect(page).toHaveURL(/header-footer/);
    await expect(hf.newProfileButton).toBeVisible();
  });

  test('create a profile with the required fields only', async () => {
    const name = uniqueName();
    await hf.createProfile(name, 'AUTO Company');

    await expect(hf.profileCard(name)).toBeVisible();
  });

  test('edit the company name of a profile', async () => {
    const name = uniqueName();
    await hf.createProfile(name, 'AUTO Company');
    await expect(hf.profileCard(name)).toBeVisible();

    await hf.editCompany(name, 'AUTO Company edited');

    await hf.goto();
    await hf.profileCard(name).click();
    await expect(hf.companyNameField).toHaveValue('AUTO Company edited');
  });

  test('delete a profile removes it from the list', async () => {
    const name = uniqueName();
    await hf.createProfile(name, 'AUTO Company');
    await expect(hf.profileCard(name)).toBeVisible();

    await hf.deleteProfile(name);

    await expect(hf.profileCard(name)).toHaveCount(0);
  });
});