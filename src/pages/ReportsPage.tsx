import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, FileSpreadsheet, TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const { data: transactions = [] } = useTransactions();
  const { data: products = [] } = useProducts();
  const { data: settings } = useStoreSettings();

  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const d = t.created_at.slice(0, 10);
      return d >= startDate && d <= endDate;
    });
  }, [transactions, startDate, endDate]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  // Aggregate sold items
  const soldItems = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>();
    filtered.forEach((t) =>
      t.items?.forEach((item) => {
        const name = item.product?.name ?? "Unknown";
        const existing = map.get(name) || { name, qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += item.subtotal;
        map.set(name, existing);
      })
    );
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const totalOmzet = filtered.reduce((s, t) => s + Number(t.total), 0);
  const totalTransactions = filtered.length;
  const totalItemsSold = soldItems.reduce((s, i) => s + i.qty, 0);

  const storeName = settings?.store_name || "POS System";
  const storeAddress = settings?.store_address || "";
  const storePhone = settings?.store_phone || "";

  const handlePrint = () => window.print();

  const handleExportExcel = async () => {
    const XLSX = await import("xlsx");
    const wsData = [
      ["Laporan Keuangan - " + storeName],
      [storeAddress],
      [storePhone],
      [],
      ["Periode", startDate + " s/d " + endDate],
      ["Total Omzet", totalOmzet],
      ["Total Transaksi", totalTransactions],
      ["Total Item Terjual", totalItemsSold],
      [],
      ["Nama Produk", "Qty Terjual", "Revenue"],
      ...soldItems.map((i) => [i.name, i.qty, i.revenue]),
      [],
      ["Sisa Stok"],
      ["Nama Produk", "Stok"],
      ...products.map((p) => [p.name, p.stock]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_${startDate}_${endDate}.xlsx`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Laporan Keuangan</h1>
            <p className="text-muted-foreground text-sm mt-1">Rekapitulasi penjualan & stok</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint} className="glass-button">
              <Printer className="w-4 h-4 mr-2" /> Cetak PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel} className="glass-button">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Ekspor Excel
            </Button>
          </div>
        </div>

        {/* Date filter */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 print:hidden">
          <div className="space-y-1 flex-1">
            <Label>Dari Tanggal</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input" />
          </div>
          <div className="space-y-1 flex-1">
            <Label>Sampai Tanggal</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input" />
          </div>
        </div>

        {/* Printable report content */}
        <div id="report-content">
          {/* Print header (hidden on screen) */}
          <div className="hidden print:block text-center mb-6">
            <h1 className="text-xl font-bold">{storeName}</h1>
            {storeAddress && <p className="text-sm">{storeAddress}</p>}
            {storePhone && <p className="text-sm">{storePhone}</p>}
            <p className="text-sm mt-2">Laporan Periode: {startDate} s/d {endDate}</p>
            <hr className="mt-3" />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Omzet", value: formatPrice(totalOmzet), icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
              { label: "Total Transaksi", value: totalTransactions.toString(), icon: BarChart3, gradient: "from-blue-500 to-cyan-600" },
              { label: "Item Terjual", value: totalItemsSold.toString(), icon: TrendingUp, gradient: "from-purple-500 to-pink-600" },
              { label: "Total Produk", value: products.length.toString(), icon: Package, gradient: "from-orange-500 to-red-600" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4 print:border print:border-gray-300 print:bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground print:text-gray-600">{s.label}</p>
                    <p className="text-xl font-bold text-foreground print:text-black mt-1">{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center print:hidden`}>
                    <s.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sold items table */}
          <div className="glass-card p-4 sm:p-6 mb-6 print:border print:border-gray-300 print:bg-white">
            <h2 className="text-lg font-semibold text-foreground print:text-black mb-4">Barang Terjual</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 print:border-gray-300">
                    <th className="text-left py-2 text-muted-foreground print:text-gray-600">Produk</th>
                    <th className="text-right py-2 text-muted-foreground print:text-gray-600">Qty</th>
                    <th className="text-right py-2 text-muted-foreground print:text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {soldItems.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-8 text-muted-foreground">Tidak ada data</td></tr>
                  ) : (
                    soldItems.map((item) => (
                      <tr key={item.name} className="border-b border-white/5 print:border-gray-200">
                        <td className="py-2 text-foreground print:text-black">{item.name}</td>
                        <td className="py-2 text-right text-foreground print:text-black">{item.qty}</td>
                        <td className="py-2 text-right text-foreground print:text-black">{formatPrice(item.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current stock table */}
          <div className="glass-card p-4 sm:p-6 print:border print:border-gray-300 print:bg-white">
            <h2 className="text-lg font-semibold text-foreground print:text-black mb-4">Sisa Stok Saat Ini</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 print:border-gray-300">
                    <th className="text-left py-2 text-muted-foreground print:text-gray-600">Produk</th>
                    <th className="text-right py-2 text-muted-foreground print:text-gray-600">Stok</th>
                    <th className="text-right py-2 text-muted-foreground print:text-gray-600">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 print:border-gray-200">
                      <td className="py-2 text-foreground print:text-black">{p.name}</td>
                      <td className={`py-2 text-right ${p.stock < 10 ? "text-red-400 print:text-red-600 font-semibold" : "text-foreground print:text-black"}`}>{p.stock}</td>
                      <td className="py-2 text-right text-foreground print:text-black">{formatPrice(p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
