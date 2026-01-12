// No seu api/lis_produtos.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const produtos = await sql`SELECT * FROM products`;
    
    // O tRPC espera que os dados venham dentro de 'result' -> 'data'
    return res.status(200).json({
      result: {
        data: {
          json: produtos
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}