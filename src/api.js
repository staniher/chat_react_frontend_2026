import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ajout de /api ici
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
