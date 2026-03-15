import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Suppress 401 errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mark as handled to prevent console logs
    error.__handled = true;

    // Return a modified error that won't trigger console logs
    const customError = new Error("Suppressed error");
    customError.response = error.response;
    customError.config = error.config;
    customError.__suppressed = true;

    return Promise.reject(customError);
  },
);

export default instance;
