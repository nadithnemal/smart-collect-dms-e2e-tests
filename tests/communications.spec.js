import { test, expect } from '@playwright/test';
import { CommunicationsPage } from '../pages/CommunicationsPage.js';

test.describe('Communications', () => {
  let comms;

  test.beforeEach(async ({ page }) => {
    comms = new CommunicationsPage(page);
    await comms.goto();
  });

  test('communications page loads on the API Docs tab', async ({ page }) => {
    await expect(page).toHaveURL(/communications/);
    await expect(comms.heading).toBeVisible();
    await expect(comms.gettingStarted).toBeVisible();
    await expect(comms.companiesTab).toBeVisible();
  });

  test('companies tab shows the registered companies', async () => {
    await comms.companiesTab.click();

    await expect(comms.registeredCompanies).toBeVisible();
    await expect(comms.newCompanyButton).toBeVisible();
    await expect(comms.gettingStarted).toBeHidden();
  });

  test('new company form opens and can be cancelled', async () => {
    await comms.companiesTab.click();
    await comms.newCompanyButton.click();

    await expect(comms.dialog).toBeVisible();
    await expect(comms.dialog).toContainText('Register a partner company');

    await comms.cancelButton.click();
    await expect(comms.dialog).toBeHidden();
  });

  test('create is disabled until the company form is filled', async () => {
  await comms.companiesTab.click();
  await comms.newCompanyButton.click();
  await expect(comms.dialog).toBeVisible();

  await expect(comms.createButton).toBeDisabled();

  await comms.companyNameField.fill('AUTO form check');
  await comms.contactEmailField.fill('autoformcheck@example.com');
  await expect(comms.createButton).toBeEnabled();

  await comms.cancelButton.click();
  await expect(comms.dialog).toBeHidden();
});

test('registering a company shows its API key once, then revoking it ends its access', async () => {
  const name = `AUTO Company ${Date.now()}`;
  await comms.companiesTab.click();

  await comms.createCompany(name, `auto.${Date.now()}@example.com`);

  await expect(comms.dialog).toContainText('Company registered');
  await expect(comms.dialog).toContainText('only time the full API key is shown');
  await comms.doneButton.click();
  await expect(comms.companyRow(name)).toContainText('Active');

  await comms.revokeCompany(name);

  await expect(comms.companyRow(name)).toContainText('Revoked');
});
});