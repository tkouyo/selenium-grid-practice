const assert = require('node:assert/strict');
const { TablesPage } = require('../src/pages/tables-page');

describe('Tabelas da web', function () {
  it('exibe as linhas observadas da tabela estática de livros', async function () {
    const page = new TablesPage(this.driver);

    assert.deepEqual(await page.staticBookRows(), [
      ['Learn Selenium', 'Amit', 'Selenium', '300'],
      ['Learn Java', 'Mukesh', 'Java', '500'],
      ['Learn JS', 'Animesh', 'Javascript', '300'],
      ['Master In Selenium', 'Mukesh', 'Selenium', '3000'],
      ['Master In Java', 'Amod', 'JAVA', '2000'],
      ['Master In JS', 'Amit', 'Javascript', '1000'],
    ]);
  });

  it('navega entre as páginas de produtos e retorna à primeira', async function () {
    const page = new TablesPage(this.driver);

    await page.goToProductPage(2);
    await page.waitForFirstProduct('Bluetooth Speaker');
    const secondPage = await page.productRows();
    assert.equal(secondPage[0][0], '6');
    assert.equal(secondPage[0][1], 'Bluetooth Speaker');
    assert.equal(secondPage.at(-1)[0], '10');
    assert.equal(secondPage.at(-1)[1], 'Digital Camera');

    await page.goToProductPage(1);
    await page.waitForFirstProduct('Smartphone');
    assert.equal((await page.productRows())[0][1], 'Smartphone');
  });
});