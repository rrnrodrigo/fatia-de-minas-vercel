import { ShoppingBag, Instagram, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

interface HeaderProps {
  cartItemsCount?: number;
}

export default function Header({ cartItemsCount = 0 }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Queijos", icon: "🧀", id: "queijos" },
    { name: "Doces", icon: "🍯", id: "doces" },
    { name: "Bebidas", icon: "🍷", id: "bebidas" },
    { name: "Embutidos", icon: "🥓", id: "embutidos" },
    { name: "Biscoitos Finos", icon: "🍪", id: "biscoitos" },
    { name: "Mercearia", icon: "🛒", id: "mercearia" },
  ];

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    e.preventDefault();
    const element = document.getElementById(categoryId);
    if (element) {
      // Rolar até a seção
      const headerHeight = 140; // Altura aproximada do header fixo
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Expandir categoria automaticamente após um pequeno delay
      setTimeout(() => {
        const button = element.querySelector('button');
        if (button && button.getAttribute('aria-expanded') === 'false') {
          button.click();
        }
      }, 600);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/98 backdrop-blur-sm shadow-md"
      }`}
    >
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center">
                <img
                  src="/imagens/logo.png"
                  alt="Fatia de Minas"
                  className="h-10 md:h-12 w-auto"
                />
              </a>
            </Link>

            {/* WhatsApp - Desktop */}
            <a
              href="https://wa.me/5521997953063"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">(21) 99795-3063</span>
            </a>

            {/* Ícones da direita */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* WhatsApp - Mobile */}
              <a
                href="https://wa.me/5521997953063"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              
              {/* Instagram */}
              <a
                href="https://instagram.com/fatiademinas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
              {/* Sacola com contador */}
              <Link href="/carrinho">
                <a className="relative text-gray-700 hover:text-primary transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de Categorias - Sempre visível e centralizado no mobile */}
      <nav className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/10">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center md:justify-center gap-2 md:gap-8 py-2 md:py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`#${category.id}`}
                onClick={(e) => handleCategoryClick(e, category.id)}
                className="flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-white/80 transition-all group min-w-[60px] md:min-w-0"
              >
                <span className="text-lg md:text-2xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <span className="text-[9px] md:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors text-center leading-tight">
                  {category.name.replace(' ', '\u00A0')}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

