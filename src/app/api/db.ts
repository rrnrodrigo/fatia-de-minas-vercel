import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { InsertUser, users, products, Product, InsertProduct, cartItems, CartItem, InsertCartItem, orders, InsertOrder } from "../drizzle/schema";
import { ENV } from './_core/env';
import {
  InsertUser, users,
  products, Product, InsertProduct,
  cartItems, CartItem, InsertCartItem,
  orders, InsertOrder
} from "../../drizzle/schema";


let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      // sql vem do @vercel/postgres e já usa as envs (POSTGRES_URL, etc.)
      _db = drizzle(sql);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Funções de Produtos =====

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products).where(eq(products.ativo, true));
  return result;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(categoria: string): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products).where(
    and(eq(products.categoria, categoria), eq(products.ativo, true))
  );
  return result;
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await getProductById(insertedId);
  if (!inserted) throw new Error("Failed to retrieve inserted product");
  
  return inserted;
}

export async function updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(product).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Soft delete - apenas marca como inativo
  await db.update(products).set({ ativo: false }).where(eq(products.id, id));
}

// ===== Funções de Carrinho =====

export async function getCartItems(sessionId: string): Promise<CartItem[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  return result;
}

export async function addToCart(item: InsertCartItem): Promise<CartItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verifica se o item já existe no carrinho
  const existing = await db.select().from(cartItems).where(
    and(
      eq(cartItems.sessionId, item.sessionId),
      eq(cartItems.productId, item.productId)
    )
  ).limit(1);
  
  if (existing.length > 0) {
    // Atualiza a quantidade
    const newQuantity = existing[0].quantidade + (item.quantidade || 1);
    await db.update(cartItems)
      .set({ quantidade: newQuantity })
      .where(eq(cartItems.id, existing[0].id));
    
    const updated = await db.select().from(cartItems).where(eq(cartItems.id, existing[0].id)).limit(1);
    return updated[0];
  } else {
    // Insere novo item
    const result = await db.insert(cartItems).values(item);
    const insertedId = Number(result[0].insertId);
    const inserted = await db.select().from(cartItems).where(eq(cartItems.id, insertedId)).limit(1);
    return inserted[0];
  }
}

export async function updateCartItemQuantity(id: number, quantidade: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (quantidade <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantidade }).where(eq(cartItems.id, id));
  }
}

export async function removeFromCart(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(sessionId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}

// ===== Funções de Pedidos =====

export async function createOrder(order: InsertOrder): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  return Number(result[0].insertId);
}

export async function getAllOrders(): Promise<typeof orders.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(orders);
  return result;
}

