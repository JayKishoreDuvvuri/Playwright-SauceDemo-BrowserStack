import { defineConfig } from "@playwright/test";
import { getCdpEndpoint } from "./browserstack.config.js";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.test.js",
  reporter: [["list"], ["./CustomReporter"]],
  timeout: 60000,
  use: {
    viewport: null,
  },
  projects: [
    {
      name: "chrome@latest:Windows 10",
      use: {
        browserName: "chromium",
        channel: "chrome",
        connectOptions: {
          wsEndpoint: getCdpEndpoint("chrome@latest:Windows 10", "test1"),
        },
      },
    },
    {
      name: "chrome@latest:Windows 11",
      use: {
        browserName: "chromium",
        channel: "chrome",
        connectOptions: {
          wsEndpoint: getCdpEndpoint("chrome@latest:Windows 11", "test2"),
        },
      },
    },
    {
      name: "chrome@latest-beta:OSX Big Sur",
      use: {
        browserName: "chromium",
        channel: "chrome",
        connectOptions: {
          wsEndpoint: getCdpEndpoint("chrome@latest-beta:OSX Big Sur", "test3"),
        },
      },
    },
    {
      name: "edge@90:Windows 10",
      use: {
        browserName: "chromium",
        connectOptions: {
          wsEndpoint: getCdpEndpoint("edge@90:Windows 10", "test4"),
        },
      },
    },
    {
      name: "playwright-firefox@latest:OSX Catalina",
      use: {
        browserName: "firefox",
        connectOptions: {
          wsEndpoint: getCdpEndpoint(
            "playwright-firefox@latest:OSX Catalina",
            "test5"
          ),
        },
      },
    },
    {
      name: "playwright-webkit@latest:OSX Big Sur",
      use: {
        browserName: "webkit",
        connectOptions: {
          wsEndpoint: getCdpEndpoint(
            "playwright-webkit@latest:OSX Big Sur",
            "test6"
          ),
        },
      },
    },
    {
      name: "playwright-webkit@latest:OSX Ventura",
      use: {
        browserName: "webkit",
        connectOptions: {
          wsEndpoint: getCdpEndpoint(
            "playwright-webkit@latest:OSX Ventura",
            "test7"
          ),
        },
      },
    },
    {
      name: "playwright-firefox:Windows 11",
      use: {
        browserName: "firefox",
        connectOptions: {
          wsEndpoint: getCdpEndpoint("playwright-firefox:Windows 11", "test8"),
        },
      },
    },
  ],
});
