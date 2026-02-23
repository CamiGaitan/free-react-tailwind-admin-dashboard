import { createContext, useContext, useState } from "react";
import api from "../api/client";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  const login = async (username: string, password: string) => {
    const response = await api.post("auth/login/", {
      username,
      password,
    });

    const { access, refresh } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext error");
  return context;
};