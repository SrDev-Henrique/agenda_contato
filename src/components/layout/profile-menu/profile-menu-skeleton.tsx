import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ProfileMenuSkeletonProps = {
  className?: string;
};

export function ProfileMenuSkeleton({ className }: ProfileMenuSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2",
        className,
      )}
    >
      <span className="sr-only">Carregando perfil</span>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
      <Skeleton className="size-8 shrink-0 rounded-lg" />
    </div>
  );
}
