import { LayoutDashboard, ShoppingCart, Package, History, ChevronLeft, ChevronRight, Users, LogOut, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/hooks/useAuth";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: AppRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["super_admin"] },
  { title: "POS Kasir", url: "/pos", icon: ShoppingCart, roles: ["kasir", "admin", "super_admin"] },
  { title: "Inventory", url: "/inventory", icon: Package, roles: ["admin", "super_admin"] },
  { title: "History", url: "/history", icon: History, roles: ["kasir", "admin", "super_admin"] },
  { title: "User Management", url: "/users", icon: Users, roles: ["super_admin"] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ["admin", "super_admin"] },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role, signOut, user } = useAuth();

  const visibleItems = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <aside
      className={cn(
        "glass-sidebar h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl gradient-text">POS System</span>
        )}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-6 pb-4">
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-primary-foreground bg-gradient-to-r from-purple-600 to-pink-600">
            {role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Kasir"}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "nav-link",
                isActive && "nav-link-active"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout & Collapse */}
      <div className="p-4 space-y-2">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-button text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass-button text-white/70 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
