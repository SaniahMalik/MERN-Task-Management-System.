import axios from 'axios';

// Backend server connection base URL setup (standard port 5000)
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically inject JWT Token if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;