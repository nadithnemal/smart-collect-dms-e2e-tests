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

async function submitAsCreator(browser, baseURL, name) {
  const { context, page } = await loginInNewContext(
    browser, baseURL, process.env.CREATOR_EMAIL, process.env.CREATOR_PASSWORD
  );
  const templates = new TemplatesPage(page);
  await expect(templates.newTemplateButton).toBeVisible();
  await templates.createTemplate(name);
  await templates.editor.first().fill('automation pending content');
  await templates.submitForApproval();
  await context.close();
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