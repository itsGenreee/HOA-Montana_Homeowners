import axios from "axios";
import { clearToken, retrieveToken, saveToken } from './TokenStorage';

const BASE_URL = 'https://choicest-unfelicitously-princess.ngrok-free.dev/api';

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
      // Instead of creating a new Error, preserve the original error response
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          // Laravel validation errors - flatten for easy display
          if (typeof data.message === "string") {
            error.message = data.message;
          } else if (data.errors) {
            error.message = Object.values(data.errors).flat().join("\n");
          }
        } else if (status === 401) {
          error.message = data.message || "Unauthorized";
          await clearToken();
        } else if (data?.message) {
          error.message = data.message;
        }
      } else if (error.message) {
        // Network or timeout errors - keep the original message
        error.message = error.message;
      } else {
        error.message = "An error occurred";
      }

      // Return the original error but with enhanced message
      return Promise.reject(error);
    }
  );

export default api;