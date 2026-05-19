import { Music2 } from "lucide-react";
import AppNav from "@/components/AppNav";
import LogoutButton from "@/components/LogoutButton";
import PageTransition from "@/components/PageTransition";
import ThemeSelector from "@/components/ThemeSelector";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-primary">
                <Music2 className="h-6 w-6 shrink-0" />
                <span className="font-bold text-lg truncate [font-family:var(--font-jakarta)]">
                  Concert Cost Tracker
                </span>
              </div>
              <p className="text-xs text-base-content/60 mt-0.5 hidden sm:block">
                Track spending, fun, and value across every show.
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-between border-t border-base-300/50 pt-3 md:border-0 md:pt-0 md:justify-end">
              <span className="text-xs text-base-content/70 truncate max-w-[180px] sm:max-w-[220px]">
                {user?.email}
              </span>
              <ThemeSelector compact />
              <LogoutButton />
            </div>
          </div>
        </div>
        <div className="hidden md:flex justify-center border-t border-base-300/80 px-4 py-2 bg-base-100/80">
          <AppNav />
        </div>
      </header>

      <main className="flex-1 page-shell">
        <PageTransition>{children}</PageTransition>
      </main>

      <AppNav />
    </div>
  );
}
