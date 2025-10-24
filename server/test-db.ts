import { db } from "./db";

export async function testDb() {
  try {
    // Faz uma consulta simples só para testar a conexão
    await db.execute("SELECT 1");
    return { success: true, message: "Conexão com banco de dados funcionando!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao conectar com o banco de dados." };
  }
}