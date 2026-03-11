"use client";
import { Skeleton } from "@/components/ui/skeleton";

const CreateWebCallLoading = () => {
  return (
    <div className="page h-full">
      <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-6 w-40" />
        </div>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
};

export default CreateWebCallLoading;
