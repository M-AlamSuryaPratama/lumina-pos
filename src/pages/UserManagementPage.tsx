import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "@/hooks/useAuth";
import { Users, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserRole {
  id: string;
  user_id: string;
  email: string;
  role: AppRole;
  created_at: string;
}

const roleLabels: Record<AppRole, string> = {
  kasir: "Kasir",
  admin: "Admin",
  super_admin: "Super Admin",
};

const roleColors: Record<AppRole, string> = {
  kasir: "from-blue-500 to-cyan-500",
  admin: "from-purple-500 to-pink-500",
  super_admin: "from-orange-500 to-red-500",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc("get_all_user_roles");
    if (error) {
      toast.error("Gagal memuat data user");
      console.error(error);
    } else {
      setUsers((data as UserRole[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setUpdatingId(userId);
    const { error } = await supabase.rpc("update_user_role", {
      _user_id: userId,
      _new_role: newRole,
    });
    if (error) {
      toast.error("Gagal mengubah role");
      console.error(error);
    } else {
      toast.success("Role berhasil diubah");
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdatingId(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Kelola role dan hak akses user</p>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Belum ada user terdaftar</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Email</div>
                <div className="col-span-3">Role Saat Ini</div>
                <div className="col-span-4">Ubah Role</div>
              </div>
              {/* Rows */}
              {users.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-5 text-foreground font-medium truncate">
                    {u.email}
                  </div>
                  <div className="col-span-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground bg-gradient-to-r ${roleColors[u.role]}`}
                    >
                      <Shield className="w-3 h-3" />
                      {roleLabels[u.role]}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <div className="relative">
                      {updatingId === u.user_id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.user_id, e.target.value as AppRole)
                          }
                          className="w-full px-3 py-2 rounded-xl glass-input text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                        >
                          <option value="kasir" className="bg-gray-900 text-white">Kasir</option>
                          <option value="admin" className="bg-gray-900 text-white">Admin</option>
                          <option value="super_admin" className="bg-gray-900 text-white">Super Admin</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
