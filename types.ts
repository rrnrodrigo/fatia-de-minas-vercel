
export type Category = "Queijos" | "Doces" | "Bebidas" | "Embutidos" | "Biscoitos Finos" | "Mercearia";

export interface Product {
  id: string;
  nome: string;
  categoria: Category;
  preco: number;
  precoPromocional?: number;
  descricao: string;
  imagem: string;
  estoque: number;
  ativo: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
