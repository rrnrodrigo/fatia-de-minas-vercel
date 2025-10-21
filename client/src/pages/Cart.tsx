import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Cart() {
  const [sessionId, setSessionId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("sessionId") || "";
    setSessionId(id);
  }, []);

  const { data: cartItems = [], refetch } = trpc.cart.list.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const { data: products = [] } = trpc.products.list.useQuery();

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => refetch(),
  });

  const removeItemMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Produto removido do carrinho");
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => refetch(),
  });

  const createOrderMutation = trpc.orders.create.useMutation();

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const cartWithProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.product.precoPromocional || item.product.preco;
    return sum + price * item.quantidade;
  }, 0);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({
        id: itemId,
        quantidade: newQuantity,
      });
    } catch (error) {
      toast.error("Erro ao atualizar quantidade");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItemMutation.mutateAsync({ id: itemId });
    } catch (error) {
      toast.error("Erro ao remover item");
    }
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Por favor, preencha seu nome e telefone");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    try {
      // Criar pedido no banco de dados
      const orderItems = cartWithProducts.map((item) => ({
        productId: item.productId,
        nome: item.product?.nome || "",
        quantidade: item.quantidade,
        preco: item.product?.precoPromocional || item.product?.preco || 0,
      }));

      await createOrderMutation.mutateAsync({
        sessionId,
        nome: customerName,
        telefone: customerPhone,
        endereco: customerAddress,
        total,
        items: JSON.stringify(orderItems),
      });

      // Gerar mensagem para WhatsApp
      let message = `*Novo Pedido - Fatia de Minas*\n\n`;
      message += `*Cliente:* ${customerName}\n`;
      message += `*Telefone:* ${customerPhone}\n`;
      if (customerAddress) {
        message += `*Endereço:* ${customerAddress}\n`;
      }
      if (observations) {
        message += `*Observações:* ${observations}\n`;
      }
      message += `\n*Itens do Pedido:*\n\n`;

      cartWithProducts.forEach((item) => {
        if (item.product) {
          const price = item.product.precoPromocional || item.product.preco;
          message += `• ${item.quantidade}x ${item.product.nome}\n`;
          message += `  ${formatPrice(price)} cada\n`;
          message += `  Subtotal: ${formatPrice(price * item.quantidade)}\n\n`;
        }
      });

      message += `\n*Total: ${formatPrice(total)}*`;

      const whatsappUrl = `https://wa.me/5521997953063?text=${encodeURIComponent(message)}`;
      
      // Limpar carrinho
      await clearCartMutation.mutateAsync({ sessionId });

      // Redirecionar para WhatsApp
      window.open(whatsappUrl, "_blank");

      toast.success("Pedido enviado! Você será redirecionado para o WhatsApp");
    } catch (error) {
      toast.error("Erro ao processar pedido");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItemsCount={0} />
        <div className="container mx-auto px-4 py-32 mt-[132px] md:mt-[116px]">
          <Card className="max-w-md mx-auto text-center p-12">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Compras
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={cartItems.length} />

      {/* Botão Continuar Comprando Fixo */}
      <div className="fixed top-[120px] md:top-[132px] left-0 right-0 bg-white border-b shadow-sm z-40 py-3">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-[180px] md:mt-[190px]">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Meu Carrinho</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            {cartWithProducts.map((item) => {
              if (!item.product) return null;

              const price = item.product.precoPromocional || item.product.preco;

              return (
                <Card key={item.id}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      {/* Imagem */}
                      <img
                        src={
                          item.product.imagem
                            ? `/imagens/${item.product.imagem}`
                            : "/imagens/placeholder.jpg"
                        }
                        alt={item.product.nome}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      {/* Conteúdo */}
                      <div className="flex-1 flex flex-col gap-2">
                        <h3 className="font-bold text-base md:text-lg">
                          {item.product.nome}
                        </h3>
                        
                        {/* Preço, Quantidade e Subtotal em linha */}
                        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                          {/* Preço unitário */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Preço:</span>
                            <span className="text-primary font-bold text-sm md:text-base">
                              {formatPrice(price)}
                            </span>
                          </div>
                          
                          {/* Quantidade */}
                          <div className="flex items-center gap-1 md:gap-2 border rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantidade - 1)
                              }
                              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-l-lg"
                            >
                              <Minus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <span className="px-2 md:px-3 font-bold text-sm md:text-base">{item.quantidade}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantidade + 1)
                              }
                              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-r-lg"
                            >
                              <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Subtotal:</span>
                            <span className="font-bold text-primary text-sm md:text-lg">
                              {formatPrice(price * item.quantidade)}
                            </span>
                          </div>
                          
                          {/* Botão remover */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 md:p-2 ml-auto"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Resumo e Checkout */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(21) 99795-3063"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço de Entrega</Label>
                    <Input
                      id="address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Rua, número, complemento"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="observations">Observações (Opcional)</Label>
                    <Textarea
                      id="observations"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Alguma observação sobre o pedido? Ex: preferência de horário, ponto de referência, etc."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-sm text-gray-500">
                      Calcular no WhatsApp
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-4">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending
                    ? "Processando..."
                    : "Enviar Pedido para WhatsApp"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Ao finalizar, você será redirecionado para o WhatsApp para
                  confirmar o pedido e combinar o pagamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

