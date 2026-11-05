import { test, expect } from '@playwright/test';
import { TemplatesPage } from '../pages/TemplatesPage.js';

const uniqueName = () => `AUTO-Test Template ${Date.now()}`;

test.describe('Templates', () => {
  let templates;

  test.beforeEach(async ({ page }) => {
    templates = new TemplatesPage(page);
    await templates.goto();
  });

  test('templates list page loads', async ({ page }) => {
    await expect(page).toHaveURL(/templates/);
    await expect(templates.newTemplateButton).toBeVisible();
    await expect(templates.statusFilter).toBeVisible();
  });

  test('status filter can be changed', async () => {
    for (const status of ['draft', 'pending_approval', 'approved', 'rejected', 'active', 'inactive', 'all']) {
      await templates.filterByStatus(status);
      await expect(templates.statusFilter).toHaveValue(status);
    }
  });

  test('create a template opens the editor as a draft', async ({ page }) => {
  const name = uniqueName();
  await templates.createTemplate(name);

  await expect(templates.titleField).toHaveValue(name);
  await expect(page.getByText('Draft', { exact: true })).toBeVisible();
});

  test('typed content is saved', async ({ page }) => {
    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation test content');

    await page.reload();
    await expect(templates.editor.first()).toContainText('automation test content');
  });

  test('deactivating an active template makes it inactive', async ({ page }) => {
    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation deactivate content');
    await templates.publish();
    await expect(templates.deactivateButton).toBeVisible();

    await templates.deactivate();

    await expect(page.getByText('Inactive', { exact: true })).toBeVisible();
    await expect(templates.deactivateButton).toBeHidden();
  });

  test('publishing a draft makes it active', async ({ page }) => {
    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation publish content');
    await templates.publish();

    await expect(page.getByText('Active', { exact: true })).toBeVisible();
    await expect(templates.deactivateButton).toBeVisible();
    await expect(templates.publishButton).toBeHidden();
  });
});