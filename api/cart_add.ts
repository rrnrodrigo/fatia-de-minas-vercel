import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Log para debug (aparece no painel da Vercel)
  console.log("Corpo recebido:", JSON.stringify(req.body));

  try {
    const body = req.body;
    
    // 2. Tenta encontrar o ID do produto dentro da estrutura de 'batch' do tRPC
    // O tRPC batch costuma enviar assim: { "0": { "json": { "productId": ... } } }
    const input = body?.['0']?.json || body?.json || body;
    const productId = input.productId || input.id;

    if (!productId) {
      return res.status(400).json([{ 
        error: 'ID do produto não encontrado',
        debug_body: body 
      }]);
    }

    // 3. Salva no banco (Certifique-se que a tabela cart_items existe)
    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, 1)
    `;

    // 4. RETORNO OBRIGATÓRIO EM ARRAY (O segredo do erro de JSON)
    // O tRPC em modo batch EXIGE que a resposta seja uma lista []
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
    console.error("Erro na API:", error.message);
    // Retorna erro no formato de array também
    return res.status(500).json([{ 
      error: 'Erro interno', 
      details: error.message 
    }]);
  }
}