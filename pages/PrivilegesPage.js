import { expect } from '@playwright/test';

export class PrivilegesPage {
  constructor(page) {
    this.page = page;
    this.newGroupButton = page.getByRole('button', { name: 'New group' });
    this.dialog = page.getByRole('dialog');
    this.groupNameField = this.dialog.getByRole('textbox', { name: 'Group name' });
    this.descriptionField = this.dialog.getByRole('textbox', { name: 'Description' });
    this.createGroupButton = this.dialog.getByRole('button', { name: 'Create group' });
    this.saveChangesButton = this.dialog.getByRole('button', { name: 'Save changes' });
    this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
    this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
    this.deleteGroupButton = page.getByRole('button', { name: 'Delete group' });
  }

  async goto() {
    await this.page.goto('/admin/privileges');
    // wait for the group list to load
    await expect(this.page.getByRole('button', { name: /\d+ jobs? · \d+ members?/ }).first()).toBeVisible();
  }

  groupCard(name) {
    return this.page.getByRole('button', { name: new RegExp(`^${name} \\d+ jobs?`) });
  }

  async createGroup(name) {
  await this.newGroupButton.click();
  await this.groupNameField.fill(name);
  await this.createGroupButton.click();
}

  async editDescription(name, newDescription) {
    await this.groupCard(name).click();
    await this.editButton.click();
    await this.descriptionField.fill(newDescription);
    await this.saveChangesButton.click();
  }

  async deleteGroup(name) {
    await this.groupCard(name).click();
    await this.deleteButton.click();
    await this.deleteGroupButton.click();
  }
}