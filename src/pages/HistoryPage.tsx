import { MainLayout } from "@/components/layout/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { Receipt } from "lucide-react";

export default function HistoryPage() {
  const { data: transactions = [], isLoading } = useTransactions();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">History Transaksi</h1>
          <p className="text-muted-foreground mt-1">Riwayat semua transaksi</p>
        </div>

        <div className="glass-card">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Memuat...</div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Transaksi #{tx.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(Number(tx.total))}
                    </p>
                  </div>
                  {tx.items && tx.items.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {tx.items.map((item) => (
                        <div
                          key={item.id}
                          className="glass-panel p-3 flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                              {item.product?.image_url ? (
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">📦</div>
                              )}
                            </div>
                            <div>
                              <p className="text-foreground">{item.product?.name || "Produk"}</p>
                              <p className="text-muted-foreground text-xs">
                                {item.quantity}x @ {formatPrice(Number(item.price))}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-foreground">
                            {formatPrice(Number(item.subtotal))}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
