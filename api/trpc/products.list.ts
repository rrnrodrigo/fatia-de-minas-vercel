import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const products = [
    { id: 1, name: "Queijo Canastra", price: 49.9 },
    { id: 2, name: "Doce de Leite Viçosa", price: 19.9 },
    { id: 3, name: "Cachaça Salinas", price: 89.9 },
  ];
  res.status(200).json(products);
}
