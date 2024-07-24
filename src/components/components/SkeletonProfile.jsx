import { Skeleton } from "../ui/skeleton";

const SkeletonProfile = () => {
  return (
    <div className="flex flex-col space-y-4 w-full p-3">
      <Skeleton className="relative w-32 h-32 m-auto self-center overflow-hidden rounded-full" />
      <div className="space-y-5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};

export default SkeletonProfile;
