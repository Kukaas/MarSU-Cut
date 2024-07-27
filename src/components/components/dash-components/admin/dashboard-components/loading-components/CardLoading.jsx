import { Skeleton } from "@/components/ui/skeleton";

const CardLoading = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[80px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[260px]" />
        <Skeleton className="h-4 w-[210px]" />
      </div>
    </div>
  );
};

export default CardLoading;
