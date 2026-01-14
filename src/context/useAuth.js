import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Custom hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
