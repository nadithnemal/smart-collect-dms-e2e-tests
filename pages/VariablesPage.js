export class VariablesPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add Variable' });
    this.searchField = page.getByPlaceholder(/Search variables/);
    this.dialog = page.getByRole('dialog');
    this.labelField = this.dialog.getByRole('textbox', { name: /^Label/ });
    this.createButton = this.dialog.getByRole('button', { name: 'Create variable' });
    this.saveChangesButton = this.dialog.getByRole('button', { name: 'Save changes' });
  }

  async goto() {
    await this.page.goto('/variables');
  }

  labelCell(label) {
    return this.page.getByRole('cell', { name: label, exact: true });
  }

  async createVariable(label) {
    await this.addButton.click();
    await this.labelField.fill(label);
    await this.createButton.click();
  }

  async editLabel(oldLabel, newLabel) {
    await this.page.getByRole('button', { name: `Edit ${oldLabel}` }).click();
    await this.labelField.fill(newLabel);
    await this.saveChangesButton.click();
  }

  async deleteVariable(label) {
    await this.page.getByRole('button', { name: `Delete ${label}` }).click();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  }
}