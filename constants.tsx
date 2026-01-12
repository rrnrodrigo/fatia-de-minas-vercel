
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nome: 'Queijo Canastra Real',
    categoria: 'Queijos',
    preco: 8990,
    precoPromocional: 7500,
    descricao: 'Tradicional queijo da Serra da Canastra, maturado artesanalmente por 30 dias.',
    imagem: 'https://images.unsplash.com/photo-1528279027-68f0d7fce9f1?auto=format&fit=crop&q=80&w=400',
    estoque: 15,
    ativo: true
  },
  {
    id: '2',
    nome: 'Doce de Leite Viçosa',
    categoria: 'Doces',
    preco: 3500,
    descricao: 'O premiado doce de leite mineiro, textura cremosa e sabor inigualável.',
    imagem: 'https://images.unsplash.com/photo-1590481075204-635201389808?auto=format&fit=crop&q=80&w=400',
    estoque: 20,
    ativo: true
  },
  {
    id: '3',
    nome: 'Cachaça Artesanal',
    categoria: 'Bebidas',
    preco: 12000,
    precoPromocional: 9800,
    descricao: 'Envelhecida em barris de carvalho por 5 anos, sabor suave e amadeirado.',
    imagem: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    estoque: 8,
    ativo: true
  },
  {
    id: '4',
    nome: 'Salame tipo Italiano',
    categoria: 'Embutidos',
    preco: 4500,
    descricao: 'Produção artesanal com temperos selecionados da serra.',
    imagem: 'https://images.unsplash.com/photo-1623961990059-28355e22c812?auto=format&fit=crop&q=80&w=400',
    estoque: 12,
    ativo: true
  },
  {
    id: '5',
    nome: 'Goiabada Cascão',
    categoria: 'Doces',
    preco: 2200,
    descricao: 'Feita no tacho de cobre com pedaços reais da fruta.',
    imagem: 'https://images.unsplash.com/photo-1599447298501-f896b0b533a6?auto=format&fit=crop&q=80&w=400',
    estoque: 30,
    ativo: true
  },
  {
    id: '6',
    nome: 'Biscoito de Polvilho',
    categoria: 'Biscoitos Finos',
    preco: 1850,
    descricao: 'Crocante, leve e com o verdadeiro gostinho da fazenda.',
    imagem: 'https://images.unsplash.com/photo-1621244300465-385055b80459?auto=format&fit=crop&q=80&w=400',
    estoque: 50,
    ativo: true
  }
];

export const CATEGORIES = [
  { id: 'queijos', name: 'Queijos', icon: '🧀' },
  { id: 'doces', name: 'Doces', icon: '🍯' },
  { id: 'bebidas', name: 'Bebidas', icon: '🍷' },
  { id: 'embutidos', name: 'Embutidos', icon: '🥓' },
  { id: 'biscoitos', name: 'Biscoitos Finos', icon: '🍪' },
  { id: 'mercearia', name: 'Mercearia', icon: '🛒' }
];
