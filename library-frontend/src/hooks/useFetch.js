import { useCallback, useEffect, useState } from 'react';
import { showApiError } from '../utils/errorHandler';

/**
 * Generic data-fetching hook.
 *
 * @param {Function} fetcher - async function returning data, memoized by caller
 * @param {Array} deps - dependency array; the fetcher re-runs when these change
 * @param {Object} options - { skip?: boolean }
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { skip = false } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err);
      showApiError(err, 'Failed to load data');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
