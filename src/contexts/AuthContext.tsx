import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";

interface User {
  id: number;
  nome: string;
  email: string;
  role: "plataforma_admin" | "empresa_admin";
  idEmpresa?: number | string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string, role: User["role"]) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Carrega usuário salvo no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("easy_admin_user");
    if (saved) {
      const parsedUser: User = JSON.parse(saved);

      console.log("🔵 Usuário carregado do localStorage:", parsedUser);

      // Converte idEmpresa se vier como string
      if (parsedUser.idEmpresa) {
        parsedUser.idEmpresa = Number(parsedUser.idEmpresa);
      }

      setUser(parsedUser);
    }
  }, []);

  const login = async (
    email: string,
    senha: string,
    role: User["role"]
  ): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, senha, role });

      let userData = res.data as User;

      console.log("🟣 Dados crus do backend:", userData);

      // Força idEmpresa a virar number
      if (userData.idEmpresa !== undefined && userData.idEmpresa !== null) {
        userData.idEmpresa = Number(userData.idEmpresa);
      } else {
        userData.idEmpresa = null;
      }

      console.log("User final após ajuste:", userData);

      setUser(userData);
      localStorage.setItem("easy_admin_user", JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  const logout = () => {
    console.log("Logout realizado. Limpando usuário.");
    setUser(null);
    localStorage.removeItem("easy_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
