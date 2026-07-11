import { useEffect, useState, useCallback, useRef } from 'react';
import { endpoints } from '../api/client';

const POLL_INTERVAL_MS = 5000;

export function useAnalysisData() {
  const [analysis, setAnalysis] = useState(null);
  const [connected, setConnected] = useState(false);
  const timerRef = useRef(null);

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await endpoints.getAnalysis();
      setAnalysis(res.data);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
    timerRef.current = setInterval(fetchAnalysis, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchAnalysis]);

  return { analysis, connected, refetch: fetchAnalysis };
}
