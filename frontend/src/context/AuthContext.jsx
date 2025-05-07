import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL // Ensure correct env

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const getUserToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("UserToken="))
      ?.split("=")[1] || null;
  };

  useEffect(() => {
    async function checkAuth() {
      const token = getUserToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/validate-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            role: data.user.role, // ✅ Ensure role is included
          });
        } else {
          document.cookie = "UserToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setUser(null);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser({
      id: userData.id,
      name: userData.name,
      role: userData.role, // ✅ Include role on login
    });
    document.cookie = `UserToken=${token}; path=/; Secure; SameSite=Strict`;
  };

  const logout = () => {
    setUser(null);
    document.cookie = "UserToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/'
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
