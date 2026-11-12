export class ApprovalQueuePage {
  constructor(page) {
    this.page = page;
    this.sidebarLink = page.getByRole('link', { name: 'Approval Queue' });
    this.rejectButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.requestChangesButton = page.getByRole('button', { name: 'Request Changes', exact: true });
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
  }

  async openFromSidebar() {
    await this.sidebarLink.click();
  }

  row(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  async review(name) {
    await this.row(name).getByRole('button').click();
  }
}