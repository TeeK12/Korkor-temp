import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "owner" | "agent" | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
  businessName: string;
  isAuthorized: boolean;
}

interface AuthContextType extends AuthState {
  loginAsOwner: (businessName: string, ownerName: string) => void;
  loginAsAgent: (agentName: string, businessName: string, authorized?: boolean) => void;
  setAuthorized: (authorized: boolean) => void;
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
    isAuthorized: false,
  });

  const loginAsOwner = (businessName: string, ownerName: string) => {
    setAuth({ isAuthenticated: true, role: "owner", userName: ownerName, businessName, isAuthorized: true });
  };

  const loginAsAgent = (agentName: string, businessName: string, authorized = false) => {
    setAuth({ isAuthenticated: true, role: "agent", userName: agentName, businessName, isAuthorized: authorized });
  };

  const setAuthorized = (authorized: boolean) => {
    setAuth((prev) => ({ ...prev, isAuthorized: authorized }));
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, userName: "", businessName: "", isAuthorized: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, loginAsOwner, loginAsAgent, setAuthorized, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
