import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "owner" | "agent" | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
  businessName: string;
}

interface AuthContextType extends AuthState {
  loginAsOwner: (businessName: string, ownerName: string) => void;
  loginAsAgent: (agentName: string, businessName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    userName: "",
    businessName: "",
  });

  const loginAsOwner = (businessName: string, ownerName: string) => {
    setAuth({ isAuthenticated: true, role: "owner", userName: ownerName, businessName });
  };

  const loginAsAgent = (agentName: string, businessName: string) => {
    setAuth({ isAuthenticated: true, role: "agent", userName: agentName, businessName });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, userName: "", businessName: "" });
  };

  return (
    <AuthContext.Provider value={{ ...auth, loginAsOwner, loginAsAgent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
