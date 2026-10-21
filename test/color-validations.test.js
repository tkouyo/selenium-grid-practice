const assert = require('node:assert/strict');
const { DataEntryFormPage } = require('../src/pages/data-entry-form-page');

describe('Validação das opções de cores', function () {
  it('apresenta somente as cores disponíveis no formulário', async function () {
    const page = new DataEntryFormPage(this.driver);
    const colors = await page.availableColors();

    assert.deepEqual([...new Set(colors)].sort(), ['Blue', 'Green', 'Red', 'White', 'Yellow']);
  });

  it('mantém selecionadas as cores válidas escolhidas', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.chooseColors(['Blue', 'White']);

    assert.deepEqual(await page.selectedOptions('colors'), ['Blue', 'White']);
  });
});