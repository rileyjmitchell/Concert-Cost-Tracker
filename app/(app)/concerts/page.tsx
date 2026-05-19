import Link from "next/link";
import ConcertCard from "@/components/ConcertCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { getUserConcerts } from "@/lib/concerts";

export default async function MyConcertsPage() {
  const concerts = await getUserConcerts();

  return (
    <div className="section-gap">
      <PageHeader
        title="My Concerts"
        description="Every show you have logged, with costs and fun scores."
        action={
          concerts.length > 0 ? (
            <Link href="/add" className="btn btn-primary btn-modern btn-sm">
              Add concert
            </Link>
          ) : undefined
        }
      />

      {concerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {concerts.map((concert, index) => (
            <ConcertCard key={concert.id} concert={concert} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
