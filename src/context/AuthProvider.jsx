import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    setTimeout(loadUser, 0); // Avoid set-state-in-effect warning
  }, []);

  // Demo signIn function
  const signIn = async (email, password) => {
    if (!email || !password) return { error: "Email and password required" };

    const demoUser = {
      id: Date.now().toString(),
      fullName: "Demo User",
      email,
    };

    localStorage.setItem("user", JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true };
  };

  // Demo signUp function
  const signUp = async (email, password, fullName) => {
    if (!email || !password || !fullName) return { error: "All fields required" };

    const newUser = {
      id: Date.now().toString(),
      email,
      fullName,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
