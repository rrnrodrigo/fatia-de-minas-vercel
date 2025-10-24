INSTRUÇÕES DE MERGE (rápido):
1) Copie a pasta 'api' para a raiz do projeto (do lado de package.json).
2) Substitua 'src/server/routers.ts' e 'src/server/db.ts' pelos fornecidos.
3) Adicione 'vercel.json' na raiz do projeto.
4) Instale dependências necessárias:
   npm i @vercel/postgres drizzle-orm @trpc/server
5) Deploy na Vercel. Teste:
   /api/test-db
   /api/trpc/products.list
