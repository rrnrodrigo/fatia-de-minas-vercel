import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../src/server/routers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = `https://dummy${req.url ?? "/api/trpc"}`;
  const r = new Request(url, {
    method: req.method,
    headers: req.headers as any,
    body: req.method === "GET" ? undefined : (req as any).body,
  });

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: r,
    router: appRouter,
    createContext: () => ({}),
  });

  res.status(response.status);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  const buf = Buffer.from(await response.arrayBuffer());
  res.send(buf);
}
