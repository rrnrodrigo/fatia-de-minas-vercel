import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as db from "../src/server/db";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const conn = await db.getDb();
    if (!conn) return res.status(500).json({ ok: false, message: "DB indisponível" });
    return res.json({ ok: true, message: "DB OK" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? String(e) });
  }
}
