import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'trpc-accept, Accept-Encoding');

  try {
    const body = req.body;
    const input = body?.['0']?.json || body?.json;
    const productId = input?.productId || input?.id;

    if (!productId) {
      throw new Error("ID do produto nao enviado");
    }

    // ADICIONADO: Gravando productId, quantity e sessionId (que o banco exige)
    await sql`
      INSERT INTO cart_items ("productId", "quantity", "sessionId")
      VALUES (${productId}, 1, 'sessao-temporaria')
    `;

    // Resposta de SUCESSO formatada para o tRPC
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
    console.error("Erro interno:", error.message);
    
    // Retornamos o erro no formato que o tRPC entende para não travar o site
    return res.status(200).send(JSON.stringify([
      {
        error: {
          json: {
            message: error.message,
            code: -32603
          }
        }
      }
    ]));
  }
}