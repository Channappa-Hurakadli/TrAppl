import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Decode user from token
export const decodeUser = (token: string) => {
  try {
    // Note: The backend's generateToken function only includes the user's ID.
    // We need to either change the token generation to include more user info
    // or make a separate API call to fetch user details after login.
    // For now, we'll assume the login/register response includes user details.
    const decoded: { id: string, name: string, email: string } = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default api;
