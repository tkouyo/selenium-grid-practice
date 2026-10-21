const { By, until } = require('selenium-webdriver');

class AlertsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async openSimpleAlert() {
    await this.driver.findElement(By.id('alertBtn')).click();
    return this.driver.wait(until.alertIsPresent(), 5000);
  }

  async openConfirmation() {
    await this.driver.findElement(By.id('confirmBtn')).click();
    return this.driver.wait(until.alertIsPresent(), 5000);
  }

  async openPrompt() {
    await this.driver.findElement(By.id('promptBtn')).click();
    return this.driver.wait(until.alertIsPresent(), 5000);
  }

  async resultText() {
    return this.driver.findElement(By.id('demo')).getText();
  }
}

module.exports = { AlertsPage };