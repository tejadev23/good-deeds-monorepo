import { Skeleton } from "@/components/ui/skeleton";

export function DeedCardSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-border/80 bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
    </div>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading deeds">
      {Array.from({ length: count }, (_, i) => (
        <DeedCardSkeleton key={i} />
      ))}
    </div>
  );
}
