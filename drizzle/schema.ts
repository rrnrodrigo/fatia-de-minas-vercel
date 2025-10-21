import { mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Produtos da Fatia de Minas
 */
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  nome: varchar("nome", { length: 255 }).notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  preco: int("preco").notNull(), // preço em centavos
  precoPromocional: int("precoPromocional"), // preço promocional em centavos (opcional)
  descricao: text("descricao"),
  imagem: varchar("imagem", { length: 255 }),
  estoque: int("estoque").default(0).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Itens do carrinho de compras
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(), // ID da sessão do usuário
  productId: int("productId").notNull(),
  quantidade: int("quantidade").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Pedidos realizados
 */
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  endereco: text("endereco"),
  total: int("total").notNull(), // total em centavos
  status: varchar("status", { length: 50 }).default("pendente").notNull(),
  items: text("items").notNull(), // JSON com os itens do pedido
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

