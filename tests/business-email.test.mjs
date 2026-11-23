import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = p => readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("business email visible in config and NL/TR contact pages",()=>{
 const config=read("js/config.js");
 assert.match(config,/email: "info@sealcleaning\.nl"/);
 assert.match(config,/phoneDisplay: "078 204 95 17"/);
 assert.match(config,/phoneHref: "tel:\+31782049517"/);
 for(const path of ["contact/index.html","tr/contact/index.html"]){
  const html=read(path);
  assert.match(html,/info@sealcleaning\.nl/);
  assert.doesNotMatch(html,/sealcleaningaanleg@gmail\.com/);
  assert.match(html,/data-contact-form/);
 }
});

test("form endpoint is left at existing recipient pending activation and delivery test",()=>{
 const config=read("js/config.js");
 assert.match(config,/formEndpoint: "https:\/\/formsubmit\.co\/ajax\/sealcleaningaanleg@gmail\.com"/);
});
