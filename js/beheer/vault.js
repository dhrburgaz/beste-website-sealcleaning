/**
 * Versleutelde lokale kluis voor de beheeromgeving. Klantgegevens, marges,
 * inkoop en offertes staan alleen op dit apparaat, versleuteld met een
 * wachtwoord (PBKDF2-SHA-256, 310.000 iteraties → AES-GCM 256). Niets gaat
 * naar een server of de openbare repository. Zonder wachtwoord is de inhoud
 * niet te herstellen — maak regelmatig een (versleutelde) back-up.
 */
const KEY = "sealBeheerVault";
const ITER = 310000;
const enc = new TextEncoder();
const dec = new TextDecoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function sealBlob(data, key, salt) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(data)));
  return { format: "seal-beheer-kluis", v: 1, kdf: "PBKDF2-SHA256", iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct), savedAt: new Date().toISOString() };
}

async function openBlob(blob, password) {
  if (!blob || blob.format !== "seal-beheer-kluis") throw new Error("Dit is geen Sealcleaning-beheerkluis.");
  const salt = unb64(blob.salt);
  const key = await deriveKey(password, salt);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(blob.iv) }, key, unb64(blob.ct));
    return { data: JSON.parse(dec.decode(plain)), key, salt };
  } catch (e) {
    throw new Error("Onjuist wachtwoord of beschadigde kluis.");
  }
}

export function vaultExists() {
  try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
}

export function readRawVault() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
}

/** @returns {Promise<{data, save:(data)=>Promise<void>, exportBlob:()=>object}>} */
export async function createVault(password, initialData) {
  if (!password || password.length < 10) throw new Error("Kies een wachtwoord van minimaal 10 tekens.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  return session(initialData, key, salt, true);
}

export async function unlockVault(password, blob = readRawVault()) {
  const { data, key, salt } = await openBlob(blob, password);
  return session(data, key, salt, false);
}

async function session(data, key, salt, persistNow) {
  let last = null;
  const api = {
    data,
    async save(next) {
      api.data = next;
      last = await sealBlob(next, key, salt);
      localStorage.setItem(KEY, JSON.stringify(last));
    },
    async exportBlob() { return last || sealBlob(api.data, key, salt); }
  };
  if (persistNow) await api.save(data);
  return api;
}

export function wipeVault() {
  try { localStorage.removeItem(KEY); } catch (e) { /* niets te wissen */ }
}

/** Back-up terugzetten: controleert eerst of het wachtwoord past. */
export async function restoreBackup(blob, password) {
  const s = await unlockVault(password, blob);
  localStorage.setItem(KEY, JSON.stringify(blob));
  return s;
}
