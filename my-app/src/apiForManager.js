// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
