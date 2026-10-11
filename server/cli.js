/**
 * Beheertaken op de server.
 *   node server/cli.js create-owner <email> "<naam>"      (wachtwoord via env SEAL_NEW_PASSWORD of wordt gegenereerd)
 *   node server/cli.js create-user <email> "<naam>"
 *   node server/cli.js reset-totp <email>
 *   node server/cli.js gen-key                              (BACKUP_KEY / IP_HASH_SECRET)
 *   node server/cli.js backup
 *   node server/cli.js restore <backupmap> <nieuwe-datamap>
 *   node server/cli.js retention
 */
import { randomBytes } from "node:crypto";
import { loadConfig } from "./src/config.js";
import { openDb } from "./src/db.js";
import { createUser } from "./src/auth.js";
import { createBackup, restoreBackup, runRetention } from "./src/services.js";

const [cmd, a, b] = process.argv.slice(2);
const cfg = loadConfig();
const genPw = () => randomBytes(18).toString("base64url");

switch (cmd) {
  case "create-owner":
  case "create-user": {
    if (!a || !b) { console.error("Gebruik: create-owner <email> \"<naam>\""); process.exit(1); }
    const db = openDb(cfg.dbPath);
    const pw = process.env.SEAL_NEW_PASSWORD || genPw();
    createUser(db, { email: a, name: b, password: pw, role: cmd === "create-owner" ? "owner" : "staff" });
    console.log(`Gebruiker ${a} aangemaakt.${process.env.SEAL_NEW_PASSWORD ? "" : `\nEenmalig wachtwoord: ${pw}\nWijzig dit na het eerste inloggen; bij de eerste login stelt u tweestapsverificatie in.`}`);
    break;
  }
  case "reset-totp": {
    const db = openDb(cfg.dbPath);
    const r = db.run("UPDATE users SET totp_enabled = 0, totp_secret = NULL WHERE email = ?", String(a || "").toLowerCase());
    db.run("DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)", String(a || "").toLowerCase());
    console.log(r.changes ? "2FA gereset; bij de volgende login opnieuw instellen." : "Gebruiker niet gevonden.");
    break;
  }
  case "gen-key": console.log(randomBytes(32).toString("base64")); break;
  case "backup": console.log("Back-up gemaakt:", createBackup(openDb(cfg.dbPath), cfg)); break;
  case "restore": {
    if (!a || !b) { console.error("Gebruik: restore <backupmap> <nieuwe-datamap>"); process.exit(1); }
    console.log("Teruggezet naar:", restoreBackup(cfg, a, b), "\nStart de server met SEAL_DATA_DIR op deze map om de herstelde gegevens te gebruiken.");
    break;
  }
  case "retention": console.log("Verwijderd:", runRetention(openDb(cfg.dbPath), cfg)); break;
  default: console.log("Commando's: create-owner, create-user, reset-totp, gen-key, backup, restore, retention");
}
