export class CommunicationsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Communications', exact: true });
    this.companiesTab = page.getByRole('button', { name: 'Companies', exact: true });
    this.gettingStarted = page.getByRole('heading', { name: 'Getting started' });
    this.registeredCompanies = page.getByRole('heading', { name: 'Registered Companies' });
    this.newCompanyButton = page.getByRole('button', { name: 'New Company' });
    this.dialog = page.getByRole('dialog');
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.companyNameField = this.dialog.getByRole('textbox', { name: 'Company name' });
    this.contactEmailField = this.dialog.getByRole('textbox', { name: 'Contact email' });
    this.createButton = this.dialog.getByRole('button', { name: 'Create', exact: true });
    this.doneButton = this.dialog.getByRole('button', { name: 'Done' });
    this.revokeConfirmButton = page.getByRole('button', { name: 'Revoke', exact: true });
  }

  async goto() {
    await this.page.goto('/communications');
  }

  companyRow(name) {
  return this.page.getByRole('row').filter({ hasText: name });
}

async createCompany(name, email) {
  await this.newCompanyButton.click();
  await this.companyNameField.fill(name);
  await this.contactEmailField.fill(email);
  await this.createButton.click();
}

async revokeCompany(name) {
  await this.companyRow(name).getByLabel('Revoke access').click();
  await this.revokeConfirmButton.click();
}
}