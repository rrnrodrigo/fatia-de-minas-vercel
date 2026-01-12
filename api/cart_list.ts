import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Força o cabeçalho correto para o tRPC não se confundir
  res.setHeader('Content-Type', 'application/json');

  try {
    const body = req.body;
    // O tRPC batch coloca os dados em '0.json'
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).send(JSON.stringify([{ 
        result: { data: { json: { success: false, error: "ID ausente" } } } 
      }]));
    }

    // Nomes das colunas exatamente como no seu banco (com aspas duplas)
    await sql`
      INSERT INTO cart_items ("productId", "quantity")
      VALUES (${productId}, 1)
    `;

    // Retorno em Array [] é OBRIGATÓRIO para tRPC batch
    const response = [{
      result: {
        data: {
          json: { success: true }
        }
      }
    }];

    return res.status(200).send(JSON.stringify(response));

  } catch (error: any) {
    console.error("Erro no banco:", error.message);
    return res.status(200).send(JSON.stringify([{
      error: { json: { message: error.message } }
    }]));
  }
}