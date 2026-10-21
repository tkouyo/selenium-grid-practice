const remoteUrl = process.env.SELENIUM_REMOTE_URL || 'http://localhost:4444';
const statusUrl = new URL('/status', remoteUrl);
const deadline = Date.now() + 120_000;
let lastError;

while (Date.now() < deadline) {
  try {
    const response = await fetch(statusUrl);
    const status = await response.json();
    if (response.ok && status.value?.ready) {
      console.log(`Selenium Grid is ready at ${remoteUrl}`);
      process.exit(0);
    }
    lastError = new Error(`Grid status response: ${JSON.stringify(status.value || status)}`);
  } catch (error) {
    lastError = error;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
}

throw new Error(`Selenium Grid did not become ready at ${remoteUrl} within 120 seconds. Last error: ${lastError}`);