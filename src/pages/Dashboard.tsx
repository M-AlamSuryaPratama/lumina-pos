import { MainLayout } from "@/components/layout/MainLayout";
import { useProducts } from "@/hooks/useProducts";
import { useTransactions } from "@/hooks/useTransactions";
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { data: products = [] } = useProducts();
  const { data: transactions = [] } = useTransactions();

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total), 0);
  const totalProducts = products.length;
  const totalTransactions = transactions.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    {
      title: "Total Pendapatan",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Transaksi",
      value: totalTransactions.toString(),
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Produk",
      value: totalProducts.toString(),
      icon: Package,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Stok Rendah",
      value: lowStockProducts.toString(),
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Selamat datang di POS System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Transaksi Terbaru</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="glass-panel p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {tx.items?.length || 0} item
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(Number(tx.total))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
