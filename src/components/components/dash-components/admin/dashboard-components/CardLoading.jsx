import { Skeleton } from "@/components/ui/skeleton"


const CardLoading = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[115px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default CardLoading