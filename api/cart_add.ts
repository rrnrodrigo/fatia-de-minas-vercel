import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Define o charset exatamente como o seu header mostrou
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const body = req.body;
    // O tRPC batch 1 envia os dados indexados por "0"
    const input = body?.['0']?.json || body?.json;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{
        result: { data: { json: { success: false, message: "ID ausente" } } }
      }]);
    }

    // Grava no banco usando aspas duplas no productId
    await sql`
      INSERT INTO cart_items ("productId", "quantity")
      VALUES (${productId}, 1)
    `;

    // RESPOSTA FORMATADA PARA TRPC BATCH
    // Esta estrutura de array com result/data/json é sagrada para o tRPC
    return res.status(200).json([
      {
        result: {
          data: {
            json: { 
              success: true,
              id: productId 
            }
          }
        }
      }
    ]);

  } catch (error: any) {
    console.error("Erro no Banco:", error.message);
    // Mesmo no erro, retorna status 200 com a estrutura de erro do tRPC
    return res.status(200).json([
      {
        error: {
          json: {
            message: error.message,
            code: -32603
          }
        }
      }
    ]);
  }
}