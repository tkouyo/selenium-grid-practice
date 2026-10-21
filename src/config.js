const fs = require('node:fs');
const path = require('node:path');

const browser = (process.env.BROWSER || 'chrome').toLowerCase();
const executionMode = (process.env.EXECUTION_MODE || 'local').toLowerCase();

function findChromeBinary() {
  if (process.env.CHROME_BINARY) {
    return process.env.CHROME_BINARY;
  }

  const candidates = [
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  const testingRoot = path.join(process.env.LOCALAPPDATA || '', 'SeleniumPractice/ChromeForTesting');

  if (fs.existsSync(testingRoot)) {
    for (const version of fs.readdirSync(testingRoot).sort().reverse()) {
      candidates.push(path.join(testingRoot, version, 'chrome-win64/chrome.exe'));
    }
  }

  return candidates.find(candidate => candidate && fs.existsSync(candidate));
}

function findFirefoxBinary() {
  if (process.env.FIREFOX_BINARY) {
    return process.env.FIREFOX_BINARY;
  }

  const candidates = [
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Mozilla Firefox/firefox.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs/Mozilla Firefox/firefox.exe'),
  ];

  return candidates.find(candidate => candidate && fs.existsSync(candidate));
}

module.exports = {
  browser,
  baseUrl: process.env.BASE_URL || 'https://testautomationpractice.blogspot.com/',
  executionMode,
  headless: process.env.HEADLESS === 'true',
  remoteUrl: process.env.SELENIUM_REMOTE_URL || 'http://localhost:4444',
  browserBinaries: {
    chrome: findChromeBinary(),
    firefox: findFirefoxBinary(),
  },
};