import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Transaction, TransactionItem } from "@/types/pos";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function ReceiptModal({ open, onClose, transaction }: ReceiptModalProps) {
  if (!transaction) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) + " " + d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md print-receipt-container">
        <DialogHeader className="print:hidden">
          <DialogTitle>Transaksi Berhasil 🎉</DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div id="receipt-content" className="bg-white text-black p-6 rounded-lg font-mono text-sm space-y-4">
          {/* Store Header */}
          <div className="text-center border-b-2 border-dashed border-gray-400 pb-4">
            <h2 className="text-xl font-bold tracking-wide">LUMINA POS</h2>
            <p className="text-xs text-gray-500 mt-1">Struk Pembayaran</p>
          </div>

          {/* Date & Transaction ID */}
          <div className="border-b border-dashed border-gray-300 pb-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal</span>
              <span>{formatDate(transaction.created_at)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">No. Transaksi</span>
              <span>{transaction.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-b border-dashed border-gray-300 pb-3 space-y-2">
            {transaction.items?.map((item: TransactionItem) => (
              <div key={item.id}>
                <div className="font-semibold">{item.product?.name ?? "Produk"}</div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{item.quantity} x {formatPrice(item.price)}</span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>TOTAL</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-3 border-t border-dashed border-gray-300">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>— Lumina POS —</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Tutup
          </Button>
          <Button className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak Struk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
