export class UsersPage {
  constructor(page) {
    this.page = page;
    this.newUserButton = page.getByRole('button', { name: 'New user' });
    this.searchField = page.getByPlaceholder(/Search by name/);
    this.fullNameField = page.getByRole('textbox', { name: 'Full name' });
    this.emailField = page.getByRole('textbox', { name: /^Email address/ });
    this.createAccountButton = page.getByRole('button', { name: 'Create account' });
    this.invitationHeading = page.getByText('Account created & Invitation link');
    this.copyLinkButton = page.getByRole('button', { name: 'Copy Link' });
    this.doneButton = page.getByRole('button', { name: 'Done' });
  }

  async goto() {
    await this.page.goto('/admin/users');
  }

  async createUser(fullName, email) {
    await this.newUserButton.click();
    await this.fullNameField.waitFor(); // form is open
    await this.fullNameField.fill(fullName);
    await this.emailField.fill(email);
    await this.createAccountButton.click(); // privilege group stays on the default
  }

    async deleteUser(fullName, email) {
        await this.page.getByRole('button', { name: 'Delete', description: `Delete ${fullName}`, exact: true }).click();
        await this.page.getByRole('textbox', { name: /Type the account email/ }).fill(email);
        await this.page.getByRole('button', { name: 'Delete permanently' }).click();
    }
}