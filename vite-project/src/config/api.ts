// config/api.ts - API configuration for test.js backend
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
};

// API URLs for test.js backend (file storage)
export const API_URLS = {
  // Documents
  getAllDocuments: () => `${API_CONFIG.BASE_URL}/documents`,
  uploadDocument: () => `${API_CONFIG.BASE_URL}/upload-document`,
  searchDocuments: () => `${API_CONFIG.BASE_URL}/search`,
  
  // Classifications  
  getClassifications: () => `${API_CONFIG.BASE_URL}/classifications`,
  initClassifications: () => `${API_CONFIG.BASE_URL}/init-classifications`,
  
  // Statistics
  getStatistics: () => `${API_CONFIG.BASE_URL}/statistics`,
  
  // Health check
  health: () => `${API_CONFIG.BASE_URL}/health`,
  root: () => API_CONFIG.BASE_URL
};