import { expect } from '@playwright/test';

export class TemplatesPage {
  constructor(page) {
    this.page = page;
    this.statusFilter = page.getByLabel('Filter by status');
    this.newTemplateButton = page.getByRole('button', { name: 'New Template' });
    this.nameField = page.getByRole('textbox', { name: /Template name/ });
    this.createButton = page.getByRole('button', { name: 'Create & open editor' });
    this.editor = page.locator('[contenteditable="true"]'); // CHANGE if this finds the wrong element
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.publishButton = page.getByRole('button', { name: 'Publish', exact: true });
    this.titleField = page.getByRole('main').getByRole('textbox').first(); // template name box in the editor header
    this.publishDialog = page.getByRole('dialog', { name: 'Publish Template' });
    this.deactivateButton = page.getByRole('button', { name: 'Deactivate' });
    this.activateButton = page.getByRole('button', { name: 'Activate', exact: true });
    this.versionHistoryTab = page.getByRole('button', { name: 'Version History' });
    this.saveAsNewVersionButton = page.getByRole('button', { name: 'Save as New Version' });
    this.versionNoteField = page.getByRole('textbox', { name: /What changed/ });
    this.saveVersionButton = page.getByRole('dialog').getByRole('button', { name: /^Save Version/ });
    this.rollbackButton = page.getByRole('button', { name: 'Rollback', exact: true });
    this.submitForApprovalButton = page.getByRole('button', { name: 'Submit for Approval' });
    this.submitConfirmButton = page.getByRole('button', { name: 'Submit', exact: true });
  }

  async goto() {
    await this.page.goto('/templates');
  }

  async activate() {
    await this.activateButton.click();
  }

  async deactivate() {
    await this.deactivateButton.click();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
  }

  async createTemplate(name) {
    await this.newTemplateButton.click();
    await this.nameField.fill(name);
    await this.createButton.click();
    await expect(this.page).toHaveURL(/\/templates\/\d+/); // editor opened
  }

  async publish() {
    await this.publishButton.click();
    await this.publishDialog.getByRole('button', { name: 'Publish' }).click();
  }

  async saveContent(text) {
    await this.editor.first().fill(text);
    const saved = this.page.waitForResponse(
      (r) => r.request().method() !== 'GET' && r.url().includes('/templates') && r.ok()
    );
    await this.saveButton.click();
    await saved; // wait until the server accepted the save
  }

  async saveAsNewVersion(note) {
    await this.saveAsNewVersionButton.click();
    await this.versionNoteField.fill(note);
    await this.saveVersionButton.click();
  }

  async rollbackTo(version) {
    await this.rollbackButton.click();
    const dialog = this.page.getByRole('dialog', { name: `Roll back to Version ${version}?` });
    await dialog.getByRole('button', { name: 'Rollback', exact: true }).click();
  }

  templateCell(name) {
    return this.page.getByRole('cell', { name, exact: true });
  }

  async deleteTemplate(name) {
    await this.page.getByRole('button', { name: `Delete ${name}` }).click();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  }

  async submitForApproval() {
  await this.submitForApprovalButton.click();
  const submitted = this.page.waitForResponse(
    (r) => r.url().includes('/submit') && r.request().method() === 'POST'
  );
  await this.submitConfirmButton.click();
  const response = await submitted;
  expect(response.ok()).toBeTruthy();
}
}