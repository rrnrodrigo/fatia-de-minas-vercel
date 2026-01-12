import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const body = req.body;
    
    // O tRPC envia os dados dentro de '0.json' quando está em modo batch
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{
        error: { json: { message: 'ID do produto não encontrado' } }
      }]);
    }

    // Usando os nomes exatos das suas colunas: productid e quantity
    // sessionid e createdAt/updatedAt serão preenchidos conforme sua tabela
    await sql`
      INSERT INTO cart_items (productid, quantity)
      VALUES (${productId}, 1)
    `;

    // RESPOSTA EM ARRAY: Obrigatório para tRPC com ?batch=1
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
    // Retorna erro no formato que o tRPC entende para não travar o site
    return res.status(200).json([{
      error: { json: { message: error.message } }
    }]);
  }
}