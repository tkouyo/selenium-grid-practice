const { By } = require('selenium-webdriver');

class TablesPage {
  constructor(driver) {
    this.driver = driver;
  }

  async staticBookRows() {
    const table = await this.driver.findElement(By.xpath("//h2[normalize-space()='Static Web Table']/following::table[1]"));
    return this.readRows(table);
  }

  async productRows() {
    const table = await this.driver.findElement(By.id('productTable'));
    return this.readRows(table);
  }

  async goToProductPage(pageNumber) {
    const link = await this.driver.findElement(By.xpath(`//*[@id='pagination']//a[@href='#' and normalize-space()='${pageNumber}']`));
    await link.click();
  }

  async waitForFirstProduct(name) {
    await this.driver.wait(async () => {
      const rows = await this.productRows();
      return rows[0]?.[1] === name;
    }, 5000);
  }

  async readRows(table) {
    const rows = await table.findElements(By.css('tr'));
    return Promise.all(rows.slice(1).map(async row => {
      const cells = await row.findElements(By.css('td'));
      return Promise.all(cells.map(cell => cell.getText()));
    }));
  }
}

module.exports = { TablesPage };