const assert = require('node:assert/strict');
const { InteractionWidgetsPage } = require('../src/pages/interaction-widgets-page');

describe('Hover', function () {
  it('exibe as opções do menu ao passar o mouse', async function () {
    const page = new InteractionWidgetsPage(this.driver);
    const menu = await page.revealHoverMenu();

    assert.equal(menu.visible, true);
    assert.deepEqual(menu.links, ['Mobiles', 'Laptops']);
  });
});

describe('Cópia de texto', function () {
  it('copia o texto ao dar duplo clique no botão Copy Text', async function () {
    const page = new InteractionWidgetsPage(this.driver);
    const result = await page.doubleClickCopyTextButton();

    assert.equal(result.actual, result.expected);
  });
});

describe('Arrastar e soltar', function () {
  it('atualiza o destino após soltar o elemento', async function () {
    const page = new InteractionWidgetsPage(this.driver);
    const result = await page.dropDraggableItem();

    assert.equal(result.text, 'Dropped!');
    assert.equal(result.highlighted, true);
  });

  it('não aceita o drop quando o elemento é solto em outro lugar', async function () {
    const page = new InteractionWidgetsPage(this.driver);
    const result = await page.dropDraggableItem('#field1');

    assert.equal(result.text, 'Drop here');
    assert.equal(result.highlighted, false);
  });
});

describe('Slider', function () {
  it('atualiza o valor exibido ao mover o controle', async function () {
    const page = new InteractionWidgetsPage(this.driver);

    assert.equal(await page.moveSliderOneStep(), '$76 - $300');
  });

  it('impede que o valor inicial ultrapasse o valor final', async function () {
    const page = new InteractionWidgetsPage(this.driver);

    assert.equal(await page.attemptSliderStartPastEnd(), '$300 - $300');
  });

  it('permite que os valores inicial e final sejam iguais', async function () {
    const page = new InteractionWidgetsPage(this.driver);

    assert.equal(await page.setSliderStartEqualToEnd(), '$300 - $300');
  });

  it('mantém o valor inicial menor que o valor final', async function () {
    const page = new InteractionWidgetsPage(this.driver);

    assert.equal(await page.sliderRangeValue(), '$75 - $300');
  });
});

describe('Elementos SVG', function () {
  it('renderiza círculo, retângulo e polígono com as cores esperadas', async function () {
    const page = new InteractionWidgetsPage(this.driver);

    assert.deepEqual(await page.svgShapes(), [
      { tag: 'circle', fill: 'red' },
      { tag: 'rect', fill: 'green' },
      { tag: 'polygon', fill: 'blue' },
    ]);
  });
});

describe('Links e códigos de resposta', function () {
  it('retorna o código HTTP indicado em cada link', async function () {
    const page = new InteractionWidgetsPage(this.driver);
    const links = await page.responseCodeLinks();

    assert.equal(links.length, 8);
    const results = await Promise.all(links.map(async ({ text, href }) => {
      const expectedStatus = Number(text.match(/\d{3}$/)?.[0]);
      assert.ok(Number.isInteger(expectedStatus), `Código ausente no link: ${text}`);
      const response = await fetch(href, { signal: AbortSignal.timeout(15000) });
      return { text, expectedStatus, actualStatus: response.status };
    }));

    for (const { text, expectedStatus, actualStatus } of results) {
      assert.equal(actualStatus, expectedStatus, `Código HTTP incorreto para ${text}`);
    }
  });
});