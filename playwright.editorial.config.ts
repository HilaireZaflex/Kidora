import { defineConfig } from "@playwright/test";
import publicConfig from "./playwright.config";
export default defineConfig({
  ...publicConfig,
  testDir: "./tests/editorial",
  use: {
    ...publicConfig.use,
    baseURL: "http://127.0.0.1:3011",
    trace: "off",
  },
  webServer: undefined,
});
