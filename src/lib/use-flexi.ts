"use client";

import { useState, useEffect } from "react";

interface UseFlexiOptions {
  evidence: string;
  params?: Record<string, string>;
}

interface UseFlexiResult<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Client-side hook to fetch data from Flexi API via our proxy.
 * Falls back gracefully if API is not configured (returns null data).
 */
export function useFlexi<T>({ evidence, params }: UseFlexiOptions): UseFlexiResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams(params);
        const url = `/api/flexi/${evidence}.json${searchParams.toString() ? `?${searchParams}` : ""}`;
        const res = await fetch(url);

        if (!res.ok) {
          // API not configured or error — this is expected in dev
          setData(null);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const rows = json?.winstrom?.[evidence] as T[] | undefined;

        if (!cancelled) {
          setData(rows || []);
        }
      } catch {
        if (!cancelled) {
          setData(null);
          setError("Nelze se připojit k API");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [evidence, JSON.stringify(params), refetchCount]);

  return { data, loading, error, refetch: () => setRefetchCount((c) => c + 1) };
}

/**
 * Helper to use either API data or fallback mock data.
 * Returns mock data if API returns null (not configured).
 */
export function useFlexiWithFallback<T>(
  options: UseFlexiOptions,
  mockData: T[],
): { data: T[]; loading: boolean; isLive: boolean } {
  const { data, loading } = useFlexi<T>(options);

  return {
    data: data ?? mockData,
    loading: loading && data === null,
    isLive: data !== null,
  };
}
