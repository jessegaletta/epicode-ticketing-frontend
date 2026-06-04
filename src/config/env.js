const host = import.meta.env.VITE_BACKEND_HOST || "localhost";
const port = import.meta.env.VITE_BACKEND_PORT || "3001";

export const BASE_URL = `http://${host}:${port}`;
