import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProductCardProps {
  id: number;
  nome: string;
  preco: number;
  precoPromocional?: number | null;
  descricao?: string | null;
  imagem?: string | null;
  estoque: number;
  onAddToCart: (productId: number) => void;
}

export default function ProductCard({
  id,
  nome,
  preco,
  precoPromocional,
  descricao,
  imagem,
  estoque,
  onAddToCart,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const hasDiscount = precoPromocional && precoPromocional < preco;
  const discountPercentage = hasDiscount
    ? Math.round(((preco - precoPromocional) / preco) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
      <div className="relative overflow-hidden bg-gray-50">
        {/* Badge de Desconto */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Badge de Estoque Baixo */}
        {estoque > 0 && estoque <= 5 && (
          <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Últimas unidades!
          </div>
        )}

        {/* Imagem do Produto */}
        <div className="aspect-square relative">
          <img
            src={imagem ? `/imagens/${imagem}` : "/imagens/placeholder.jpg"}
            alt={nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {estoque === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Esgotado</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-2 md:p-4">
        {/* Nome do Produto */}
        <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] group-hover:text-primary transition-colors">
          {nome}
        </h3>

        {/* Descrição - Ocultar no mobile */}
        {descricao && (
          <p className="hidden md:block text-sm text-gray-600 mb-3 line-clamp-2">{descricao}</p>
        )}

        {/* Preços */}
        <div className="mb-2 md:mb-4">
          {hasDiscount ? (
            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
              <span className="text-gray-400 line-through text-xs md:text-sm">
                {formatPrice(preco)}
              </span>
              <span className="text-lg md:text-2xl font-bold text-primary">
                {formatPrice(precoPromocional!)}
              </span>
            </div>
          ) : (
            <span className="text-lg md:text-2xl font-bold text-gray-900">
              {formatPrice(preco)}
            </span>
          )}
          <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">ou em até 6x sem juros</p>
        </div>

        {/* Botão de Adicionar ao Carrinho */}
        <Button
          onClick={() => onAddToCart(id)}
          disabled={estoque === 0}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 md:py-6 text-xs md:text-base rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estoque === 0 ? (
            "Esgotado"
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="hidden md:inline">Adicionar ao Carrinho</span>
              <span className="md:hidden">Adicionar</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

