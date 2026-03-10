import { MainLayout } from "@/components/layout/MainLayout";
import { useProducts } from "@/hooks/useProducts";
import { useTransactions } from "@/hooks/useTransactions";
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: products = [] } = useProducts();
  const { data: transactions = [] } = useTransactions();

  const today = new Date().toISOString().slice(0, 10);

  const todayRevenue = useMemo(
    () => transactions.filter((t) => t.created_at.slice(0, 10) === today).reduce((s, t) => s + Number(t.total), 0),
    [transactions, today]
  );

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total), 0);
  const totalProducts = products.length;
  const totalTransactions = transactions.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const stats = [
    { title: "Pendapatan Hari Ini", value: formatPrice(todayRevenue), icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
    { title: "Total Pendapatan", value: formatPrice(totalRevenue), icon: TrendingUp, gradient: "from-blue-500 to-cyan-600" },
    { title: "Total Transaksi", value: totalTransactions.toString(), icon: ShoppingCart, gradient: "from-purple-500 to-pink-600" },
    { title: "Stok Rendah", value: lowStockProducts.toString(), icon: Package, gradient: "from-orange-500 to-red-600" },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Selamat datang di POS System</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="glass-card p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 truncate">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0 ml-2`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Transaksi Terbaru</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="glass-panel p-3 sm:p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{tx.items?.length || 0} item</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-primary ml-2 shrink-0">{formatPrice(Number(tx.total))}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
