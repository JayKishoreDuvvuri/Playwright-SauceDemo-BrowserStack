import { test as fixture } from "@playwright/test";
import LoginPage from "../pages/loginPage";
import ProductsPage from "../pages/productsPage";
import ProductDetailsPage from "../pages/productDetailsPage";
import YourCartPage from "../pages/yourCartPage";
import CheckoutYourInformationPage from "../pages/checkoutYourInformationPage";
import CheckoutOverviewPage from "../pages/checkoutOverviewPage";
import CheckoutCompletePage from "../pages/checkoutCompletePage";

const cp = require("child_process");
const clientPlaywrightVersion = cp
  .execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];

const caps = {
  browser: "chrome",
  os: "osx",
  os_version: "catalina",
  name: "Playwright-Sauce-Demo",
  build: "playwright-build-7",
  "browserstack.username": "jaykishoreduvvur_T1H2Kt",
  "browserstack.accessKey": "TFVLzirFH3pFms9ATqso",
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

const isHash = (entity) =>
  Boolean(entity && typeof entity === "object" && !Array.isArray(entity));
const nestedKeyValue = (hash, keys) =>
  keys.reduce((hash, key) => (isHash(hash) ? hash[key] : undefined), hash);
const isUndefined = (val) => val === undefined || val === null || val === "";
const evaluateSessionStatus = (status) => {
  if (!isUndefined(status)) {
    status = status.toLowerCase();
  }
  if (status === "passed") {
    return "passed";
  } else if (status === "failed" || status === "timedout") {
    return "failed";
  } else {
    return "";
  }
};

const test = fixture.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  yourCartPage: async ({ page }, use) => {
    await use(new YourCartPage(page));
  },
  checkoutYourInformationPage: async ({ page }, use) => {
    await use(new CheckoutYourInformationPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  page: async ({ page, playwright }, use, testInfo) => {
    if (testInfo.project.name.match(/browserstack/)) {
      patchCaps(testInfo.project.name, `${testInfo.file} - ${testInfo.title}`);
      const vBrowser = await playwright.chromium.launch({
        wsEndpoint:
          `wss://cdp.browserstack.com/playwright?caps=` +
          `${encodeURIComponent(JSON.stringify(caps))}`,
      });
      const vContext = await vBrowser.newContext(testInfo.project.use);
      const vPage = await vContext.newPage();
      await use(vPage);
      const testResult = {
        action: "setSessionStatus",
        arguments: {
          status: evaluateSessionStatus(testInfo.status),
          reason: nestedKeyValue(testInfo, ["error", "message"]),
        },
      };
      await vPage.evaluate(() => {},
      `browserstack_executor: ${JSON.stringify(testResult)}`);
      await vPage.close();
      await vBrowser.close();
    } else {
      use(page);
    }
  },
});
export default test;
