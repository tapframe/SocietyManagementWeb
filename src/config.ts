// API configuration
export const API_BASE_URL = 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api`;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  ME: `${API_URL}/auth/me`
};

// Report endpoints
export const REPORT_ENDPOINTS = {
  GET_ALL: `${API_URL}/reports`,
  GET_SINGLE: (id: string) => `${API_URL}/reports/${id}`,
  CREATE: `${API_URL}/reports`,
  UPLOAD_EVIDENCE: (id: string) => `${API_URL}/reports/${id}/evidence`,
  UPDATE_STATUS: (id: string) => `${API_URL}/reports/${id}/status`,
  ASSIGN_REPORT: (id: string) => `${API_URL}/reports/${id}/assign`,
  ADD_COMMENT: (id: string) => `${API_URL}/reports/${id}/comments`,
  GET_EVIDENCE: (filename: string) => `${API_URL}/reports/evidence/${filename}`
};

// Other API endpoints can be added here as the application grows 