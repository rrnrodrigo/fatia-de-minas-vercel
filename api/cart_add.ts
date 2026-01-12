import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const body = req.body;
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).send(JSON.stringify([{ result: { data: { json: { success: false } } } }]));
    }

    // Usando as colunas que você confirmou: "productId" e "quantity"
    await sql`
      INSERT INTO cart_items ("productId", "quantity")
      VALUES (${productId}, 1)
    `;

    // Retorno em Array [ ] - Único formato que o tRPC batch aceita
    return res.status(200).send(JSON.stringify([
      {
        result: {
          data: {
            json: { success: true }
          }
        }
      }
    ]));

  } catch (error: any) {
    console.error("Erro:", error.message);
    return res.status(200).send(JSON.stringify([{
      error: { json: { message: error.message } }
    }]));
  }
}