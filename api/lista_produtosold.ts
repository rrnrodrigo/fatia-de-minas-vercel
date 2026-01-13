import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

// Pegamos a URL do banco das variáveis de ambiente
const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Busca os produtos no banco
    const produtos = await sql`SELECT * FROM products`;

    // Retorna no formato que o tRPC (seu frontend) espera
    return res.status(200).json({
      result: {
        data: {
          json: produtos
        }
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ 
      error: 'Erro ao buscar produtos',
      details: error.message 
    });
  }
}
