import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, CartItem } from "@/types/pos";
import { toast } from "sonner";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          items:transaction_items(
            *,
            product:products(*)
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cart: CartItem[]) => {
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({ total })
        .select()
        .single();
      
      if (txError) throw txError;
      
      const items = cart.map((item) => ({
        transaction_id: transaction.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }));
      
      const { error: itemsError } = await supabase
        .from("transaction_items")
        .insert(items);
      
      if (itemsError) throw itemsError;
      
      for (const item of cart) {
        await supabase
          .from("products")
          .update({ stock: item.product.stock - item.quantity })
          .eq("id", item.product.id);
      }
      
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Transaksi berhasil! 🎉");
    },
    onError: () => {
      toast.error("Gagal memproses transaksi");
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      // Delete items first (foreign key)
      const { error: itemsErr } = await supabase
        .from("transaction_items")
        .delete()
        .eq("transaction_id", transactionId);
      if (itemsErr) throw itemsErr;

      const { error: txErr } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);
      if (txErr) throw txErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaksi berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus transaksi");
    },
  });
}

export function useClearAllTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error: itemsErr } = await supabase
        .from("transaction_items")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all
      if (itemsErr) throw itemsErr;

      const { error: txErr } = await supabase
        .from("transactions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all
      if (txErr) throw txErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Semua history transaksi berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus history");
    },
  });
}
