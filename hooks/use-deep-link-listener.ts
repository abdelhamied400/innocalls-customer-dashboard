import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const useDeepLinkListener = (
  action: string,
  cb: (params: Record<string, string>, clearSearchParams: () => void) => void,
  deps: unknown[]
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use ref to store the latest callback without triggering re-renders
  const callbackRef = useRef(cb);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = cb;
  }, [cb]);

  const clearSearchParams = useCallback(() => {
    // Clear the deep link parameters from the URL after handling
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("action");
    Array.from(newSearchParams.keys()).forEach((key) => {
      if (key !== "action") {
        newSearchParams.delete(key);
      }
    });
    const newUrl =
      window.location.pathname +
      (newSearchParams.toString() ? `?${newSearchParams.toString()}` : "");
    router.replace(newUrl);
  }, [searchParams, router]);

  useEffect(() => {
    const deepLinkAction = searchParams.get("action");
    const params = Array.from(searchParams.entries()).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    if (deepLinkAction === action) {
      callbackRef.current(params, clearSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, action, clearSearchParams, ...deps]);
};

export default useDeepLinkListener;
