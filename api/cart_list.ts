import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'trpc-accept, Accept-Encoding');

  try {
    // Buscamos os itens do carrinho. 
    // O frontend espera "productId" e "quantidade" (em português no map)
    const items = await sql`
      SELECT 
        id, 
        "productId", 
        quantity as quantidade
      FROM cart_items
    `;

    // Retornamos no formato tRPC. 
    // O seu cart.tsx usa: const { data: cartItems = [] } = trpc.cart.list.useQuery()
    return res.status(200).send(JSON.stringify([{
      result: {
        data: {
          json: items || []
        }
      }
    }]));

  } catch (error: any) {
    console.error("Erro na listagem:", error.message);
    return res.status(200).send(JSON.stringify([{
      result: { data: { json: [] } }
    }]));
  }
}