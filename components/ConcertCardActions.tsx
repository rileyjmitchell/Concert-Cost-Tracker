"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { friendlyDbError } from "@/lib/userMessages";

export default function ConcertCardActions({ concertId }: { concertId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this concert? This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("concerts").delete().eq("id", concertId);

    setDeleting(false);

    if (error) {
      toast.error(friendlyDbError(error.message));
      return;
    }

    toast.success("Concert deleted.");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Link
        href={`/concerts/${concertId}/edit`}
        className="btn btn-sm btn-outline btn-modern gap-1"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
      <button
        type="button"
        className="btn btn-sm btn-outline btn-error btn-modern gap-1"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
