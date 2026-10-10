/* Browser-test. Start eerst een server in de repo-root (python3 -m http.server 8941).
   Gebruik: PLAYWRIGHT=/pad/naar/playwright/index.mjs CHROMIUM=/pad/naar/chromium node tests/e2e/<bestand>.mjs */
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const BASE = process.env.BASE || 'http://localhost:8941/';
import fs from 'fs';
const SP = process.env.E2E_TMP || (await import('node:os')).tmpdir();
const { encodeShare } = await import('../../js/configurator/design-io.js');
const { createEmptyProject } = await import('../../js/project-state.js');
const demo = createEmptyProject();
Object.assign(demo, { services: ['bestrating', 'schutting'] });
demo.access.surface = 'earth'; demo.removal.existingPaving = true; demo.removal.disposal = 'seal';
demo.paving = { areas: [{ id: 'a1', lengthMm: 6000, widthMm: 4000, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: 'terras' }], productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: 'straight', colorPresetId: 'grey' };
demo.fence = { shape: 'I', systemId: 'generic-wood-concrete', heightMm: 1800, materialPresetId: 'natural-wood-grey-concrete', gates: [], sections: [{ id: 'A', start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: 7200 }] };
const share = BASE + 'project-samenstellen/#ontwerp=' + encodeShare(demo);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({ viewport:{width:1280,height:900}, acceptDownloads:true });
await ctx.addInitScript(() => { window.print = () => { window.__printed = (window.__printed||0)+1; }; });
const page = await ctx.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(String(e))); page.on('console',m=>{ if(m.type()==='error') errors.push(m.text()); });
page.on('dialog', d => d.accept());
const B=BASE + 'beheer/';
const PW='correct-horse-battery';
await page.goto(B,{waitUntil:'networkidle'});
await page.getByLabel('Wachtwoord (min. 10 tekens)').fill(PW);
await page.getByLabel('Herhaal wachtwoord').fill(PW);
await page.getByRole('button',{name:'Kluis aanmaken'}).click();
await page.waitForSelector('[data-tabs] button');
const step = async (name) => { await page.locator('[data-tabs] button',{hasText:name}).click(); };
// settings
await step('Instellingen');
const setF = async (label, v) => { const i = page.getByLabel(label, {exact:true}); await i.fill(v); await i.press('Tab'); await page.waitForTimeout(400); };
await setF('Interne kostprijs arbeid per uur','35,00');
await setF('Opslag materiaal (%)','20');
await setF('Opslag machines (%)','10');
await setF('Opslag afvoer (%)','10');
await setF('Transport/voorrijden per werkdag','45,00');
await setF('Algemene kosten (%)','5');
await setF('Risico/onvoorzien (%)','3');
console.log('margin hint:', await page.locator('.field-hint').filter({hasText:'brutomarge'}).first().textContent());
// supplier + purchase
await step('Leveranciers');
await page.getByPlaceholder('Leverancier').fill('GEHEIM-Leverancier BV');
await page.getByRole('button',{name:'Leverancier toevoegen'}).click(); await page.waitForTimeout(400);
const row = page.locator('tr',{hasText:'Straatzand'});
await row.locator('input').first().fill('47,77');
await row.locator('select').selectOption({label:'GEHEIM-Leverancier BV'});
await row.locator('input').nth(1).fill('SKU-GEHEIM-123');
await row.getByRole('button',{name:'Opslaan'}).click(); await page.waitForTimeout(500);
// customer
await step('Klanten');
await page.getByPlaceholder('Naam').fill('Testklant Jansen');
await page.getByPlaceholder('E-mail').fill('jansen@example.nl');
await page.getByRole('button',{name:'Klant toevoegen'}).click(); await page.waitForTimeout(400);
// calc from share link
await step('Calculatie');
await page.getByLabel('Deellink').fill(share);
await page.getByRole('button',{name:'Laden',exact:true}).click();
await page.waitForSelector('.beheer-totals');
console.log('readiness:', await page.locator('h2 .badge').first().textContent());
console.log('totals:', (await page.locator('.beheer-totals').first().innerText()).replace(/\n/g,' | '));
console.log('flags:', (await page.locator('.beheer-flags li').allTextContents()).slice(0,6));
// manual line
await page.getByPlaceholder('Omschrijving').fill('Extra: boomstronk frezen');
await page.getByPlaceholder('Prijs excl. (€)').fill('85');
await page.getByRole('button',{name:'Toevoegen',exact:true}).click();
await page.getByPlaceholder('Projectnaam (bijv. Terras Jansen)').fill('Terras Jansen');
await page.locator('.beheer-card').filter({hasText:'Opslaan als offerteconcept'}).locator('select').nth(1).selectOption({label:'Testklant Jansen'});
await page.getByRole('button',{name:'Offerteconcept opslaan'}).click();
await page.waitForSelector('text=OFF-');
console.log('quote card:', (await page.locator('.beheer-card').first().locator('p').first().textContent()));
// print offerte
await page.getByRole('button',{name:'Offerte printen / PDF'}).click();
const doc = await page.locator('#print-root').innerText();
const leaks = ['GEHEIM','SKU-GEHEIM','Kostprijs','kostprijs','marge','Marge','47,77','Benaderde','opslag','Opslag','voorbeeld'].filter(w=>doc.includes(w));
console.log('printed:', await page.evaluate(()=>window.__printed), 'offerte leaks:', leaks);
console.log('offerte head:', doc.split('\n').slice(0,8).join(' | '));
fs.writeFileSync(SP+'/offerte.txt', doc);
// werkbon
await page.getByRole('button',{name:'Werkbon printen'}).click();
const wb = await page.locator('#print-root').innerText();
console.log('werkbon has €:', wb.includes('€'), 'leaks:', ['GEHEIM','marge'].filter(w=>wb.includes(w)));
// akkoord -> factuur
await page.locator('.beheer-card').first().getByLabel('Status offerte').selectOption('akkoord'); await page.waitForTimeout(400);
await page.getByRole('button',{name:'Factuur maken'}).click(); await page.waitForTimeout(400);
await page.locator('.beheer-invoice').first().getByRole('button',{name:'Printen / PDF'}).click();
const inv = await page.locator('#print-root').innerText();
console.log('factuur:', inv.includes('IBAN nog in te stellen'), 'leaks:', ['GEHEIM','marge','Kostprijs'].filter(w=>inv.includes(w)));
// project status
await step('Projecten');
console.log('project status:', await page.locator('.beheer-card summary .badge').first().textContent());
// storage is encrypted
const raw = await page.evaluate(()=>localStorage.getItem('sealBeheerVault'));
const plain = ['Jansen','GEHEIM','jansen@example','4777','Terras'].filter(w=>raw.includes(w));
console.log('vault format:', JSON.parse(raw).format, 'plaintext found:', plain, 'length', raw.length);
// lock + wrong password
await page.getByRole('button',{name:'Vergrendelen'}).click();
await page.getByLabel('Wachtwoord (min. 10 tekens)').fill('verkeerd-wachtwoord');
await page.getByRole('button',{name:'Ontgrendelen'}).click(); await page.waitForTimeout(1500);
console.log('wrong pw:', await page.locator('[role=alert]').textContent());
await page.getByLabel('Wachtwoord (min. 10 tekens)').fill(PW);
await page.getByRole('button',{name:'Ontgrendelen'}).click();
await page.waitForSelector('[data-tabs] button');
await step('Klanten');
console.log('after unlock customers:', await page.locator('.beheer-card strong').allTextContents());
// backup download
await step('Back-up');
const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button',{name:'Versleutelde back-up downloaden'}).click()]);
await dl.saveAs(SP+'/backup.json');
const bk = fs.readFileSync(SP+'/backup.json','utf8');
console.log('backup encrypted:', JSON.parse(bk).format, 'plaintext:', ['Jansen','GEHEIM'].filter(w=>bk.includes(w)));
// wipe and restore
await page.locator('summary',{hasText:'Alles wissen'}).click();
await page.getByRole('button',{name:'Kluis definitief wissen'}).click();
console.log('after wipe vault:', await page.evaluate(()=>localStorage.getItem('sealBeheerVault')));
await page.getByLabel('Wachtwoord (min. 10 tekens)').fill('nieuw-tijdelijk-1');
await page.getByLabel('Herhaal wachtwoord').fill('nieuw-tijdelijk-1');
await page.getByRole('button',{name:'Kluis aanmaken'}).click();
await page.waitForSelector('[data-tabs] button');
await step('Back-up');
await page.getByLabel('Back-upbestand').setInputFiles(SP+'/backup.json');
await page.getByLabel('Wachtwoord', {exact:true}).fill('fout-wachtwoord-x');
await page.getByRole('button',{name:/Terugzetten/}).click(); await page.waitForTimeout(1500);
console.log('restore wrong pw:', await page.locator('[role=alert]').textContent());
await page.getByLabel('Wachtwoord', {exact:true}).fill(PW);
await page.getByRole('button',{name:/Terugzetten/}).click(); await page.waitForTimeout(1500);
await step('Klanten');
console.log('restored customers:', await page.locator('.beheer-card strong').allTextContents());
await page.reload({waitUntil:'networkidle'});
await page.getByLabel('Wachtwoord (min. 10 tekens)').fill(PW);
await page.getByRole('button',{name:'Ontgrendelen'}).click();
await page.waitForSelector('[data-tabs] button');
console.log('unlock with restored pw ok');
console.log('ERRORS', errors);
await browser.close();
