const assert = require('node:assert/strict');
const { AlertsPage } = require('../src/pages/alerts-page');

describe('Alertas e janelas pop-up', function () {
  it('exibe a mensagem do alerta simples', async function () {
    const page = new AlertsPage(this.driver);
    const alert = await page.openSimpleAlert();

    assert.equal(await alert.getText(), 'I am an alert box!');
    await alert.accept();
  });

  it('exibe o resultado da confirmação quando aceita', async function () {
    const page = new AlertsPage(this.driver);
    const alert = await page.openConfirmation();

    assert.equal(await alert.getText(), 'Press a button!');
    await alert.accept();
    assert.equal(await page.resultText(), 'You pressed OK!');
  });

  it('exibe o resultado da confirmação quando cancelada', async function () {
    const page = new AlertsPage(this.driver);
    const alert = await page.openConfirmation();

    await alert.dismiss();
    assert.equal(await page.resultText(), 'You pressed Cancel!');
  });

  it('cumprimenta com o nome informado no prompt', async function () {
    const page = new AlertsPage(this.driver);
    const prompt = await page.openPrompt();

    assert.equal(await prompt.getText(), 'Please enter your name:');
    await prompt.sendKeys('Selenium User');
    await prompt.accept();
    assert.equal(await page.resultText(), 'Hello Selenium User! How are you today?');
  });
});