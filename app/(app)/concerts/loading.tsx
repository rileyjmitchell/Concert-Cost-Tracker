import ConcertListSkeleton from "@/components/skeletons/ConcertListSkeleton";
import { ShimmerBlock } from "@/components/Shimmer";

export default function ConcertsLoading() {
  return (
    <div className="section-gap">
      <div className="space-y-2">
        <ShimmerBlock className="h-10 w-48" />
        <ShimmerBlock className="h-5 w-64" />
      </div>
      <ConcertListSkeleton />
    </div>
  );
}
