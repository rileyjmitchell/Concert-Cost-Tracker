import { ShimmerBlock } from "@/components/Shimmer";

export default function ConcertListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ShimmerBlock key={i} className="h-40" />
      ))}
    </div>
  );
}
