import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Busca os itens e junta com a tabela de produtos para ter nome e preço
    const items = await sql`
      SELECT c.id, c.quantity, p.nome, p.preco, p.imagem 
      FROM cart_items c
      JOIN products p ON c.productid = p.id
    `;
    return res.status(200).json([{ result: { data: { json: items } } }]);
  } catch (error: any) {
    return res.status(200).json([{ error: { json: { message: error.message } } }]);
  }
}