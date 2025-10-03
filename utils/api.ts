import axios from "axios";
import { clearToken, retrieveToken, saveToken } from './TokenStorage';

const BASE_URL = 'http://192.168.68.116:8000/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
     
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await retrieveToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  
// Unified error handling
api.interceptors.response.use(
  (response) => {
    // Automatically save tokens from login/register responses
    if (response.data?.token) {
      saveToken(response.data.token);
    }
    return response;
  },
  async (error) => {
    let message = "An error occurred";

    // Laravel validation/auth errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 422) {
        // Laravel validation errors
        if (typeof data.message === "string") {
          message = data.message; // e.g., "Invalid credentials"
        } else if (data.errors) {
          // Flatten Laravel validation errors into one string
          message = Object.values(data.errors).flat().join("\n");
        }
      } else if (status === 401) {
        message = data.message || "Unauthorized";
        clearToken();
      } else if (data?.message) {
        message = data.message;
      }
    } else if (error.message) {
      // Network or timeout errors
      message = error.message;
    }

    // Throw a standard Error object
    return Promise.reject(new Error(message));
  }
);

export default api;