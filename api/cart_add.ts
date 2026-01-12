import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // O tRPC envia dados via POST para adicionar
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Pegamos o ID do produto que vem do botão
    const { json } = req.body;
    const productId = json.productId || json.id;

    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, 1)
    `;

    return res.status(200).json({
      result: { data: { json: { success: true } } }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}