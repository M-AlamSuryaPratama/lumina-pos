import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/hooks/useCart";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { MainLayout } from "@/components/layout/MainLayout";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CategoryFilter } from "@/components/pos/CategoryFilter";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { Transaction } from "@/types/pos";

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const createTransaction = useCreateTransaction();
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    // Build transaction object with items before clearing cart
    const items = cart.map((item) => ({
      id: "",
      transaction_id: "",
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity,
      created_at: new Date().toISOString(),
      product: item.product,
    }));
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const result = await createTransaction.mutateAsync(cart);
    clearCart();

    setReceiptTransaction({
      id: result.id,
      total,
      created_at: result.created_at,
      items,
    });
    setShowReceipt(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-8rem)]">
        {/* Products Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">POS Kasir</h1>
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <ProductGrid
            products={filteredProducts}
            loading={productsLoading}
            onAddToCart={addToCart}
          />
        </div>

        {/* Cart Section */}
        <ShoppingCart
          cart={cart}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          isProcessing={createTransaction.isPending}
        />
      </div>

      <ReceiptModal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={receiptTransaction}
      />
    </MainLayout>
  );
}
