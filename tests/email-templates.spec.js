import { test, expect } from '@playwright/test';
import { EmailTemplatesPage } from '../pages/EmailTemplatesPage.js';

const uniqueName = () => `AUTO Email ${Date.now()}`;

test.describe('Email Templates', () => {
  let emails;

  test.beforeEach(async ({ page }) => {
    emails = new EmailTemplatesPage(page);
    await emails.goto();
  });

  test('email templates page loads', async ({ page }) => {
    await expect(page).toHaveURL(/admin\/email-templates/);
    await expect(emails.newTemplateButton).toBeVisible();
  });

  test('create an email template', async () => {
    const name = uniqueName();
    await emails.createTemplate(name, 'automation testing', 'this is for automation testing purpose only');

    await expect(emails.nameCell(name)).toBeVisible();
  });

  test('edit the name of an email template', async () => {
    const name = uniqueName();
    const newName = `${name} edited`;
    await emails.createTemplate(name, 'automation testing', 'this is for automation testing purpose only');
    await expect(emails.nameCell(name)).toBeVisible();

    await emails.editName(name, newName);

    await expect(emails.nameCell(newName)).toBeVisible();
    await expect(emails.nameCell(name)).toHaveCount(0);
  });

  test('delete an email template removes it from the list', async () => {
    const name = uniqueName();
    await emails.createTemplate(name, 'automation testing', 'this is for automation testing purpose only');
    await expect(emails.nameCell(name)).toBeVisible();

    await emails.deleteTemplate(name);

    await expect(emails.nameCell(name)).toHaveCount(0);
  });
});