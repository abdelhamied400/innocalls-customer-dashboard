import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "cookies-next/client";

export type IntervalValue = number | false;

/**
 * Custom hook to persist and manage refetch interval using cookies.
 * @param cookieName - The name of the cookie to use for storing the interval.
 * @param defaultInterval - The default interval in ms (defaults to 30_000 ms).
 */
export function usePersistentRefetchInterval(
  cookieName: string,
  defaultInterval: number = 30_000
) {
  const [refetchInterval, setRefetchInterval] =
    useState<IntervalValue>(defaultInterval);

  // Load initial refetch interval from cookies
  useEffect(() => {
    const cookieInterval = getCookie(cookieName);
    if (cookieInterval === "false") {
      setRefetchInterval(false);
    } else if (cookieInterval) {
      const parsedInterval = parseInt(cookieInterval as string, 10);
      setRefetchInterval(
        Number.isNaN(parsedInterval) ? defaultInterval : parsedInterval
      );
    } else {
      setRefetchInterval(defaultInterval);
    }
  }, [cookieName, defaultInterval]);

  // Persist interval changes to cookie
  const handleRefetchIntervalChange = useCallback(
    (interval: IntervalValue) => {
      setRefetchInterval(interval);
      setCookie(cookieName, interval);
    },
    [cookieName]
  );

  return { refetchInterval, setRefetchInterval: handleRefetchIntervalChange };
}
