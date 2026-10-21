const { By, Key } = require('selenium-webdriver');

class InteractionWidgetsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async revealHoverMenu() {
    const trigger = await this.driver.findElement(By.css('.dropdown .dropbtn'));
    await this.driver.actions().move({ origin: trigger }).perform();
    const menu = await this.driver.findElement(By.css('.dropdown .dropdown-content'));
    const links = await menu.findElements(By.css('a'));
    return {
      visible: await menu.isDisplayed(),
      links: await Promise.all(links.map(link => link.getText())),
    };
  }

  async doubleClickCopyTextButton() {
    const source = await this.driver.findElement(By.id('field1'));
    const expected = await source.getAttribute('value');
    const button = await this.driver.findElement(By.xpath("//button[normalize-space()='Copy Text']"));
    await this.driver.actions().doubleClick(button).perform();
    const actual = await this.driver.findElement(By.id('field2')).getAttribute('value');
    return { expected, actual };
  }

  async dropDraggableItem(targetSelector = '#droppable') {
    const source = await this.driver.findElement(By.id('draggable'));
    const target = await this.driver.findElement(By.css(targetSelector));
    await this.driver.actions().dragAndDrop(source, target).perform();
    const dropArea = await this.driver.findElement(By.id('droppable'));
    return {
      text: await dropArea.getText(),
      highlighted: (await dropArea.getAttribute('class')).includes('ui-state-highlight'),
    };
  }

  async moveSliderOneStep() {
    const handles = await this.driver.findElements(By.css('#slider-range .ui-slider-handle'));
    await handles[0].sendKeys(Key.ARROW_RIGHT);
    return this.sliderRangeValue();
  }

  async setSliderStartEqualToEnd() {
    const handles = await this.driver.findElements(By.css('#slider-range .ui-slider-handle'));
    await handles[0].sendKeys(Key.END);
    return this.sliderRangeValue();
  }

  async attemptSliderStartPastEnd() {
    const handles = await this.driver.findElements(By.css('#slider-range .ui-slider-handle'));
    await handles[0].sendKeys(Key.END);
    await handles[0].sendKeys(Key.ARROW_RIGHT);
    return this.sliderRangeValue();
  }

  async sliderRangeValue() {
    return this.driver.findElement(By.id('amount')).getAttribute('value');
  }

  async svgShapes() {
    const shapes = await this.driver.findElements(By.css('#HTML14 svg > *'));
    return Promise.all(shapes.map(async shape => ({
      tag: await shape.getTagName(),
      fill: await shape.getAttribute('fill'),
    })));
  }

  async responseCodeLinks() {
    const links = await this.driver.findElements(By.css('#broken-links a'));
    return Promise.all(links.map(async link => ({
      text: await link.getText(),
      href: await link.getAttribute('href'),
    })));
  }
}

module.exports = { InteractionWidgetsPage };