import { test, expect } from '@playwright/test';
import { PasscodeRulesPage } from '../pages/PasscodeRulesPage.js';

const uniqueName = () => `AUTO Rule ${Date.now()}`;

test.describe('Passcode Rules', () => {
  let rules;

  test.beforeEach(async ({ page }) => {
    rules = new PasscodeRulesPage(page);
    await rules.goto();
  });

  test('passcode rules page loads', async ({ page }) => {
    await expect(page).toHaveURL(/admin\/passcode-rules/);
    await expect(rules.newRuleButton).toBeVisible();
  });

  test('create a passcode rule', async () => {
    const name = uniqueName();
    await rules.createRule(name, 5);

    await expect(rules.row(name)).toBeVisible();
  });

  test('delete a passcode rule removes it from the list', async () => {
    const name = uniqueName();
    await rules.createRule(name, 5);
    await expect(rules.row(name)).toBeVisible();

    await rules.deleteRule(name);

    await expect(rules.row(name)).toHaveCount(0);
  });
});