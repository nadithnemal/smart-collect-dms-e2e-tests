import { test, expect } from '@playwright/test';
import { SignaturesPage } from '../pages/SignaturesPage.js';

test.describe('E-Signatures', () => {
  let signatures;

  test.beforeEach(async ({ page }) => {
    signatures = new SignaturesPage(page);
    await signatures.goto();
  });

  test('e-signatures page loads', async ({ page }) => {
    await expect(page).toHaveURL(/signatures/);
    await expect(signatures.heading).toBeVisible();
    await expect(signatures.refreshButton).toBeVisible();
    await expect(signatures.sendDocumentButton).toBeVisible();
    await expect(signatures.searchField).toBeVisible();
  });

  test('send document form opens and can be cancelled', async () => {
    await signatures.sendDocumentButton.click();
    await expect(signatures.dialog).toBeVisible();
    await expect(signatures.dialog).toContainText('Send Document for E-Signature');

    await signatures.cancelButton.click();
    await expect(signatures.dialog).toBeHidden();
  });

  test('empty send form is blocked by the required PDF URL field', async () => {
    await signatures.sendDocumentButton.click();
    await expect(signatures.dialog).toBeVisible();

    await signatures.sendForSignatureButton.click();

    await expect(signatures.dialog).toBeVisible(); // form did not submit
    await expect
      .poll(() => signatures.pdfUrlField.evaluate((el) => el.validity.valueMissing))
      .toBe(true);

    await signatures.cancelButton.click();
  });

  test('tabs filter requests by status', async () => {
  await expect(signatures.request(15)).toBeVisible();

  for (const tab of ['Sent', 'Viewed', 'Rejected', 'Expired']) {
    await signatures.tab(tab).click();
    await expect(signatures.request(15)).toBeHidden();
  }

  await signatures.tab('Signed').click();
  await expect(signatures.request(15)).toBeVisible();

  await signatures.tab('All').click();
  await expect(signatures.request(15)).toBeVisible();
});

test('expanding a request shows its signing details', async () => {
  await expect(signatures.request(15)).toBeVisible();
  await expect(signatures.agreementIds).toHaveCount(0);

  await signatures.expandButtons.first().click();

  await expect(signatures.agreementIds).toHaveCount(1);
});

test('refresh keeps the list', async () => {
  await expect(signatures.request(15)).toBeVisible();

  await signatures.refreshButton.click();

  await expect(signatures.request(15)).toBeVisible();
});
});