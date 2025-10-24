import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    
    byCategory: publicProcedure
      .input(z.object({ categoria: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductsByCategory(input.categoria);
      }),
    
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        nome: z.string(),
        categoria: z.string(),
        preco: z.number(),
        precoPromocional: z.number().optional(),
        descricao: z.string().optional(),
        imagem: z.string().optional(),
        estoque: z.number().default(0),
        ativo: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createProduct(input);
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        nome: z.string().optional(),
        categoria: z.string().optional(),
        preco: z.number().optional(),
        precoPromocional: z.number().optional(),
        descricao: z.string().optional(),
        imagem: z.string().optional(),
        estoque: z.number().optional(),
        ativo: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateProduct(id, data);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  cart: router({
    list: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCartItems(input.sessionId);
      }),
    
    add: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        productId: z.number(),
        quantidade: z.number().default(1),
      }))
      .mutation(async ({ input }) => {
        return await db.addToCart(input);
      }),
    
    updateQuantity: publicProcedure
      .input(z.object({
        id: z.number(),
        quantidade: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCartItemQuantity(input.id, input.quantidade);
        return { success: true };
      }),
    
    remove: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.id);
        return { success: true };
      }),
    
    clear: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        await db.clearCart(input.sessionId);
        return { success: true };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        nome: z.string(),
        telefone: z.string(),
        endereco: z.string().optional(),
        total: z.number(),
        items: z.string(),
      }))
      .mutation(async ({ input }) => {
        const orderId = await db.createOrder(input);
        return { orderId, success: true };
      }),
    
    list: publicProcedure.query(async () => {
      return await db.getAllOrders();
    }),
  }),
});

export type AppRouter = typeof appRouter;

import { testDb } from "./test-db";

export const routers = {
  ...routers,
  "GET /api/test-db": async () => {
    const data = await testDb();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};


