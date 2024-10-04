import { Skeleton } from "./ui/skeleton";

export const LoadingPage = () => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Skeleton className="h-12 w-24" />
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
};
