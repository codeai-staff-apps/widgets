import {useEffect, useState} from 'react';

import type {Loaded} from './data';

export type LoadState<T> =
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'ready'; loaded: Loaded<T>};

/** Runs `load` on mount and whenever `deps` change; stale results are ignored. */
export function useLoaded<T>(load: () => Promise<Loaded<T>>, deps: unknown[]): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({status: 'loading'});

  useEffect(() => {
    let current = true;
    setState({status: 'loading'});
    load().then(
      loaded => current && setState({status: 'ready', loaded}),
      error => current && setState({status: 'error', message: String(error?.message ?? error)}),
    );
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
