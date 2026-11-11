export class EmailTemplatesPage {
  constructor(page) {
    this.page = page;
    this.newTemplateButton = page.getByRole('button', { name: 'New Template' });
    this.nameField = page.getByRole('textbox', { name: /^Name/ });
    this.subjectField = page.getByRole('textbox', { name: /^Subject/ });
    this.bodyField = page.getByRole('textbox', { name: /^Body/ });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async goto() {
    await this.page.goto('/admin/email-templates');
  }

  nameCell(name) {
    return this.page.getByRole('cell', { name, exact: true });
  }

  row(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  async createTemplate(name, subject, body) {
    await this.newTemplateButton.click();
    await this.nameField.fill(name);
    await this.subjectField.fill(subject);
    await this.bodyField.fill(body);
    await this.saveButton.click();
  }

  async editName(name, newName) {
    await this.row(name).getByLabel('Edit template').click();
    await this.nameField.fill(newName);
    await this.saveButton.click();
  }

  async deleteTemplate(name) {
    await this.row(name).getByLabel('Delete template').click();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  }
}