import { Skeleton } from "../ui/skeleton";

const SkeletonProfile = () => {
  return (
    <div className="flex flex-col space-y-4 w-full p-10">
      {/* Avatar and Drag-and-Drop Area */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Skeleton className="relative w-20 h-20 rounded-full shadow-md" />
        <Skeleton className="w-[100px] h-[50px] rounded-lg" />
      </div>

      {/* Form Fields and Buttons */}
      <div className="space-y-5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-full" />
        <div className="flex flex-col gap-2 justify-center">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;
