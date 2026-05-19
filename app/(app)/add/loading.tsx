import { ShimmerBlock } from "@/components/Shimmer";

export default function AddConcertLoading() {
  return (
    <div className="section-gap max-w-4xl mx-auto">
      <div className="space-y-2">
        <ShimmerBlock className="h-10 w-48" />
        <ShimmerBlock className="h-5 w-72" />
      </div>
      <ShimmerBlock className="h-96" />
      <ShimmerBlock className="h-64" />
    </div>
  );
}
