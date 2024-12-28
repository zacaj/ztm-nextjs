'use client';

import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function useGet<T, E = Error>(key: string, fetch: () => Promise<T>|T, options?: { refreshIntervalSec?: number }): ({
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
  const hook= useSWR(key, fetch, {
    revalidateOnMount: true,
    refreshWhenHidden: true,
    refreshInterval: options?.refreshIntervalSec? options.refreshIntervalSec * 1000 : undefined,
  });

  return { ...hook as any,
    refresh: () => void hook.mutate(),
  };
}

type UseSetObj<T, R = void, E = Error> = ({
  isLoading: true;
  response: undefined;
  error: undefined;
} | {
  isLoading: false;
  response: undefined;
  error: undefined;
} | {
  isLoading: false;
  response: R;
  error: undefined;
} | {
  isLoading: false;
  response: undefined;
  error: E;
}) & {
};
export function useSet<T, R = void, E = Error>(
  key: string, act: (args: T) => Promise<R>,
): UseSetObj<T, E> & ((args: T) => Promise<R>) {
  const hook = useSWRMutation(
    key,
    (key, opts: { arg: T }) => act(opts.arg),
  );
  const trigger = useCallback((arg: T) => (hook.trigger as any)(arg, { key })
    .then(() => mutate((match: unknown) => match === key || (typeof match === `string` && match.startsWith(key)))), [hook, key]);
  const obj = (trigger as unknown as UseSetObj<T, R, E>);
  obj.isLoading = hook.isMutating;
  obj.response = hook.data;
  obj.error = hook.error;
  return trigger as any;
}