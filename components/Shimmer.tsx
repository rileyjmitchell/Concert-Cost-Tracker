import { cn } from "@/lib/cn";

export function Shimmer({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("shimmer rounded-2xl", className)}>{children}</div>;
}

export function ShimmerBlock({ className }: { className?: string }) {
  return (
    <Shimmer>
      <div className={cn("skeleton w-full bg-base-300/50", className)} />
    </Shimmer>
  );
}
