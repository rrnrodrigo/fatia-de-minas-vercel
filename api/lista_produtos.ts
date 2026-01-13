import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

const { POSTGRES_URL } = process.env;
const sql = postgres(POSTGRES_URL!, { ssl: 'require' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configura os headers para evitar erro de transformação no tRPC
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'trpc-accept, Accept-Encoding');

  try {
    // Buscamos os produtos renomeando as colunas para o que o Cart.tsx espera
    const produtos = await sql`
      SELECT 
        id, 
        name as nome, 
        price as preco, 
        "promoPrice" as "precoPromocional", 
        image as imagem 
      FROM products
    `;

    // O retorno PRECISA ser um Array [ ] para o modo batch do tRPC
    return res.status(200).send(JSON.stringify([
      {
        result: {
          data: {
            json: produtos
          }
        }
      }
    ]));
  } catch (error: any) {
    console.error(error);
    return res.status(200).send(JSON.stringify([
      {
        error: { json: { message: error.message } }
      }
    ]));
  }
}