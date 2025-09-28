import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// attach token helper
export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default API;
