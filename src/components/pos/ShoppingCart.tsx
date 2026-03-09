import { CartItem } from "@/types/pos";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShoppingCartProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

export function ShoppingCart({
  cart,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isProcessing,
}: ShoppingCartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-96 glass-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Keranjang</h2>
            <p className="text-sm text-muted-foreground">{cart.length} item</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-50" />
            <p>Keranjang kosong</p>
            <p className="text-sm">Pilih produk untuk memulai</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product.id} className="cart-item rounded-xl">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate text-sm">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg glass-button flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 rounded-lg glass-button flex items-center justify-center disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="w-7 h-7 rounded-lg bg-destructive/20 hover:bg-destructive/30 flex items-center justify-center text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-right text-sm font-semibold text-primary">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold gradient-text">
            {formatPrice(total)}
          </span>
        </div>
        <Button
          onClick={onCheckout}
          disabled={cart.length === 0 || isProcessing}
          className="w-full h-12 checkout-button text-lg font-semibold rounded-xl border-0"
        >
          {isProcessing ? "Memproses..." : "Checkout"}
        </Button>
      </div>
    </div>
  );
}
