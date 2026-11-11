import { test, expect } from '@playwright/test';
import { AuditLogsPage } from '../pages/AuditLogsPage.js';

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
});