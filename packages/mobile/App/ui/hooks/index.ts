import { useContext, useEffect, useState } from 'react';
import { Backend } from '~/services/backend';
import { BackendContext } from '~/ui/contexts/BackendContext';

export type ResultArray<T> = [T | null, Error | null];

export const useCancelableEffect = <T>(
  fetcher: () => Promise<T> | T,
  dependencies = [],
): ResultArray<T> => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    (async (): Promise<void> => {
      try {
        const result = await fetcher();
        if (!canceled) {
          setData(result);
        }
      } catch (e) {
        setError(e);
      }
    })();
    return (): void => {
      canceled = true;
    };
  }, dependencies);

  return [data, error];
};

export const useBackendEffect = <T>(
  call: (backend: Backend) => Promise<T> | T,
  dependencies = [],
): ResultArray<T> => {
  const backend = useContext(BackendContext);

  return useCancelableEffect(() => call(backend), dependencies);
};

export const useBackend = () => useContext(BackendContext);
