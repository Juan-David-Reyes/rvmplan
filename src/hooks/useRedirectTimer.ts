"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UseRedirectTimerOptions, UseRedirectTimerReturn } from "@/types/redirect-loader";

/**
 * Custom hook to handle countdown and redirection logic.
 * Uses real timestamp delta to prevent background tab interval drift.
 */
export function useRedirectTimer({
  targetUrl,
  durationInSeconds,
  autoStart = true,
  onRedirect,
  onCancel,
}: UseRedirectTimerOptions): UseRedirectTimerReturn {
  const router = useRouter();
  const totalDurationMs = durationInSeconds * 1000;

  const [remainingMs, setRemainingMs] = useState<number>(totalDurationMs);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const remainingMsRef = useRef<number>(remainingMs);
  remainingMsRef.current = remainingMs;

  const lastTimestampRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const hasRedirectedRef = useRef<boolean>(false);

  const executeRedirect = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;

    setIsRedirecting(true);
    setIsRunning(false);

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    onRedirect?.(targetUrl);

    // Differentiate between internal Next.js navigation and external URLs
    const isInternalRoute = targetUrl.startsWith("/") && !targetUrl.startsWith("//");

    if (isInternalRoute) {
      router.push(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  }, [targetUrl, router, onRedirect]);

  // Main tick effect
  useEffect(() => {
    if (!isRunning || isPaused || isCancelled || isRedirecting) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    lastTimestampRef.current = Date.now();

    const TICK_INTERVAL = 50; // 50ms updates for smooth animations

    intervalIdRef.current = setInterval(() => {
      const now = Date.now();
      const delta = lastTimestampRef.current ? now - lastTimestampRef.current : TICK_INTERVAL;
      lastTimestampRef.current = now;

      setRemainingMs((prev) => {
        const next = Math.max(0, prev - delta);
        if (next === 0) {
          executeRedirect();
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning, isPaused, isCancelled, isRedirecting, executeRedirect]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused && !isCancelled && !isRedirecting) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused, isCancelled, isRedirecting]);

  const resume = useCallback(() => {
    if (isRunning && isPaused && !isCancelled && !isRedirecting) {
      lastTimestampRef.current = Date.now();
      setIsPaused(false);
    }
  }, [isRunning, isPaused, isCancelled, isRedirecting]);

  const cancel = useCallback(() => {
    setIsRunning(false);
    setIsCancelled(true);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    onCancel?.();
  }, [onCancel]);

  const reset = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    hasRedirectedRef.current = false;
    setRemainingMs(totalDurationMs);
    setIsRunning(autoStart);
    setIsPaused(false);
    setIsCancelled(false);
    setIsRedirecting(false);
    lastTimestampRef.current = null;
  }, [totalDurationMs, autoStart]);

  const redirectNow = useCallback(() => {
    executeRedirect();
  }, [executeRedirect]);

  // Safe percentage bounded between 0 and 100
  const progressPercentage = Math.min(
    100,
    Math.max(0, ((totalDurationMs - remainingMs) / totalDurationMs) * 100)
  );

  const timeLeft = Math.ceil(remainingMs / 1000);

  return {
    timeLeft,
    totalDuration: durationInSeconds,
    progressPercentage,
    isRunning,
    isPaused,
    isCancelled,
    isRedirecting,
    pause,
    resume,
    cancel,
    reset,
    redirectNow,
  };
}
