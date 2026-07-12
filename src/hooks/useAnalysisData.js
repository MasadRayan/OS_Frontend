import { useEffect, useState, useCallback, useRef } from 'react';
import { endpoints } from '../api/client';

const POLL_INTERVAL_MS = 5000;

export function useAnalysisData() {
  const [analysis, setAnalysis] = useState(null);
  const [responseTimes, setResponseTimes] = useState(null);
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

  const fetchResponseTimes = useCallback(async () => {
    try {
      const res = await endpoints.getResponseTimes();
      setResponseTimes(res.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
    fetchResponseTimes();
    timerRef.current = setInterval(() => {
      fetchAnalysis();
      fetchResponseTimes();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchAnalysis, fetchResponseTimes]);

  return { analysis, responseTimes, connected, refetch: fetchAnalysis };
}
