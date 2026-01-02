import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

// Pega a URL do banco das variáveis de ambiente da Vercel
const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Busca os produtos diretamente na tabela
    const produtos = await sql`SELECT * FROM produtos`;
    
    return res.status(200).json(produtos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}