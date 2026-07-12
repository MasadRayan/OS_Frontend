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
  transferToIcu: (patientId) => api.post(`/patients/${patientId}/transfer-to-icu`),
  requestAmbulance: (payload) => api.post('/ambulance/request', payload),
  completeTrip: (ambulanceId) => api.post(`/ambulance/${ambulanceId}/complete-trip`),
  cancelTrip: (ambulanceId, reason) => api.post(`/ambulance/${ambulanceId}/cancel`, { reason }),
  reassignTrip: (ambulanceId, targetAmbulanceId) => api.post(`/ambulance/${ambulanceId}/reassign`, { targetAmbulanceId }),
  getHospitals: () => api.get('/hospitals'),
  getTripHistory: (params) => api.get('/ambulance/history', { params }),
  getResponseTimes: () => api.get('/analysis/response-times'),
  getSchedulerConfig: () => api.get('/config/scheduler'),
  setSchedulerConfig: (payload) => api.put('/config/scheduler', payload),
};
