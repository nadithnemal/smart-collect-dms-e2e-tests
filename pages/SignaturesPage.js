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
  }

  async goto() {
    await this.page.goto('/signatures');
  }
}