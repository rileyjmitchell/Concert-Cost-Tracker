import { ShimmerBlock } from "@/components/Shimmer";

export default function DashboardSkeleton() {
  return (
    <div className="section-gap">
      <div className="space-y-2">
        <ShimmerBlock className="h-10 w-48" />
        <ShimmerBlock className="h-5 w-72" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ShimmerBlock key={i} className="h-24" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerBlock key={i} className="h-80" />
        ))}
      </div>
    </div>
  );
}
