
import React, { useState } from 'react';
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { getCheeseRecommendation } from './services/geminiService';

const formatBRL = (val: number) => (val / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Navbar: React.FC<{ cartCount: number, onOpenCart: () => void, onHome: () => void }> = ({ cartCount, onOpenCart, onHome }) => (
  <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-amber-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <button onClick={onHome} className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-6 transition-transform">F</div>
        <span className="font-serif text-2xl font-bold text-secondary hidden sm:block">Fatia de Minas</span>
      </button>

      <div className="flex items-center gap-6">
        <a href="https://wa.me/5521997953063" target="_blank" rel="noreferrer" className="text-stone-600 hover:text-green-600 font-semibold text-sm transition-colors hidden md:block">
          Fale Conosco: (21) 99795-3063
        </a>
        <button onClick={onOpenCart} className="relative p-2 text-secondary hover:bg-amber-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </nav>
);

const ProductCard: React.FC<{ product: Product, onAdd: (p: Product) => void }> = ({ product, onAdd }) => {
  const hasPromo = product.precoPromocional && product.precoPromocional < product.preco;
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img src={product.imagem} alt={product.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {hasPromo && <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">Promoção</div>}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{product.categoria}</p>
        <h3 className="font-bold text-lg mb-2 text-stone-800 leading-tight">{product.nome}</h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">{product.descricao}</p>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {hasPromo ? (
              <>
                <p className="text-stone-400 line-through text-xs font-medium">{formatBRL(product.preco)}</p>
                <p className="text-2xl font-black text-secondary">{formatBRL(product.precoPromocional!)}</p>
              </>
            ) : (
              <p className="text-2xl font-black text-stone-900">{formatBRL(product.preco)}</p>
            )}
          </div>
          <button onClick={() => onAdd(product)} className="bg-primary hover:bg-secondary text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'home' | 'cart'>('home');
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const cartTotal = cart.reduce((acc, item) => acc + ((item.product.precoPromocional || item.product.preco) * item.quantity), 0);

  const handleCheckout = () => {
    let msg = `*Novo Pedido - Fatia de Minas*\n\n`;
    cart.forEach(item => {
      const p = item.product.precoPromocional || item.product.preco;
      msg += `🧀 ${item.quantity}x ${item.product.nome} - ${formatBRL(p * item.quantity)}\n`;
    });
    msg += `\n*Total: ${formatBRL(cartTotal)}*\n\nGostaria de combinar a entrega e o pagamento!`;
    window.open(`https://wa.me/5521997953063?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const askAi = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const res = await getCheeseRecommendation(aiInput);
    setAiResponse(res);
    setAiLoading(false);
    setAiInput("");
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-primary/20">
      <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onOpenCart={() => setView('cart')} onHome={() => setView('home')} />

      {view === 'home' ? (
        <main className="pt-20">
          <section className="bg-secondary min-h-[500px] flex items-center relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Fazenda" />
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-white py-20">
              <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight leading-none">O melhor de Minas,<br/><span className="text-primary italic">na sua mesa.</span></h1>
              <p className="text-lg md:text-xl mb-10 max-w-xl text-stone-200 font-medium leading-relaxed">Queijos artesanais, doces de tacho e iguarias selecionadas diretamente dos pequenos produtores mineiros.</p>
              <button onClick={() => document.getElementById('vitrine')?.scrollIntoView({behavior:'smooth'})} className="bg-primary hover:bg-white hover:text-secondary px-10 py-5 rounded-full font-black text-lg transition-all shadow-2xl active:scale-95">Explorar Sabores</button>
            </div>
          </section>

          <section className="max-w-4xl mx-auto px-4 py-16 -mt-16 relative z-20">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-amber-100">
              <h2 className="text-3xl font-serif font-bold text-secondary mb-2">💡 Sommelier de Queijos</h2>
              <p className="text-stone-500 mb-8 font-medium">Não sabe o que escolher? Peça uma sugestão pro nosso mestre queijeiro!</p>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} 
                  placeholder="Ex: Qual queijo combina com café e doce de leite?"
                  className="flex-1 bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-medium"
                />
                <button onClick={askAi} disabled={aiLoading} className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 transition-all hover:shadow-lg">
                  {aiLoading ? "Pensando..." : "Perguntar agora"}
                </button>
              </div>
              {aiResponse && <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-stone-800 animate-fade-in leading-relaxed italic">" {aiResponse} "</div>}
            </div>
          </section>

          <section id="vitrine" className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2">Nossa Vitrine</h2>
                <p className="text-stone-500 font-medium">Produtos frescos e artesanais selecionados com carinho.</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} className="whitespace-nowrap px-4 py-2 rounded-full border border-stone-200 text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">{cat.name}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOCK_PRODUCTS.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
            </div>
          </section>
        </main>
      ) : (
        <main className="pt-32 max-w-4xl mx-auto px-4 pb-20">
          <button onClick={() => setView('home')} className="mb-10 flex items-center gap-2 text-stone-500 hover:text-primary font-bold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            Voltar para a vitrine
          </button>
          
          <h1 className="text-5xl font-serif font-bold mb-12 text-stone-900">Seu Carrinho</h1>

          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-stone-100 shadow-sm">
              <p className="text-6xl mb-6">🛒</p>
              <h2 className="text-2xl font-bold mb-6 text-stone-400 uppercase tracking-widest">Seu carrinho está vazio</h2>
              <button onClick={() => setView('home')} className="bg-primary text-white px-10 py-4 rounded-full font-black shadow-lg">Começar a comprar</button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.product.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
                  <img src={item.product.imagem} className="w-24 h-24 object-cover rounded-2xl shadow-inner" alt={item.product.nome} />
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-stone-800">{item.product.nome}</h3>
                    <p className="text-primary font-black">{formatBRL(item.product.precoPromocional || item.product.preco)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-2xl border border-stone-100">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-secondary">-</button>
                    <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-secondary">+</button>
                  </div>
                  <button onClick={() => setCart(c => c.filter(i => i.product.id !== item.product.id))} className="text-red-300 hover:text-red-500 transition-colors p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              
              <div className="mt-12 p-10 bg-secondary text-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 border-4 border-amber-900/10">
                <div className="text-center md:text-left">
                  <p className="text-amber-200/60 font-black uppercase tracking-widest text-xs mb-2">Total estimado</p>
                  <p className="text-6xl font-serif font-bold">{formatBRL(cartTotal)}</p>
                  <p className="mt-3 text-amber-100/50 text-sm font-medium">Pagamento e frete a combinar no WhatsApp.</p>
                </div>
                <button onClick={handleCheckout} className="bg-primary text-white w-full md:w-auto px-12 py-6 rounded-2xl font-black text-xl hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-4 shadow-2xl group active:scale-95">
                  Finalizar Pedido
                  <svg xmlns="http://www.w3.org/2000/slice" className="h-6 w-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      <footer className="bg-stone-900 text-stone-500 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <h3 className="text-white font-serif font-bold text-3xl mb-6 italic">Fatia de Minas</h3>
            <p className="max-w-md text-stone-400 leading-relaxed font-medium">Levando a tradição, o sabor e o carinho do interior mineiro para todo o Brasil. Qualidade garantida de quem entende de roça.</p>
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Atendimento</h4>
            <p className="text-sm mb-2">WhatsApp: <span className="text-green-500 font-bold">(21) 99795-3063</span></p>
            <p className="text-sm">Email: contato@fatiademinas.com.br</p>
          </div>
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Horário</h4>
            <p className="text-sm">Segunda a Sábado: 08h às 19h</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
