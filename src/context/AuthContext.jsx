import React, { createContext, useContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // LOGIN
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error };

      const authUser = {
        _id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
      };

      setUser(authUser);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("token", data.token);

      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const signUp = async (fullName, email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error };

      const authUser = {
        _id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
      };

      setUser(authUser);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("token", data.token);

      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
