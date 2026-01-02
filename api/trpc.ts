// api/trpc.ts

import { createHTTPHandler } from '@trpc/server/adapters/node-http';
import { appRouter } from "../src/server/routers"; 
import type { IncomingMessage, ServerResponse } from 'http';

const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext: ({ req, res }: { req: IncomingMessage, res: ServerResponse }) => ({ req, res }),
});

export default trpcHandler;