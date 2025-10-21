import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Upload, ImagePlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProductForm {
  id?: number;
  nome: string;
  categoria: string;
  preco: string;
  precoPromocional: string;
  descricao: string;
  imagem: string;
  estoque: string;
  ativo: boolean;
}

const emptyForm: ProductForm = {
  nome: "",
  categoria: "Queijos",
  preco: "",
  precoPromocional: "",
  descricao: "",
  imagem: "",
  estoque: "0",
  ativo: true,
};

export default function Admin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductForm>(emptyForm);

  const { data: products = [], refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingProduct(emptyForm);
      toast.success("Produto criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar produto"),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingProduct(emptyForm);
      toast.success("Produto atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar produto"),
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Produto excluído com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir produto"),
  });

  const categories = ["Queijos", "Doces", "Bebidas", "Embutidos", "Biscoitos Finos", "Mercearia"];

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id,
      nome: product.nome,
      categoria: product.categoria,
      preco: (product.preco / 100).toFixed(2),
      precoPromocional: product.precoPromocional
        ? (product.precoPromocional / 100).toFixed(2)
        : "",
      descricao: product.descricao || "",
      imagem: product.imagem || "",
      estoque: product.estoque.toString(),
      ativo: product.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleImageUpload = async (file: File) => {
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    try {
      // Criar preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Preparar nome do arquivo
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const fileName = `produto_${timestamp}.${extension}`;

      // Aqui você precisará fazer o upload real para o servidor
      // Por enquanto, vamos apenas salvar o nome do arquivo
      setEditingProduct({ ...editingProduct, imagem: fileName });
      
      toast.success("Imagem carregada! Lembre-se de salvar o produto.");
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar imagem");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const preco = Math.round(parseFloat(editingProduct.preco) * 100);
    const precoPromocional = editingProduct.precoPromocional
      ? Math.round(parseFloat(editingProduct.precoPromocional) * 100)
      : undefined;

    const data = {
      nome: editingProduct.nome,
      categoria: editingProduct.categoria,
      preco,
      precoPromocional,
      descricao: editingProduct.descricao || undefined,
      imagem: editingProduct.imagem || undefined,
      estoque: parseInt(editingProduct.estoque),
      ativo: editingProduct.ativo,
    };

    if (editingProduct.id) {
      await updateMutation.mutateAsync({ id: editingProduct.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n").slice(1); // Skip header

    for (const line of lines) {
      if (!line.trim()) continue;

      const [id, nome, categoria, preco, precoPromocional, descricao, imagem, estoque, ativo] =
        line.split(",");

      try {
        await createMutation.mutateAsync({
          nome: nome.trim(),
          categoria: categoria.trim(),
          preco: parseInt(preco.trim()),
          precoPromocional: precoPromocional.trim() ? parseInt(precoPromocional.trim()) : undefined,
          descricao: descricao.trim() || undefined,
          imagem: imagem.trim() || undefined,
          estoque: parseInt(estoque.trim()),
          ativo: ativo.trim().toLowerCase() === "true",
        });
      } catch (error) {
        console.error("Erro ao importar produto:", error);
      }
    }

    toast.success("Produtos importados com sucesso!");
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 mt-[132px] md:mt-[116px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Administração de Produtos</h1>
          <div className="flex gap-2">
            <label htmlFor="csv-import">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </span>
              </Button>
            </label>
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button
              onClick={() => {
                setEditingProduct(emptyForm);
                setIsDialogOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={
                      product.imagem
                        ? `/imagens/${product.imagem}`
                        : "/imagens/placeholder.jpg"
                    }
                    alt={product.nome}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{product.nome}</h3>
                        <p className="text-sm text-gray-600">{product.categoria}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.descricao}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Preço</p>
                        <p className="font-bold">{formatPrice(product.preco)}</p>
                      </div>
                      {product.precoPromocional && (
                        <div>
                          <p className="text-xs text-gray-500">Preço Promocional</p>
                          <p className="font-bold text-primary">
                            {formatPrice(product.precoPromocional)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Estoque</p>
                        <p className="font-bold">{product.estoque} un.</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p
                          className={`font-bold ${
                            product.ativo ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {product.ativo ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog de Edição/Criação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct.id ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={editingProduct.nome}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, nome: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={editingProduct.categoria}
                onValueChange={(value) =>
                  setEditingProduct({ ...editingProduct, categoria: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preco">Preço (R$) *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={editingProduct.preco}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, preco: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="precoPromocional">Preço Promocional (R$)</Label>
                <Input
                  id="precoPromocional"
                  type="number"
                  step="0.01"
                  value={editingProduct.precoPromocional}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      precoPromocional: e.target.value,
                    })
                  }
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={editingProduct.descricao}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, descricao: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imagem">Imagem do Produto</Label>
              
              {/* Área de Upload com Drag & Drop */}
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(file);
                  } else {
                    toast.error("Por favor, selecione apenas arquivos de imagem");
                  }
                }}
              >
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                
                {uploadedImage || editingProduct.imagem ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage || `/imagens/${editingProduct.imagem}`}
                      alt="Preview"
                      className="mx-auto max-h-40 rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      {editingProduct.imagem || "Imagem carregada"}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedImage(null);
                        setEditingProduct({ ...editingProduct, imagem: "" });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remover Imagem
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImagePlus className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Arraste e solte uma imagem aqui ou
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("imageUpload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Imagem
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Formatos aceitos: JPG, PNG, JPEG (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
              
              {/* Campo oculto para nome da imagem */}
              <Input
                type="hidden"
                value={editingProduct.imagem}
              />
            </div>

            <div>
              <Label htmlFor="estoque">Estoque *</Label>
              <Input
                id="estoque"
                type="number"
                value={editingProduct.estoque}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, estoque: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={editingProduct.ativo}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, ativo: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="ativo" className="cursor-pointer">
                Produto Ativo
              </Label>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingProduct.id ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

