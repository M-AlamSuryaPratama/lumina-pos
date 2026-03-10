import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Store, Loader2, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [storeName, setStoreName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name);
      setLogoUrl(settings.logo_url ?? "");
      setStoreAddress(settings.store_address ?? "");
      setStorePhone(settings.store_phone ?? "");
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        store_name: storeName,
        logo_url: logoUrl || null,
        store_address: storeAddress,
        store_phone: storePhone,
      });
      toast.success("Pengaturan toko berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Pengaturan Toko</h1>

        <div className="glass-card p-6 space-y-6">
          {/* Preview */}
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-white/10 p-1" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-foreground">{storeName || "Nama Toko"}</p>
              {storeAddress && <p className="text-xs text-muted-foreground">{storeAddress}</p>}
              {storePhone && <p className="text-xs text-muted-foreground">{storePhone}</p>}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nama Toko</Label>
              <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Masukkan nama toko" className="glass-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-address" className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Alamat Toko</Label>
              <Textarea id="store-address" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} placeholder="Jl. Contoh No. 123, Kota" className="glass-input min-h-[80px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-phone" className="flex items-center gap-1"><Phone className="w-3 h-3" /> No. WhatsApp / HP</Label>
              <Input id="store-phone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} placeholder="08xxxxxxxxxx" className="glass-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-url">URL Logo Toko</Label>
              <Input id="logo-url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="glass-input" />
              <p className="text-xs text-muted-foreground">Masukkan URL gambar logo toko Anda.</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full checkout-button">
            {updateSettings.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan Pengaturan
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
