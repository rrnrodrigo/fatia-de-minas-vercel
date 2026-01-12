import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const body = req.body;
    
    // Pega o ID do produto de dentro do formato tRPC batch
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{
        error: { json: { message: 'ID do produto não encontrado' } }
      }]);
    }

    // Usando o nome exato da sua coluna: productid
    // Nota: Usamos aspas duplas no nome da coluna para o Postgres não se confundir
    await sql`
      INSERT INTO cart_items ("productid", "quantity")
      VALUES (${productId}, 1)
    `;

    // Resposta em ARRAY [] - Essencial para o tRPC não dar erro de "transform"
    return res.status(200).json([
      {
        result: {
          data: {
            json: { success: true }
          }
        }
      }
    ]);

  } catch (error: any) {
    console.error("Erro no Banco:", error.message);
    // Retorna 200 para o tRPC entender a mensagem de erro e não travar
    return res.status(200).json([{
      error: { json: { message: error.message } }
    }]);
  }
}