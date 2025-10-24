import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers";

export const runtime = "edge";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
