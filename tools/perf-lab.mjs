/* Labmeting (geen echte bezoekersdata): LCP, CLS en transfergrootte onder CPU-vertraging 4× en "snelle 3G/langzame 4G".
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941 node tools/perf-lab.mjs [/pad/ ...] */
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8941";
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/schuttingen/", "/materialen/", "/project-samenstellen/", "/projecten/"];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
for (const p of pages) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  let bytes = 0; cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; });
  await pg.addInitScript(() => {
    window.__m = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await pg.goto(BASE + p, { waitUntil: "load" });
  await pg.waitForTimeout(2500);
  const m = await pg.evaluate(() => window.__m);
  console.log(`${p.padEnd(26)} LCP ${(m.lcp / 1000).toFixed(2)} s · CLS ${m.cls.toFixed(3)} · ${(bytes / 1024).toFixed(0)} kB`);
  await ctx.close();
}
await b.close();
