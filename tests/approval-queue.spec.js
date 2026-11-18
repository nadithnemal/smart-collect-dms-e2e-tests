import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { TemplatesPage } from '../pages/TemplatesPage.js';
import { ApprovalQueuePage } from '../pages/ApprovalQueuePage.js';

const EMPTY = { cookies: [], origins: [] };
const uniqueName = () => `AUTO Pending ${Date.now()}`;

// Opens a separate, logged-out browser session and logs in as the given user
async function loginInNewContext(browser, baseURL, email, password) {
  const context = await browser.newContext({ baseURL, storageState: EMPTY });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  return { context, page };
}

async function submitAsCreatorKeepOpen(browser, baseURL, name) {
  const { context, page } = await loginInNewContext(
    browser, baseURL, process.env.CREATOR_EMAIL, process.env.CREATOR_PASSWORD
  );
  const templates = new TemplatesPage(page);
  await expect(templates.newTemplateButton).toBeVisible();
  await templates.createTemplate(name);
  await templates.editor.first().fill('automation pending content');
  await templates.submitForApproval();
  return { context, page };
}

async function submitAsCreator(browser, baseURL, name) {
  const { context } = await submitAsCreatorKeepOpen(browser, baseURL, name);
  await context.close();
}

async function reviewAsApprover(browser, baseURL, name) {
  const { context, page } = await loginInNewContext(
    browser, baseURL, process.env.APPROVER_EMAIL, process.env.APPROVER_PASSWORD
  );
  const queue = new ApprovalQueuePage(page);
  await queue.openFromSidebar();
  await queue.review(name);
  await expect(queue.approveButton).toBeVisible();
  return { context, page, queue };
}

test.describe('Approval Queue', () => {
  test('a submitted template appears in the queue as pending approval', async ({ browser, baseURL }) => {
    const name = uniqueName();
    await submitAsCreator(browser, baseURL, name);

    const { context, page } = await loginInNewContext(
      browser, baseURL, process.env.APPROVER_EMAIL, process.env.APPROVER_PASSWORD
    );
    const queue = new ApprovalQueuePage(page);
    await queue.openFromSidebar();

    await expect(queue.row(name)).toBeVisible();
    await expect(queue.row(name)).toContainText('Pending Approval');
    await context.close();
  });

  test('reviewing a submission shows the review actions', async ({ browser, baseURL }) => {
    const name = uniqueName();
    await submitAsCreator(browser, baseURL, name);

    const { context, page } = await loginInNewContext(
      browser, baseURL, process.env.APPROVER_EMAIL, process.env.APPROVER_PASSWORD
    );
    const queue = new ApprovalQueuePage(page);
    await queue.openFromSidebar();
    await queue.review(name);

    await expect(queue.approveButton).toBeVisible(); // only exists on the review page
    await expect(queue.rejectButton).toBeVisible();
    await expect(queue.requestChangesButton).toBeVisible();
    await expect(page.getByText(name).first()).toBeVisible();
    await expect(page.getByText('Pending Approval', { exact: true })).toBeVisible();
    await context.close();
  });
});

test.describe('Approval decisions', () => {
  async function creatorSees(creatorPage, name, filter, label) {
    const templates = new TemplatesPage(creatorPage);
    await templates.goto();
    await templates.filterByStatus(filter);
    await expect(creatorPage.getByRole('row').filter({ hasText: name })).toContainText(label);
  }

  test('approving a pending template makes it Approved for the creator', async ({ browser, baseURL }) => {
    const name = uniqueName();
    const creator = await submitAsCreatorKeepOpen(browser, baseURL, name);

    const approver = await reviewAsApprover(browser, baseURL, name);
    await approver.queue.approveButton.click();
    await expect(approver.queue.approveButton).toBeHidden();
    await approver.context.close();

    await creatorSees(creator.page, name, 'approved', 'Approved');
    await creator.context.close();
  });

  test('rejecting a pending template makes it Rejected for the creator', async ({ browser, baseURL }) => {
    const name = uniqueName();
    const creator = await submitAsCreatorKeepOpen(browser, baseURL, name);

    const approver = await reviewAsApprover(browser, baseURL, name);
    await approver.queue.rejectButton.click();
    await expect(approver.queue.rejectButton).toBeHidden();
    await approver.context.close();

    await creatorSees(creator.page, name, 'rejected', 'Rejected');
    await creator.context.close();
  });

  test('requesting changes with a comment moves the template to Rejected for the creator', async ({ browser, baseURL }) => {
    const name = uniqueName();
    const creator = await submitAsCreatorKeepOpen(browser, baseURL, name);

    const approver = await reviewAsApprover(browser, baseURL, name);
    await approver.page.getByRole('textbox', { name: /Leave a comment/ }).fill('automation: please fix the wording');
    await approver.queue.requestChangesButton.click();
    await expect(approver.queue.requestChangesButton).toBeHidden();
    await approver.context.close();

    await creatorSees(creator.page, name, 'rejected', 'Rejected');
    await creator.context.close();
  });
});