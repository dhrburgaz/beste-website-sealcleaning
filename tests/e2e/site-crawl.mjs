/* Browser-test. Start eerst een server in de repo-root (python3 -m http.server 8941).
   Gebruik: PLAYWRIGHT=/pad/naar/playwright/index.mjs CHROMIUM=/pad/naar/chromium node tests/e2e/<bestand>.mjs */
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const BASE = process.env.BASE || 'http://localhost:8941/';
import fs from 'fs';
const SP = process.env.E2E_TMP || (await import('node:os')).tmpdir();
const axeSrc = process.env.AXE ? fs.readFileSync(process.env.AXE, 'utf8') : null; // pad naar axe.min.js (optioneel)
const ROOT = new URL('../../', import.meta.url).pathname;
const walk = (d) => fs.readdirSync(ROOT + d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (['vendor', 'node_modules', '.git', 'tests', 'docs', 'images', 'server', 'deploy', 'tools'].includes(e.name) ? [] : walk(d + e.name + '/')) : e.name === 'index.html' ? [d] : []);
const pages = walk('').concat(['404.html']);
const B=BASE + '';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const report = { console: [], images: [], links: new Map(), overflow: [], axe: {}, status: [] };
const linkSet = new Set();
for (const vp of [{w:1280,h:900,m:false},{w:360,h:740,m:true}]) {
  const ctx = await browser.newContext({ viewport:{width:vp.w,height:vp.h}, isMobile:vp.m, hasTouch:vp.m, bypassCSP:true });
  const page = await ctx.newPage();
  for (const p of pages) {
    const errs=[]; const onC = m=>{ if(m.type()==='error' && !/CERT|fonts\.g/.test(m.text())) errs.push(m.text()); }; const onE=e=>errs.push(String(e));
    page.on('console',onC); page.on('pageerror',onE);
    const resp = await page.goto(B+p,{waitUntil:'networkidle'});
    if (resp.status()!==200 && p!=='404.html') report.status.push(`${p}:${resp.status()}`);
    await page.evaluate(async()=>{ for (let y=0;y<document.body.scrollHeight;y+=600){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,30)); } });
    await page.waitForTimeout(200);
    const broken = await page.evaluate(()=>[...document.images].filter(i=>i.complete && i.naturalWidth===0 && i.src && !i.src.startsWith('data:')).map(i=>i.getAttribute('src')));
    if (broken.length) report.images.push(`${p}: ${broken.join(', ')}`);
    if (errs.length) report.console.push(`${p} [${vp.w}]: ${errs.slice(0,2).join(' / ')}`);
    if (vp.m) { const o = await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth); if (o>0) report.overflow.push(`${p}:${o}`); }
    if (!vp.m) {
      const hrefs = await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>h.startsWith(location.origin)));
      hrefs.forEach(h=>{ const u=h.split('#')[0]; if(!linkSet.has(u)){ linkSet.add(u); report.links.set(u,p);} });
      if (axeSrc) {
        await page.waitForTimeout(1500); // invlieg-animaties afwachten, anders vals contrastalarm
        await page.addScriptTag({content: axeSrc});
        const res = await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,t:v.nodes[0]?.target?.join(' ')})));
        for (const v of res) { const k=`${v.id} (${v.impact})`; (report.axe[k] ||= []).push(`${p}×${v.n} ${v.t}`); }
      }
    }
    page.off('console',onC); page.off('pageerror',onE);
  }
  await ctx.close();
}
const bad=[];
for (const [u,from] of report.links) { const r = await fetch(u); if (r.status!==200) bad.push(`${u} (van ${from}): ${r.status}`); }
console.log('pages', pages.length, 'status issues', report.status);
console.log('console errors', report.console);
console.log('broken images', report.images);
console.log('mobile overflow', report.overflow);
console.log('internal links checked', report.links.size, 'broken', bad);
console.log('AXE:'); for (const [k,v] of Object.entries(report.axe)) console.log(' ', k, v.length, 'pages; e.g.', v.slice(0,3).join(' | '));
await browser.close();
