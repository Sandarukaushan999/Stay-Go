import httpClient from '../api/httpClient';

export async function reportIncident(payload) {
  const { data } = await httpClient.post('/ride-sharing/incidents/report', payload);
  return data.incident;
}

export async function getIncidents() {
  const { data } = await httpClient.get('/ride-sharing/incidents');
  return data.incidents || [];
}

export async function getIncidentById(incidentId) {
  const { data } = await httpClient.get(`/ride-sharing/incidents/${incidentId}`);
  return data.incident;
}
