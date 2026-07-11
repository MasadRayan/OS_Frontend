import { useCallback, useEffect, useState } from 'react';
import { endpoints } from '../api/client';

export function useSchedulerConfig(stateScheduler) {
  const [config, setConfig] = useState(stateScheduler || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await endpoints.getSchedulerConfig();
      setConfig(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch scheduler config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (stateScheduler?.availableAlgorithms) {
      if (!config || config.activeAlgorithm !== stateScheduler.activeAlgorithm) {
        setConfig(stateScheduler);
      }
    }
  }, [stateScheduler]);

  useEffect(() => {
    if (!stateScheduler?.availableAlgorithms) {
      fetchConfig();
    }
  }, []);

  const setAlgorithm = useCallback(async (algorithm, params) => {
    try {
      setLoading(true);
      const payload = { algorithm };
      if (params) payload.params = params;
      const res = await endpoints.setSchedulerConfig(payload);
      setConfig(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to set algorithm';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { config, loading, error, fetchConfig, setAlgorithm };
}
