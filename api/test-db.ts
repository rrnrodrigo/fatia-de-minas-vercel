import * as db from "../src/server/db.js";

export default async function handler(req, res) {
  try {
    const conn = await db.getDb();
    if (!conn) {
      res.status(500).json({ ok: false, message: "Banco não conectado" });
    } else {
      res.json({ ok: true, message: "DB OK" });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
