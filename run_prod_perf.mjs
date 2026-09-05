import puppeteer from 'puppeteer';

async function runTest(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Performance.enable');

  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    latency: 150
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let imgSize = 0;
  let reqCount = 0;
  let supabaseReqs = 0;
  let consoleErrors = [];
  let hydrationErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      consoleErrors.push(text);
      if (text.toLowerCase().includes('hydration')) hydrationErrors.push(text);
    }
  });

  page.on('response', async (res) => {
    reqCount++;
    const reqUrl = res.url();
    if (reqUrl.includes('supabase.co')) supabaseReqs++;

    try {
      const headers = res.headers();
      let size = parseInt(headers['content-length'] || '0', 10);
      if (size === 0) {
          try {
              const buffer = await res.buffer();
              size = buffer.length;
          } catch(e) {}
      }
      totalSize += size;
      const type = res.request().resourceType();
      if (type === 'script') jsSize += size;
      if (type === 'stylesheet') cssSize += size;
      if (type === 'image') imgSize += size;
    } catch (err) {}
  });

  await page.evaluateOnNewDocument(() => {
    window.__perfMetrics = { lcp: 0, fcp: 0, cls: 0, inp: 0 };
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') window.__perfMetrics.fcp = entry.startTime;
      }
    }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      window.__perfMetrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) window.__perfMetrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window.__perfMetrics.inp = Math.max(window.__perfMetrics.inp, entry.duration);
      }
    }).observe({ type: 'event', buffered: true });
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  const metrics = await page.evaluate(() => window.__perfMetrics);

  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loading: img.loading,
      fetchpriority: img.getAttribute('fetchpriority'),
      inViewport: (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom > 0)
    }));
  });
  
  const badImages = images.filter(img => img.naturalWidth > img.width * 3 && img.width > 0);
  const heroImages = images.filter(img => img.src.includes('hero'));
  const firstViewportImages = images.filter(img => img.inViewport);

  const swData = await page.evaluate(async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (!regs.length) return null;
      const r = regs[0];
      const activeUrl = r.active ? r.active.scriptURL : null;
      const cachesKeys = await caches.keys();
      return { activeUrl, cachesKeys };
    } catch(e) { return null; }
  });

  await browser.close();

  return {
    metrics,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    jsSizeKB: (jsSize / 1024).toFixed(2),
    cssSizeKB: (cssSize / 1024).toFixed(2),
    imgSizeMB: (imgSize / 1024 / 1024).toFixed(2),
    reqCount,
    supabaseReqs,
    consoleErrors,
    hydrationErrors,
    imagesCount: images.length,
    firstViewportImages: firstViewportImages.map(i => i.src),
    heroImagesLoaded: heroImages.length,
    heroImagesDetails: heroImages.map(i => ({ src: i.src, inViewport: i.inViewport })),
    badImagesCount: badImages.length,
    badImagesExamples: badImages.slice(0, 3).map(i => ({ src: i.src, currentSrc: i.currentSrc, naturalW: i.naturalWidth, w: i.width })),
    swData
  };
}

const url = 'https://www.saurashtrahoney.com';
runTest(url).then(res => {
  console.log('PROD_PERF_REPORT_START');
  console.log(JSON.stringify(res, null, 2));
  console.log('PROD_PERF_REPORT_END');
}).catch(console.error);
