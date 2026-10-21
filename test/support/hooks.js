const fs = require('node:fs/promises');
const path = require('node:path');
const config = require('../../src/config');
const { createDriver } = require('../../src/driver-factory');

exports.mochaHooks = {
  async beforeEach() {
    this.driver = await createDriver();
    await this.driver.get(config.baseUrl);
  },

  async afterEach() {
    if (!this.driver) {
      return;
    }

    try {
      if (this.currentTest.state === 'failed') {
        const directory = path.join(process.cwd(), 'artifacts', 'screenshots');
        await fs.mkdir(directory, { recursive: true });
        const fileName = `${Date.now()}-${this.currentTest.title.replace(/[^a-z0-9-]+/gi, '-')}.png`;
        await this.driver.takeScreenshot().then(image => fs.writeFile(path.join(directory, fileName), image, 'base64'));
        await fs.writeFile(
          path.join(directory, fileName.replace(/\.png$/, '.log')),
          `${this.currentTest.err?.stack || this.currentTest.err?.message || 'Test failed without an error stack.'}\n`,
        );
        try {
          const browserLogs = await this.driver.manage().logs().get('browser');
          await fs.writeFile(path.join(directory, fileName.replace(/\.png$/, '-browser.log')), JSON.stringify(browserLogs, null, 2));
        } catch (error) {
          console.error('Could not collect browser console logs:', error);
        }
      }
    } catch (error) {
      console.error('Could not save failure screenshot:', error);
    } finally {
      try {
        await this.driver.quit();
      } catch (error) {
        console.error('Could not close WebDriver session:', error);
      }
    }
  },
};