import ConcertForm from "@/components/ConcertForm";
import PageHeader from "@/components/PageHeader";

export default function AddConcertPage() {
  return (
    <div className="section-gap">
      <PageHeader
        title="Add Concert"
        description="Log a show you attended — costs and fun rating included."
      />
      <ConcertForm />
    </div>
  );
}
