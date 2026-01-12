import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ajusta o cabeçalho para JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    const body = req.body;
    
    // Pega o ID do produto da estrutura que o tRPC envia
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{
        result: { data: { json: { success: false, error: 'ID não encontrado' } } }
      }]);
    }

    // AQUI O PULO DO GATO: "productId" com aspas duplas 
    // para casar com a coluna que você tem no banco
    await sql`
      INSERT INTO cart_items ("productId", "quantity")
      VALUES (${productId}, 1)
    `;

    // Resposta em Array [] para o tRPC aceitar sem erro
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
    console.error("Erro ao inserir no banco:", error.message);
    return res.status(200).json([{
      error: { json: { message: error.message } }
    }]);
  }
}