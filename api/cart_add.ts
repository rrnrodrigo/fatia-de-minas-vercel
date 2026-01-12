import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir apenas POST para adicionar ao carrinho
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const body = req.body;
    
    // O tRPC pode enviar o ID de várias formas. Vamos tentar todas:
    // 1. Dentro de 0.json (comum em chamadas batch)
    // 2. Dentro de json
    // 3. Direto no body
    const productId = 
      body?.['0']?.json?.productId || 
      body?.['0']?.json?.id ||
      body?.json?.productId || 
      body?.json?.id || 
      body?.productId || 
      body?.id;

    if (!productId) {
      console.error("Corpo da requisição recebido:", JSON.stringify(body));
      return res.status(400).json({ 
        error: 'ID do produto não encontrado',
        received: body 
      });
    }

    // Insere no banco na tabela cart_items
    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, 1)
    `;

    // Resposta padrão que o tRPC espera para considerar "sucesso"
    return res.status(200).json([{
      result: {
        data: {
          json: { success: true }
        }
      }
    }]);
  } catch (error: any) {
    console.error("Erro no Banco:", error.message);
    return res.status(500).json({ error: error.message });
  }
}