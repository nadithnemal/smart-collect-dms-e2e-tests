import { expect } from '@playwright/test';

export class HeaderFooterPage {
  constructor(page) {
    this.page = page;
    this.newProfileButton = page.getByRole('button', { name: 'New Profile' });
    this.profileNameField = page.getByRole('textbox', { name: 'Profile name' });
    this.companyNameField = page.getByRole('textbox', { name: 'Company name', exact: true });
    this.createProfileButton = page.getByRole('button', { name: 'Create Profile' });
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.deleteProfileButton = page.getByRole('button', { name: 'Delete profile' });
  }

  async goto() {
    await this.page.goto('/header-footer');
    await expect(this.page.getByRole('button', { name: /Updated/ }).first()).toBeVisible(); // wait for the profile list to load
  }

  profileCard(name) {
    return this.page.getByRole('button', { name });
  }

    async createProfile(name, company) {
        await this.newProfileButton.click();
        await expect(this.createProfileButton).toBeVisible(); // form is really in "new profile" mode
        await this.profileNameField.fill(name);
        await this.companyNameField.fill(company);
        await this.createProfileButton.click();
    }

  async editCompany(name, newCompany) {
    await this.profileCard(name).click();
    await this.companyNameField.fill(newCompany);
    await this.saveChangesButton.click();
  }

  async deleteProfile(name) {
    await this.profileCard(name).click();
    await this.deleteProfileButton.click();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
  }
}