export class PasscodeRulesPage {
  constructor(page) {
    this.page = page;
    this.newRuleButton = page.getByRole('button', { name: 'New Passcode Rule' });
    this.ruleNameField = page.getByRole('textbox', { name: 'Rule Name' });
    this.ruleTypeSelect = page.getByLabel(/^Rule Type/);
    this.digitsField = page.getByRole('spinbutton', { name: /^Number of Digits/ });
    this.createRuleButton = page.getByRole('button', { name: 'Create Rule' });
  }

  async goto() {
    await this.page.goto('/admin/passcode-rules');
  }

  row(name) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  async createRule(name, digits) {
    await this.newRuleButton.click();
    await this.ruleNameField.fill(name);
    await this.ruleTypeSelect.selectOption('mobile_last_digits');
    await this.digitsField.fill(String(digits));
    await this.createRuleButton.click();
  }

  async deleteRule(name) {
    await this.row(name).getByLabel('Delete rule').click();
    await this.page.getByRole('button', { name: 'Delete Rule', exact: true }).click();
  }
}