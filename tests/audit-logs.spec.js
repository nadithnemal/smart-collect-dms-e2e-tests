import { test, expect } from '@playwright/test';
import { AuditLogsPage } from '../pages/AuditLogsPage.js';
import { TemplatesPage } from '../pages/TemplatesPage.js';

test.describe('Audit Logs', () => {
  let audit;

  test.beforeEach(async ({ page }) => {
    audit = new AuditLogsPage(page);
    await audit.goto();
  });

  test('audit logs page loads', async ({ page }) => {
    await expect(page).toHaveURL(/audit-logs/);
    await expect(audit.actionFilter).toBeVisible();
    await expect(audit.searchField).toBeVisible();
    await expect(audit.firstEntryRow).toBeVisible();
  });

  test('action filter and date range can be set', async () => {
    await audit.actionFilter.selectOption('template_created');
    await expect(audit.actionFilter).toHaveValue('template_created');

    await audit.fromDate.fill('2026-11-01');
    await audit.toDate.fill('2026-11-11');
    await expect(audit.fromDate).toHaveValue('2026-11-01');
    await expect(audit.toDate).toHaveValue('2026-11-11');
  });

  test('search box accepts a term', async () => {
    await audit.searchField.fill('delete');
    await audit.searchField.press('Enter');

    await expect(audit.searchField).toHaveValue('delete');
  });

  test('opening an entry shows its details and can be closed', async () => {
    await audit.openFirstEntry();

    await expect(audit.entryDialog).toBeVisible();
    await expect(audit.entryDialog).toContainText('Timestamp');
    await expect(audit.entryDialog).toContainText('Action');

    await audit.closeDialogButton.click();
    await expect(audit.entryDialog).toBeHidden();
  });

  test('filtering by "Created template" shows only that action', async () => {
  await audit.actionFilter.selectOption('template_created');

  await expect(audit.dataRows.first()).toContainText('Created template');
  await expect(audit.dataRows.filter({ hasNotText: 'Created template' })).toHaveCount(0);
});


});

test.describe('Audit Logs entries from actions', () => {
  test('creating a template adds a "Created template" entry', async ({ page }) => {
    const audit = new AuditLogsPage(page);
    const templates = new TemplatesPage(page);
    const name = `AUTO-Audit Template ${Date.now()}`;

    await templates.goto();
    await templates.createTemplate(name);

    await audit.goto();
    await audit.searchField.fill(name);
    await audit.searchField.press('Enter');

    const entries = audit.dataRows.filter({ hasText: name });
    await expect(entries.filter({ hasText: 'Created template' })).toHaveCount(1);
  });
});