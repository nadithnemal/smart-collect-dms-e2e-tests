export class SignaturesPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'E-Signatures' });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.sendDocumentButton = page.getByRole('button', { name: 'Send Document', exact: true });
    this.searchField = page.getByPlaceholder(/Search by ID/);
    this.dialog = page.getByRole('dialog');
    this.pdfUrlField = this.dialog.getByRole('textbox', { name: /Document PDF Storage URL/ });
    this.sendForSignatureButton = this.dialog.getByRole('button', { name: 'Send for Signature' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.expandButtons = page.getByRole('button', { name: 'Expand' });
    this.agreementIds = page.getByText(/Agreement ID/);
    this.searchField = page.getByRole('searchbox', { name: /Search by ID/ });
  }

  async goto() {
    await this.page.goto('/signatures');
  }

  tab(name) {
  return this.page.getByRole('button', { name, exact: true });
}

request(number) {
  return this.page.getByText(`Request #${number}`, { exact: true });
}
}