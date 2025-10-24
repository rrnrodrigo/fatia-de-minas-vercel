import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Exemplo de dados estáticos (você pode depois substituir pelo banco)
    const products = [
      { id: 1, name: "Queijo Canastra", price: 49.9 },
      { id: 2, name: "Doce de Leite Viçosa", price: 19.9 },
      { id: 3, name: "Cachaça Salinas", price: 89.9 }
    ];

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos", details: error });
  }
}
