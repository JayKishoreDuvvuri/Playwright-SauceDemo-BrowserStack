import { execSync } from "child_process";
const clientPlaywrightVersion = execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
  browser: "chrome",
  os: "osx",
  os_version: "catalina",
  name: "My first playwright test",
  build: "playwright-build-006",
  "browserstack.username": "jaykishore_kjTNiL",
  "browserstack.accessKey": "9AnpwFRARxnsncYJzpq4",
  "browserstack.local": false,
  "client.playwrightVersion": clientPlaywrightVersion,
};

// Patching the capabilities dynamically according to the project name.
const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, browser_version] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let os_version = osCapsSplit.join(" ");
  caps.browser = browser ? browser : "chrome";
  caps.os_version = browser_version ? browser_version : "latest";
  caps.os = os ? os : "osx";
  caps.os_version = os_version ? os_version : "catalina";
  caps.name = title;
};

export function getCdpEndpoint(name, title) {
  patchCaps(name, title);
  const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
    JSON.stringify(caps)
  )}`;
  console.log(`--> ${wsEndpoint}`);
  return wsEndpoint;
}
