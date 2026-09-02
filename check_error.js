import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE EXCEPTION:', error.message));
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'load', timeout: 10000 });
    // wait a bit for React to render and potentially crash
    await new Promise(r => setTimeout(r, 2000));
  } catch(e) {
    console.error("Navigation error:", e);
  }
  
  await browser.close();
})();
