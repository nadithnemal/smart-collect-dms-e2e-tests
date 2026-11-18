import { expect } from '@playwright/test';

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
    await expect(this.page).toHaveURL(/approvals/); // wait until the queue page is really open
  }

  async review(name) {
    const reviewButton = this.row(name).getByRole('button', { name: 'Review' });
    await expect(reviewButton).toBeVisible(); // waits for the queue to load the item
    await reviewButton.click();
  }

  row(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

}