import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // tRPC Batch envia via POST ou GET. Vamos limpar o cabeçalho para evitar erros.
  res.setHeader('Content-Type', 'application/json');

  try {
    const body = req.body;
    // Pega o ID com segurança da estrutura 0.json do tRPC
    const input = body?.['0']?.json || body?.json || body;
    const productId = input?.productId || input?.id;

    if (!productId) {
      return res.status(200).json([{ result: { data: { json: { success: false, error: 'Sem ID' } } } }]);
    }

    // Grava no banco usando nomes de colunas minúsculos (como no seu Neon)
    // Se der erro aqui, o catch vai pegar e transformar em JSON
    await sql`
      INSERT INTO cart_items (productid, quantity)
      VALUES (${productId}, 1)
    `;

    // RESPOSTA EM LISTA [ ] - Único jeito de parar o erro "Unable to transform"
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
    console.error("ERRO:", error.message);
    // Mesmo no erro, retornamos o formato de lista para o front não travar
    return res.status(200).send(JSON.stringify([
      {
        error: { json: { message: error.message } }
      }
    ]));
  }
}