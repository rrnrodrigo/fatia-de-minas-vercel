import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../src/server/routers.js";

export default async function handler(req, res) {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

  // stream the response back to res
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(await response.text());
}
