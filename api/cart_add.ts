import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permite apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const body = req.body;
    // O tRPC pode enviar o ID dentro de json ou direto no body
    // Vamos tentar pegar de todas as formas possíveis para não dar erro
    const productId = body?.json?.productId || body?.json?.id || body?.productId || body?.id;

    if (!productId) {
      return res.status(400).json({ error: 'ID do produto não encontrado no envio' });
    }

    // Insere no banco (tabela cart_items que você criou no Neon)
    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, 1)
    `;

    // Formato exato que o seu front-end espera para dar "Sucesso"
    return res.status(200).json({
      result: {
        data: {
          json: { success: true }
        }
      }
    });
  } catch (error: any) {
    console.error("Erro no Carrinho:", error.message);
    return res.status(500).json({ 
      error: 'Erro interno', 
      details: error.message 
    });
  }
}