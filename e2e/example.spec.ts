import { test, expect } from '@playwright/test';

const authFile = "playwright/.auth/wa.json";


test('has title', async ({ page }) => {
  await page.goto("https://web.whatsapp.com/");

  await page.waitForTimeout(3000);

  // await page.context().storageState({ path: authFile });

  await page.addScriptTag({
    path: require.resolve("@wppconnect/wa-js")
  });

  // Wait WA-JS load
  await page.waitForFunction(() => window.WPP?.isReady);

  // Evaluating code: See https://playwright.dev/docs/evaluating/
  const isAuthenticated: string = await page.evaluate(() => WPP.conn.isAuthenticated());

  await console.log(`isAuthenticated : ${isAuthenticated}`);




  // // Sending message: See https://playwright.dev/docs/evaluating/
  // const sendResult: string = await page.evaluate((to, message) => WPP.chat.sendTextMessage(to, message), to, message);
});