const assert = require('node:assert/strict');
const { DataEntryFormPage } = require('../src/pages/data-entry-form-page');

describe('Datas do formulário', function () {
  it('seleciona datas nos calendários com seus formatos correspondentes', async function () {
    const page = new DataEntryFormPage(this.driver);
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    await page.chooseCalendarDate('datepicker', 15);
    assert.equal(await page.fieldValue('datepicker'), `${month}/15/${year}`);

    await page.chooseCalendarDate('txtDate', 15);
    assert.equal(await page.fieldValue('txtDate'), `15/${month}/${year}`);
  });

  it('informa quando faltam datas para calcular o intervalo', async function () {
    const page = new DataEntryFormPage(this.driver);

    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'Please select both start and end dates.');
  });

  it('rejeita quando a data inicial é posterior à data final', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2026-10-22', '2026-10-20');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'End date must be after start date.');
  });

  it('calcula a duração de um intervalo de um mês', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2025-01-15', '2025-02-15');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'You selected a range of 31 days.');
  });

  it('calcula a duração de um ano comum', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2025-06-15', '2026-06-15');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'You selected a range of 365 days.');
  });

  it('contabiliza o dia extra de um ano bissexto', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2024-01-01', '2025-01-01');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'You selected a range of 366 days.');
  });

  it('retorna zero dias quando as datas inicial e final são iguais', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2026-10-21', '2026-10-21');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'You selected a range of 0 days.');
  });

  it('calcula a duração de um intervalo válido', async function () {
    const page = new DataEntryFormPage(this.driver);
    await page.enterDateRange('2026-10-20', '2026-10-23');
    await page.submitDateRange();

    assert.equal(await page.dateRangeResult(), 'You selected a range of 3 days.');
  });
});