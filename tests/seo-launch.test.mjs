import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(path.join(root,p),"utf8");
const domain="https://sealcleaning.nl";
const sitemap=read("sitemap.xml");
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);

test("robots allows public pages and points to production sitemap",()=>{
 const robots=read("robots.txt");
 assert.match(robots,/User-agent:\s*\*/);
 assert.match(robots,/Allow:\s*\//);
 assert.match(robots,/Sitemap:\s*https:\/\/sealcleaning\.nl\/sitemap\.xml/);
 assert.doesNotMatch(robots,/Disallow:\s*\/$/m);
});

test("sitemap URLs are unique, on canonical domain and map to published HTML",()=>{
 assert.ok(urls.length>=20,"Unexpectedly few sitemap URLs");
 assert.equal(urls.length,new Set(urls).size,"Duplicate sitemap URL");
 for(const url of urls){
  assert.ok(url.startsWith(domain+"/"),"Wrong origin: "+url);
  const pathname=new URL(url).pathname;
  const file=path.join(root,decodeURIComponent(pathname),"index.html");
  assert.ok(existsSync(file),"Sitemap references missing page: "+url);
  assert.doesNotMatch(pathname,/\/(beheer|admin|portaal)\//);
  const html=readFileSync(file,"utf8");
  assert.ok(html.includes('<link rel="canonical" href="'+url+'">'),"Canonical mismatch: "+url);
  assert.doesNotMatch(html,/<meta[^>]*name="robots"[^>]*noindex/i,"Noindex sitemap page: "+url);
 }
});

test("domain and Dutch/Turkish page references are preserved",()=>{
 assert.equal(read("CNAME").trim(),"sealcleaning.nl");
 assert.ok(urls.some(u=>u.includes("/tr/")),"No Turkish URLs in sitemap");
 const index=read("index.html");
 assert.match(index,/hreflang="tr" href="https:\/\/sealcleaning\.nl\/tr\/"/);
});
