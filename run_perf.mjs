import puppeteer from 'puppeteer';

async function runTest(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // To track network metrics
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Performance.enable');

  let totalSize = 0;
  let jsSize = 0;
  let imgSize = 0;
  let reqCount = 0;
  let supabaseReqs = 0;
  let supabaseRequestsList = [];
  let fontRequests = [];
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
    
    if (reqUrl.includes('supabase.co')) {
      supabaseReqs++;
      supabaseRequestsList.push(reqUrl);
    }
    if (reqUrl.includes('fonts.googleapis.com') || reqUrl.includes('fonts.gstatic.com')) {
      fontRequests.push(reqUrl);
    }

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
      if (type === 'image') imgSize += size;
    } catch (err) {}
  });

  // Inject performance observer before navigation
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
    
    // Attempt INP tracking roughly using event-timing
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window.__perfMetrics.inp = Math.max(window.__perfMetrics.inp, entry.duration);
      }
    }).observe({ type: 'event', buffered: true });
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait a bit for LCP/CLS to settle
  await new Promise(r => setTimeout(r, 2000));

  const metrics = await page.evaluate(() => window.__perfMetrics);

  // Check image formats and sizes
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc, // usually correctly indicates WebP/AVIF if picture tag used
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loading: img.loading,
      fetchpriority: img.getAttribute('fetchpriority')
    }));
  });
  
  const badImages = images.filter(img => img.naturalWidth > img.width * 3 && img.width > 0);
  const heroImages = images.filter(img => img.src.includes('hero'));

  // Get active Service Workers
  const swCount = await page.evaluate(async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.map(r => r.active ? r.active.scriptURL : 'none');
    } catch(e) { return []; }
  });

  await browser.close();

  return {
    metrics,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    jsSizeKB: (jsSize / 1024).toFixed(2),
    imgSizeMB: (imgSize / 1024 / 1024).toFixed(2),
    reqCount,
    supabaseReqs,
    supabaseRequestsList,
    fontRequests,
    consoleErrors,
    hydrationErrors,
    imagesCount: images.length,
    badImagesCount: badImages.length,
    badImagesExamples: badImages.slice(0, 3).map(i => i.src),
    heroImagesLoaded: heroImages.length,
    serviceWorkers: swCount
  };
}

const args = process.argv.slice(2);
const port = args[0] || '3000';
const url = `http://localhost:${port}`;

runTest(url).then(res => {
  console.log('PERF_REPORT_START');
  console.log(JSON.stringify(res, null, 2));
  console.log('PERF_REPORT_END');
}).catch(console.error);
