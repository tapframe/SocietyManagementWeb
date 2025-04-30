import axios from 'axios';

// Function to get the token (prioritizes admin token)
const getToken = () => {
  const adminToken = localStorage.getItem('adminToken');
  const regularToken = localStorage.getItem('token');
  return adminToken || regularToken;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: '/api', // Base URL for all requests
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling common errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login or clear tokens
      console.error('Unauthorized access - 401');
      // Example: Clear tokens and redirect (implement this logic as needed)
      // localStorage.removeItem('token');
      // localStorage.removeItem('adminToken');
      // localStorage.removeItem('user');
      // localStorage.removeItem('userRole');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 