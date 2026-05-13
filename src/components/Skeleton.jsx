export function SkeletonBox({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />
  );
}

export function TemplateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <SkeletonBox className="h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <SkeletonBox className="h-6 w-16" />
          <SkeletonBox className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <SkeletonBox className="h-6 w-16" />
          <SkeletonBox className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function TemplateGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TemplateCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex gap-4 items-center">
          <SkeletonBox className="w-14 h-14 shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-3 w-1/3" />
          </div>
          <SkeletonBox className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <SkeletonBox className="h-10 w-64" />
      <SkeletonBox className="h-4 w-96" />
      <TemplateGridSkeleton count={6} />
    </div>
  );
}
