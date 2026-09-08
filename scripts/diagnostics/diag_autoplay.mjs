import puppeteer from 'puppeteer-core';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const testUrl = 'http://localhost:8080';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser] ${msg.text()}`);
  });

  try {
    console.log(`Navigating to ${testUrl}...`);
    await page.goto(testUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('Scrolling down to video carousel...');
    await page.evaluate(async () => {
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < 40; i++) {
        window.scrollBy(0, 100);
        await wait(100);
      }
    });

    console.log('Waiting 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('Checking DOM state...');
    const state = await page.evaluate(() => {
      const cards = document.querySelectorAll('.shoppable-video-card');
      const data = [];
      cards.forEach((card, idx) => {
        const video = card.querySelector('video');
        const img = card.querySelector('img');
        const rect = card.getBoundingClientRect();
        
        data.push({
          id: card.getAttribute('data-card-id'),
          inView: rect.top < window.innerHeight && rect.bottom > 0,
          rect: { top: rect.top, left: rect.left, width: rect.width },
          hasVideo: !!video,
          hasImg: !!img,
          imgSrc: img ? img.src : null,
          videoSrc: video ? video.currentSrc || video.src : null,
          videoReady: video ? video.readyState : null,
          videoPaused: video ? video.paused : null,
          videoError: video && video.error ? video.error.code : null
        });
      });
      return {
        cards: data,
        window: { width: window.innerWidth, height: window.innerHeight }
      };
    });
    
    console.log("State:", JSON.stringify(state, null, 2));
    
  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await browser.close();
  }
})();
