import * as db from "../src/server/db";

export const config = { runtime: "edge" };

export default async function handler(): Promise<Response> {
  try {
    const conn = await db.getDb();
    if (!conn) {
      return new Response(
        JSON.stringify({ ok: false, message: "Database not available" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ ok: true, message: "DB OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e?.message ?? e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
