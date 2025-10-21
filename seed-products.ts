import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const produtosIniciais = [
  {
    nome: "Queijo Canastra Artesanal",
    categoria: "Queijos",
    preco: 8990,
    precoPromocional: 7990,
    descricao: "Queijo Canastra artesanal de sabor incomparável, produzido na Serra da Canastra com leite fresco e técnicas tradicionais. Textura cremosa e sabor marcante que desperta os sentidos.",
    imagem: "canastra2.jpeg",
    estoque: 15,
    ativo: true
  },
  {
    nome: "Queijo Minas Padrão Vialat",
    categoria: "Queijos",
    preco: 4550,
    precoPromocional: null,
    descricao: "Queijo Minas tradicional da marca Vialat, com sabor suave e textura macia. Perfeito para o café da manhã ou lanche da tarde.",
    imagem: "padrao.jpg",
    estoque: 25,
    ativo: true
  },
  {
    nome: "Provolone Temperado",
    categoria: "Queijos",
    preco: 3290,
    precoPromocional: 2990,
    descricao: "Provolone artesanal temperado com ervas especiais, oferecendo um sabor único e marcante. Ideal para tábuas de frios e aperitivos.",
    imagem: "provoletinhotemp.jpg",
    estoque: 12,
    ativo: true
  },
  {
    nome: "Doce de Leite Souvenir",
    categoria: "Doces",
    preco: 1850,
    precoPromocional: null,
    descricao: "Doce de leite cremoso e tradicional da marca Souvenir, feito com leite fresco e açúcar cristal. Sabor autêntico de Minas Gerais.",
    imagem: "docedeleitesouvenir.jpg",
    estoque: 30,
    ativo: true
  },
  {
    nome: "Bananinha Cremosa Zero Açúcar",
    categoria: "Doces",
    preco: 1290,
    precoPromocional: null,
    descricao: "Bananinha cremosa sem adição de açúcar, mantendo todo o sabor natural da banana. Opção saudável e deliciosa para quem cuida da alimentação.",
    imagem: "ZeroAcucar.jpeg",
    estoque: 20,
    ativo: true
  },
  {
    nome: "Cachaça de Milho Original D'Minas",
    categoria: "Bebidas",
    preco: 6500,
    precoPromocional: 5800,
    descricao: "Cachaça artesanal de milho da marca Original D'Minas, com sabor suave e aroma marcante. Produzida com milho selecionado e processo tradicional.",
    imagem: "milho2.jpeg",
    estoque: 8,
    ativo: true
  },
  {
    nome: "Linguiça Artesanal Temperada",
    categoria: "Embutidos",
    preco: 2890,
    precoPromocional: null,
    descricao: "Linguiça artesanal temperada com especiarias selecionadas, oferecendo sabor intenso e textura perfeita. Ideal para churrascos e refeições especiais.",
    imagem: "linguiça3.jpg",
    estoque: 18,
    ativo: true
  },
  {
    nome: "Manteiga com Sal Belo Monte",
    categoria: "Mercearia",
    preco: 2490,
    precoPromocional: 2250,
    descricao: "Manteiga cremosa com sal da marca Belo Monte, produzida com leite fresco de vacas criadas em pasto. Sabor autêntico e qualidade superior.",
    imagem: "manteigabelomonte.jpeg",
    estoque: 22,
    ativo: true
  },
  {
    nome: "Requeijão Cremoso Souvenir",
    categoria: "Mercearia",
    preco: 1680,
    precoPromocional: null,
    descricao: "Requeijão cremoso da marca Souvenir, com textura aveludada e sabor suave. Perfeito para pães, biscoitos e receitas diversas.",
    imagem: "requeijãocremoso2.jpg",
    estoque: 28,
    ativo: true
  },
  {
    nome: "Requeijão Cremoso Vaidosa",
    categoria: "Mercearia",
    preco: 1490,
    precoPromocional: null,
    descricao: "Requeijão cremoso da marca Vaidosa, com sabor tradicional e textura cremosa. Ideal para o café da manhã e lanches.",
    imagem: "vaidosatemeperado.PNG",
    estoque: 35,
    ativo: true
  },
  {
    nome: "Queijo Provolone Premium",
    categoria: "Queijos",
    preco: 4200,
    precoPromocional: 3890,
    descricao: "Queijo Provolone premium de sabor intenso e textura firme. Maturado por tempo ideal para desenvolver todo seu potencial de sabor.",
    imagem: "Prov4.jpg",
    estoque: 10,
    ativo: true
  }
];

async function seed() {
  console.log("🌱 Iniciando seed de produtos...");
  
  try {
    for (const produto of produtosIniciais) {
      await db.insert(products).values(produto);
      console.log(`✅ Produto adicionado: ${produto.nome}`);
    }
    console.log("✨ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
