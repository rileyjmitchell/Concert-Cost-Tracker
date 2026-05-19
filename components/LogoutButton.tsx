"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("You have been logged out.");
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm gap-1 rounded-xl"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
