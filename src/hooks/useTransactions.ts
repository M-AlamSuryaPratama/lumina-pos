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
      
      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .insert({ total })
        .select()
        .single();
      
      if (txError) throw txError;
      
      // Create transaction items
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
      
      // Update stock
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
