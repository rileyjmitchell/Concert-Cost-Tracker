import { notFound } from "next/navigation";
import ConcertForm from "@/components/ConcertForm";
import PageHeader from "@/components/PageHeader";
import { getConcertById } from "@/lib/concerts";

export default async function EditConcertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concert = await getConcertById(id);

  if (!concert) {
    notFound();
  }

  return (
    <div className="section-gap">
      <PageHeader
        title="Edit concert"
        description={`Update details and budget for ${concert.concert_name}.`}
      />
      <ConcertForm concert={concert} />
    </div>
  );
}
