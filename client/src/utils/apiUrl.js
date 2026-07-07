const apiUrl = import.meta.env.VITE_API_URL;
export const apiFetch = (path, options) => fetch(`${apiUrl}${path}`, { ...options, credentials: "include" });