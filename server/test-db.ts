import { db } from "./db";
import { produtos } from "../drizzle/schema"; // ajuste o caminho se a tabela estiver em outro lugar

export async function testDb() {
  try {
    const data = await db.select().from(produtos).limit(5);
    return data;
  } catch (error: any) {
    return { error: error.message };
  }
}
