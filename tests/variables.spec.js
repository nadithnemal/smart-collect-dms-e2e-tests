import { test, expect } from '@playwright/test';
import { VariablesPage } from '../pages/VariablesPage.js';

const uniqueLabel = () => `AUTO var ${Date.now()}`;

test.describe('Variables', () => {
  let variables;

  test.beforeEach(async ({ page }) => {
    variables = new VariablesPage(page);
    await variables.goto();
  });

  test('variables list page loads', async ({ page }) => {
    await expect(page).toHaveURL(/variables/);
    await expect(variables.addButton).toBeVisible();
    await expect(variables.searchField).toBeVisible();
  });

  test('create a variable with only a label', async () => {
    const label = uniqueLabel();
    await variables.createVariable(label);

    await expect(variables.labelCell(label)).toBeVisible();
  });

  test('edit the label of a variable', async () => {
    const label = uniqueLabel();
    const newLabel = `${label} edited`;
    await variables.createVariable(label);
    await expect(variables.labelCell(label)).toBeVisible();

    await variables.editLabel(label, newLabel);

    await expect(variables.labelCell(newLabel)).toBeVisible();
    await expect(variables.labelCell(label)).toHaveCount(0);
  });

  test('delete a variable removes it from the list', async () => {
    const label = uniqueLabel();
    await variables.createVariable(label);
    await expect(variables.labelCell(label)).toBeVisible();

    await variables.deleteVariable(label);

    await expect(variables.labelCell(label)).toHaveCount(0);
  });
});