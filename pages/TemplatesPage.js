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
  }

  async goto() {
    await this.page.goto('/templates');
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

  async saveContent(text) {
    await this.editor.first().fill(text);
    const saved = this.page.waitForResponse(
      (r) => r.request().method() !== 'GET' && r.url().includes('/templates') && r.ok()
    );
    await this.saveButton.click();
    await saved; // wait until the server accepted the save
  }
}