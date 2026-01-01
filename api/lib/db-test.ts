// api/lib/db-test.ts
import postgres from 'postgres';

// Puxa a URL que já está configurada nas variáveis de ambiente da Vercel
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi encontrada!");
}

// Conexão direta e simples
export const sql = postgres(connectionString, { ssl: 'require' });