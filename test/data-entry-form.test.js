const assert = require('node:assert/strict');
const { DataEntryFormPage } = require('../src/pages/data-entry-form-page');

describe('Formulário de cadastro', function () {
  it('aceita dados de contato, gênero e seleção de dias', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterContact({
      name: 'Selenium User',
      email: 'qa@example.test',
      phone: '5551234567',
      address: '10 Test Street',
    });
    await page.chooseGender('female');
    await page.chooseDays(['monday', 'friday']);

    assert.equal(await page.fieldValue('name'), 'Selenium User');
    assert.equal(await page.fieldValue('email'), 'qa@example.test');
    assert.equal(await page.fieldValue('phone'), '5551234567');
    assert.equal(await page.fieldValue('textarea'), '10 Test Street');
    assert.equal(await page.isSelected('female'), true);
    assert.equal(await page.isSelected('monday'), true);
    assert.equal(await page.isSelected('friday'), true);
  });

  it('permite selecionar um país, várias cores e animais', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.chooseCountry('Brazil');
    await page.chooseAnimals(['Fox', 'Zebra']);

    assert.equal(await page.selectedCountry(), 'Brazil');
    assert.deepEqual(await page.selectedOptions('animals'), ['Fox', 'Zebra']);
  });
});