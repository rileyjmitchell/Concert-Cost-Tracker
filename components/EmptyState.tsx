import Link from "next/link";
import { Music2 } from "lucide-react";

export default function EmptyState({
  headline = "No concerts yet",
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  showAddLink = true,
}: {
  headline?: string;
  message?: string;
  showAddLink?: boolean;
}) {
  return (
    <div className="card card-elevated">
      <div className="card-body items-center text-center py-14 px-6">
        <div className="rounded-full bg-primary/15 p-6 mb-2 animate-float-gentle">
          <Music2 className="h-14 w-14 text-primary" />
        </div>
        <h2 className="text-xl font-bold [font-family:var(--font-jakarta)]">{headline}</h2>
        <p className="text-base-content/75 max-w-md mt-2">{message}</p>
        {showAddLink && (
          <Link href="/add" className="btn btn-primary btn-modern mt-6">
            Add your first concert
          </Link>
        )}
      </div>
    </div>
  );
}
