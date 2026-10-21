const { By, Select } = require('selenium-webdriver');

class DataEntryFormPage {
  constructor(driver) {
    this.driver = driver;
  }

  async enterContact({ name, email, phone, address }) {
    await this.driver.findElement(By.id('name')).sendKeys(name);
    await this.driver.findElement(By.id('email')).sendKeys(email);
    await this.driver.findElement(By.id('phone')).sendKeys(phone);
    await this.driver.findElement(By.id('textarea')).sendKeys(address);
  }

  async chooseGender(gender) {
    await this.driver.findElement(By.id(gender)).click();
  }

  async chooseDays(days) {
    for (const day of days) {
      await this.driver.findElement(By.id(day)).click();
    }
  }

  async chooseCountry(country) {
    await new Select(await this.driver.findElement(By.id('country'))).selectByVisibleText(country);
  }

  async chooseColors(colors) {
    const select = new Select(await this.driver.findElement(By.id('colors')));
    for (const color of colors) {
      await select.selectByVisibleText(color);
    }
  }

  async availableColors() {
    const select = new Select(await this.driver.findElement(By.id('colors')));
    const options = await select.getOptions();
    return Promise.all(options.map(option => option.getText().then(text => text.trim())));
  }

  async chooseAnimals(animals) {
    const select = new Select(await this.driver.findElement(By.id('animals')));
    for (const animal of animals) {
      await select.selectByVisibleText(animal);
    }
  }

  async fieldValue(id) {
    const field = await this.driver.findElement(By.id(id));
    return field.getAttribute('value');
  }

  async isSelected(id) {
    return this.driver.findElement(By.id(id)).isSelected();
  }

  async selectedOptions(id) {
    const select = new Select(await this.driver.findElement(By.id(id)));
    const options = await select.getAllSelectedOptions();
    return Promise.all(options.map(option => option.getText()));
  }

  async selectedCountry() {
    const select = new Select(await this.driver.findElement(By.id('country')));
    return (await select.getFirstSelectedOption()).getText();
  }

  async chooseCalendarDate(inputId, day) {
    await this.driver.findElement(By.id(inputId)).click();

    const dayLinks = await this.driver.findElements(By.css('.ui-datepicker-calendar a'));
    for (const dayLink of dayLinks) {
      if (await dayLink.getText() === String(day)) {
        await dayLink.click();
        return;
      }
    }

    throw new Error(`Day ${day} is not available in the selected month.`);
  }

  async enterDateRange(startDate, endDate) {
    const start = await this.driver.findElement(By.id('start-date'));
    const end = await this.driver.findElement(By.id('end-date'));
    await this.driver.executeScript(
      'arguments[0].value = arguments[1]; arguments[2].value = arguments[3];',
      start,
      startDate || '',
      end,
      endDate || '',
    );
  }

  async submitDateRange() {
    await this.driver.findElement(By.css('.date-picker-box .submit-btn')).click();
  }

  async dateRangeResult() {
    return this.driver.findElement(By.id('result')).getText();
  }

  async selectUploadFiles(inputId, filePaths) {
    await this.driver.findElement(By.id(inputId)).sendKeys(filePaths.join('\n'));
  }

  async submitUpload(formId) {
    await this.driver.findElement(By.css(`#${formId} button[type="submit"]`)).click();
  }

  async uploadStatus(statusId) {
    return this.driver.findElement(By.id(statusId)).getText();
  }
}

module.exports = { DataEntryFormPage };