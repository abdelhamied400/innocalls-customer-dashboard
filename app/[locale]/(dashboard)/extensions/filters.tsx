"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const ExtensionsFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = (num: string) => {
    startTransition(async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("userId", num);
      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    });
  };
  return (
    <div className="extensions-filter">
      <div className="border-gray-200 bg-white shadow-md p-4 border rounded">
        <p>Extensions Filters</p>
      </div>

      {isPending && <div>Loading...</div>}

      <button onClick={() => onClick("1")}>set user id to 1</button>
      <button onClick={() => onClick("3")}>set user id to 3</button>
    </div>
  );
};

export default ExtensionsFilters;
