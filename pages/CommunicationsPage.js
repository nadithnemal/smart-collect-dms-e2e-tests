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
  }

  async goto() {
    await this.page.goto('/communications');
  }
}