import axios from 'axios';

// The Spring Boot backend runs on http://localhost:8080 and exposes its API
// under /api (see application.properties: server.port=8080 and each
// @RequestMapping("/api/...")). The backend does not define a CORS policy,
// so in development vite.config.js proxies "/api" straight through to
// http://localhost:8080, meaning the browser only ever calls same-origin
// "/api/..." URLs. In production, set VITE_API_BASE_URL to point directly
// at the deployed backend (or serve the frontend behind the same origin).
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default axiosInstance;
