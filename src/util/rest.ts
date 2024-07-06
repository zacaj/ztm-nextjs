'use client';

import { useState } from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

export function useGet<T, E = Error>(key: string, fetch: () => Promise<T>): ({
  data: T;
  isLoading: false;
  error: undefined;
} | {
  data: undefined;
  isLoading: true;
  error: undefined;
} | {
  data: undefined;
  isLoading: false;
  error: E;
}) & {
  refresh(): void;
} {
  const hook= useSWRImmutable(key, fetch);

  return { ...hook as any,
    refresh: () => void hook.mutate(),
  };
}