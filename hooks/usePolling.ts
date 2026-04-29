import { useEffect, useRef } from "react";

/**
 * Run `callback` on a recurring interval, paused when the tab is hidden.
 * Comes back with an immediate tick the moment the tab regains focus, so
 * the agent always sees fresh data when they return.
 *
 * The latest `callback` reference is read each tick — passing a fresh
 * function on every render is fine, you don't need to memoize it.
 *
 * @param callback Fired on every interval tick (and once on activation).
 * @param intervalMs Polling cadence. Pass `null` or set `enabled=false` to pause.
 * @param enabled Defaults to `true`. Set to `false` to skip polling entirely.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number | null,
  enabled: boolean = true,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!enabled || intervalMs === null) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (typeof document === "undefined" || document.hidden) return;
      void cbRef.current();
    };

    const start = () => {
      stop();
      tick();
      timer = setInterval(tick, intervalMs);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);
}
