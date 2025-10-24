import * as db from "../../../server/db";

export const runtime = "edge";

export async function GET() {
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
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

