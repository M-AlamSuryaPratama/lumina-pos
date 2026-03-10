import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url: string | null;
  store_address: string;
  store_phone: string;
  updated_at: string;
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as StoreSettings;
    },
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { store_name: string; logo_url: string | null; store_address: string; store_phone: string }) => {
      const { data: existing } = await supabase
        .from("store_settings")
        .select("id")
        .limit(1)
        .single();

      if (!existing) throw new Error("No settings row found");

      const { data, error } = await supabase
        .from("store_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
  });
}
