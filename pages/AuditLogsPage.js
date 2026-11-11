export class AuditLogsPage {
  constructor(page) {
    this.page = page;
    this.actionFilter = page.getByLabel('Filter by action');
    this.fromDate = page.getByRole('textbox', { name: 'From date' });
    this.toDate = page.getByRole('textbox', { name: 'To date' });
    this.searchField = page.getByRole('textbox', { name: 'Search' });
    this.entryDialog = page.getByRole('dialog', { name: 'Audit entry' });
    this.closeDialogButton = page.getByRole('button', { name: 'Close dialog' });

  }

  async goto() {
    await this.page.goto('/audit-logs');
  }

  // first data row that has a details button (the header row has none)
  get firstEntryRow() {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('button') }).first();
  }

    get dataRows() {
        return this.page.getByRole('row').filter({ has: this.page.getByRole('button', { name: /View/ }) });
    }

  async openFirstEntry() {
    await this.firstEntryRow.getByRole('button').click();
  }
}