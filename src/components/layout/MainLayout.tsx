import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          {children}
        </main>
        <footer className="text-center py-4 text-sm text-white/40">
          Development By AlamDev
        </footer>
      </div>
    </div>
  );
}
