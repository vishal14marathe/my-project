import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios
  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await axios.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.success) {
        setUser(response.data.data);
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(response.data.message || "Invalid email or password");
        return { success: false };
      }
    } catch (error) {
      // Check if we have response data even in error
      if (error.response?.data) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Login failed. Please try again.");
      }
      return { success: false };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setUser(response.data.data);
        toast.success("Registration successful!");
        return { success: true };
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("already exists")) {
        toast.error("Email already registered");
      } else {
        toast.error("Registration failed");
      }
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
