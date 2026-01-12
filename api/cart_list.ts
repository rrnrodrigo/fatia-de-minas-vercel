import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Busca os produtos que estão no carrinho cruzando com a tabela de produtos
    const items = await sql`
      SELECT c.id, c.quantity, p.name, p.price, p.image 
      FROM cart_items c
      JOIN products p ON c.productid = p.id
    `;

    // Retorno obrigatório em ARRAY para o tRPC Batch
    return res.status(200).json([{
      result: {
        data: {
          json: items
        }
      }
    }]);
  } catch (error: any) {
    return res.status(200).json([{ error: { json: { message: error.message } } }]);
  }
}