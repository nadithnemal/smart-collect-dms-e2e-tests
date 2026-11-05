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

  test('activating an inactive template makes it active again', async ({ page }) => {
    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation activate content');
    await templates.publish();
    await templates.deactivate();
    await expect(templates.activateButton).toBeVisible();

    await templates.activate();

    await expect(page.getByText('Active', { exact: true })).toBeVisible();
    await expect(templates.deactivateButton).toBeVisible();
    await expect(templates.activateButton).toBeHidden();
    await expect(page.getByText('Editing this template will create a new Draft version')).toBeVisible();
  });

  test('save as new version turns an active template into a draft with version 2', async ({ page }) => {
    const note = `AUTO version note ${Date.now()}`;

    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation version 1 content');
    await templates.publish();
    await expect(templates.deactivateButton).toBeVisible();

    await templates.editor.first().fill('automation version 2 content');
    await templates.saveAsNewVersion(note);

    await expect(page.getByText('Draft', { exact: true })).toBeVisible();
    await expect(templates.publishButton).toBeVisible();

    await templates.versionHistoryTab.click();
    await expect(page.getByText('Version 2', { exact: true })).toBeVisible();
    await expect(page.getByText(note)).toBeVisible();
    await expect(page.getByText('Current', { exact: true })).toBeVisible();
  });

  test('rollback to version 1 restores its content and adds a new version', async ({ page }) => {
    await templates.createTemplate(uniqueName());
    await templates.saveContent('automation version 1 content');
    await templates.publish();
    await templates.editor.first().fill('automation version 2 content');
    await templates.saveAsNewVersion(`AUTO version note ${Date.now()}`);
    await templates.versionHistoryTab.click();
    await expect(page.getByText('Version 2', { exact: true })).toBeVisible();

    await templates.rollbackTo(1);

    await templates.versionHistoryTab.click();
    await expect(page.getByText('Version 3', { exact: true })).toBeVisible();
    await expect(templates.editor.first()).toContainText('automation version 1 content');
  await expect(templates.editor.first()).not.toContainText('automation version 2 content');
  });

  test('deleting an active template removes it from the list', async ({ page }) => {
    const name = uniqueName();
    await templates.createTemplate(name);
    await templates.saveContent('automation delete content');
    await templates.publish();

    await templates.goto();
    await expect(templates.templateCell(name)).toBeVisible();

    await templates.deleteTemplate(name);

    await expect(templates.templateCell(name)).toHaveCount(0);
  });
});