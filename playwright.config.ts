import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const sandboxChromium = "/chromium-1194/chrome-linux/chrome";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    viewport: { width: 1280, height: 1800 },
    launchOptions: existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : undefined,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});