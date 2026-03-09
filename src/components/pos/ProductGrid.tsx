import { Product } from "@/types/pos";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, loading, onAddToCart }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto custom-scrollbar flex-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <Skeleton className="w-full aspect-square rounded-xl mb-3 bg-white/10" />
            <Skeleton className="h-5 w-3/4 bg-white/10 mb-2" />
            <Skeleton className="h-4 w-1/2 bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Tidak ada produk tersedia</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto custom-scrollbar flex-1 pb-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => product.stock > 0 && onAddToCart(product)}
          disabled={product.stock <= 0}
          className="product-card text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white/5">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                📦
              </div>
            )}
            {product.stock > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
            )}
          </div>
          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
          <p className="text-sm text-primary font-semibold">{formatPrice(product.price)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Stok: {product.stock}
          </p>
        </button>
      ))}
    </div>
  );
}
