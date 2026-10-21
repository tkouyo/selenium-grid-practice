const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('./config');

const browserSettings = {
  [Browser.CHROME]: {
    Options: chrome.Options,
    setOptions: (builder, options) => builder.setChromeOptions(options),
    setBinary: (options, binary) => options.setChromeBinaryPath(binary),
  },
  [Browser.FIREFOX]: {
    Options: firefox.Options,
    setOptions: (builder, options) => builder.setFirefoxOptions(options),
    setBinary: (options, binary) => options.setBinary(binary),
  },
};

function createOptions(browser, useLocalBinary) {
  const settings = browserSettings[browser];
  if (!settings) {
    throw new Error(`Unsupported browser: ${browser}. Supported browsers: ${Object.keys(browserSettings).join(', ')}`);
  }

  const options = new settings.Options();
  const binary = useLocalBinary && config.browserBinaries[browser];
  if (binary) {
    settings.setBinary(options, binary);
  }
  if (config.headless) {
    options.addArguments('--headless');
  }

  return options;
}

async function createDriver() {
  if (!['local', 'grid'].includes(config.executionMode)) {
    throw new Error(`Unsupported execution mode: ${config.executionMode}. Use local or grid.`);
  }

  const builder = new Builder().forBrowser(config.browser);
  const options = createOptions(config.browser, config.executionMode === 'local');

  if (config.executionMode === 'grid') {
    builder.usingServer(config.remoteUrl);
  }

  browserSettings[config.browser].setOptions(builder, options);

  return builder.build();
}

module.exports = { createDriver };