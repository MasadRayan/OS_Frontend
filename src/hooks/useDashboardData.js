import { useCallback, useEffect, useRef, useState } from 'react';
import { endpoints } from '../api/client';

const POLL_INTERVAL_MS = 3000;

/** Polls GET /api/state on an interval and exposes axios-backed action calls. */
export function useDashboardData() {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await endpoints.getState();
      setState(res.data);
      setConnected(true);
      setError(null);
    } catch (err) {
      setConnected(false);
      setError(err.message || 'Failed to reach backend');
    }
  }, []);

  useEffect(() => {
    fetchState();
    timerRef.current = setInterval(fetchState, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchState]);

  const admitPatient = useCallback(
    async (payload) => {
      const res = await endpoints.admitPatient(payload);
      setState(res.data);
    },
    []
  );

  const treatNextPatient = useCallback(async () => {
    const res = await endpoints.treatNextPatient();
    setState(res.data.state);
  }, []);

  const dischargePatient = useCallback(async (patientId) => {
    const res = await endpoints.dischargePatient(patientId);
    setState(res.data.state);
  }, []);

  const transferToIcu = useCallback(async (patientId) => {
    const res = await endpoints.transferToIcu(patientId);
    setState(res.data.state);
  }, []);

  const requestAmbulance = useCallback(async (payload) => {
    const res = await endpoints.requestAmbulance(payload);
    setState(res.data);
  }, []);

  const completeTrip = useCallback(async (ambulanceId) => {
    const res = await endpoints.completeTrip(ambulanceId);
    setState(res.data.state);
  }, []);

  const cancelTrip = useCallback(async (ambulanceId, reason) => {
    const res = await endpoints.cancelTrip(ambulanceId, reason);
    setState(res.data.state);
  }, []);

  const reassignTrip = useCallback(async (ambulanceId, targetAmbulanceId) => {
    const res = await endpoints.reassignTrip(ambulanceId, targetAmbulanceId);
    setState(res.data.state);
  }, []);

  return {
    state,
    connected,
    error,
    refetch: fetchState,
    admitPatient,
    treatNextPatient,
    dischargePatient,
    transferToIcu,
    requestAmbulance,
    completeTrip,
    cancelTrip,
    reassignTrip,
  };
}
