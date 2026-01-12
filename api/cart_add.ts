import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configura os headers que o seu log mostrou serem importantes
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Vary', 'trpc-accept, Accept-Encoding');

  try {
    const body = req.body;
    
    // O log mostra content-length 91 na requisição, 
    // indicando que os dados vêm no formato batch do tRPC
    const input = body?.['0']?.json || body?.json;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{
        result: { data: { json: null } }
      }]);
    }

    // Inserção no banco com os nomes exatos das colunas (case-sensitive)
    await sql`
      INSERT INTO cart_items ("productId", "quantity")
      VALUES (${productId}, 1)
    `;

    // A RESPOSTA EXATA: O tRPC precisa desse nesting: [ { result: { data: { json: ... } } } ]
    // Se faltar um desses níveis, dá o erro "Unable to transform"
    const trpcSuccessResponse = [
      {
        result: {
          data: {
            json: {
              success: true
            }
          }
        }
      }
    ];

    return res.status(200).json(trpcSuccessResponse);

  } catch (error: any) {
    console.error("Erro tRPC:", error.message);
    
    // Formato de erro que o tRPC também espera
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