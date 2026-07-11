import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 8000,
});

export const endpoints = {
  getState: () => api.get('/state'),
  getAnalysis: () => api.get('/analysis'),
  admitPatient: (payload) => api.post('/patients', payload),
  treatNextPatient: () => api.post('/patients/treat-next'),
  dischargePatient: (patientId) => api.post(`/patients/${patientId}/discharge`),
  requestAmbulance: (payload) => api.post('/ambulance/request', payload),
  completeTrip: (ambulanceId) => api.post(`/ambulance/${ambulanceId}/complete-trip`),
  getSchedulerConfig: () => api.get('/config/scheduler'),
  setSchedulerConfig: (payload) => api.put('/config/scheduler', payload),
};
