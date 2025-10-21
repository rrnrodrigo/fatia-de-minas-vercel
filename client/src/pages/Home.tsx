import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Truck, CreditCard, MessageCircle, Shield, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Queijos"]));

  // Gerar ou recuperar sessionId
  useEffect(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("sessionId", id);
    }
    setSessionId(id);
  }, []);

  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { data: cartItems = [] } = trpc.cart.list.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );
  const addToCartMutation = trpc.cart.add.useMutation();

  const heroSlides = [
    {
      title: "Sabores Autênticos de Minas Gerais",
      subtitle: "Queijos, doces e iguarias direto dos produtores mineiros",
      image: "/imagens/canastra2.jpeg",
      cta: "Compre Agora",
    },
    {
      title: "Queijos Artesanais Selecionados",
      subtitle: "Tradição e qualidade em cada fatia",
      image: "/imagens/Prov4.jpg",
      cta: "Ver Queijos",
    },
    {
      title: "Doces Caseiros de Minas",
      subtitle: "O verdadeiro sabor mineiro na sua mesa",
      image: "/imagens/docedeleitesouvenir.jpg",
      cta: "Descobrir Doces",
    },
  ];

  const benefits = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Parcele em 6x",
      description: "Sem juros no cartão",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Frete Grátis",
      description: "Compras acima de R$220",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Atendimento",
      description: "Via WhatsApp",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Produtos Selecionados",
      description: "Qualidade garantida",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Site Seguro",
      description: "Compre com segurança",
    },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Os queijos são excepcionais! Sabor autêntico de Minas Gerais. Recomendo muito!",
      rating: 5,
    },
    {
      name: "João Santos",
      text: "Atendimento excelente e produtos fresquinhos. A entrega foi super rápida!",
      rating: 5,
    },
    {
      name: "Ana Costa",
      text: "Melhor doce de leite que já provei! Qualidade incomparável.",
      rating: 5,
    },
  ];

  const categories = ["Queijos", "Doces", "Bebidas", "Embutidos", "Biscoitos Finos", "Mercearia"];

  const handleAddToCart = async (productId: number) => {
    if (!sessionId) {
      toast.error("Erro ao adicionar ao carrinho");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        sessionId,
        productId,
        quantidade: 1,
      });
      toast.success("Produto adicionado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho");
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-[120px] md:pt-[132px]">
      <Header cartItemsCount={cartItems.length} />

      {/* Hero Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-fade-in">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-bold rounded-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Controles do Carrossel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Benefits - Carrossel horizontal no mobile */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-primary mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-base mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          {/* Mobile: Carrossel horizontal */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm min-w-[140px]"
                >
                  <div className="text-primary mb-2">{benefit.icon}</div>
                  <h3 className="font-bold text-sm mb-1 whitespace-nowrap">{benefit.title}</h3>
                  <p className="text-xs text-gray-600 whitespace-nowrap">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Nossos Produtos
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Carregando produtos...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryProducts = products.filter((p) => p.categoria === category);
                if (categoryProducts.length === 0) return null;

                const isExpanded = expandedCategories.has(category);

                return (
                  <div key={category} id={category.toLowerCase().replace(/\s+/g, "")}>
                    <button
                      onClick={() => toggleCategory(category)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {category === "Queijos" && "🧀"}
                          {category === "Doces" && "🍯"}
                          {category === "Bebidas" && "🍷"}
                          {category === "Embutidos" && "🥓"}
                          {category === "Biscoitos Finos" && "🍪"}
                          {category === "Mercearia" && "🛒"}
                        </span>
                        <h3 className="text-2xl font-bold">{category}</h3>
                        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                          {categoryProducts.length} produtos
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 animate-fade-in">
                        {categoryProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            {...product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Receba Promoções Exclusivas!
          </h2>
          <p className="text-lg mb-8">
            Inscreva-se e receba nossas novidades e promoções!
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Digite seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 font-bold">
              Enviar
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Button Flutuante */}
      <a
        href="https://wa.me/5521997953063"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      </a>
    </div>
  );
}

