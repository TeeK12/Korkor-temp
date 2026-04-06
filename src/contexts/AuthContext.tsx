import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "owner" | "agent" | null;
type BusinessType = "product" | "service" | null;

interface BusinessTarget {
  metric: "revenue" | "units";
  target: number;
  period: string;
  progress: number;
}

interface PersonalTarget {
  type: "sales" | "revenue";
  target: number;
  period: string;
  progress: number;
}

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  businessType: BusinessType;
  userName: string;
  businessName: string;
  isAuthorized: boolean;
  businessTarget: BusinessTarget | null;
  personalTarget: PersonalTarget | null;
}

interface AuthContextType extends AuthState {
  loginAsOwner: (businessName: string, ownerName: string, businessType?: BusinessType) => void;
  loginAsAgent: (agentName: string, businessName: string, authorized?: boolean, businessType?: BusinessType) => void;
  setAuthorized: (authorized: boolean) => void;
  setBusinessTarget: (target: BusinessTarget | null) => void;
  setPersonalTarget: (target: PersonalTarget | null) => void;
  setBusinessType: (type: BusinessType) => void;
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
    businessType: null,
    userName: "",
    businessName: "",
    isAuthorized: false,
    businessTarget: null,
    personalTarget: null,
  });

  const loginAsOwner = (businessName: string, ownerName: string, businessType: BusinessType = "product") => {
    setAuth((prev) => ({ ...prev, isAuthenticated: true, role: "owner", businessType, userName: ownerName, businessName, isAuthorized: true }));
  };

  const loginAsAgent = (agentName: string, businessName: string, authorized = false, businessType: BusinessType = "product") => {
    setAuth((prev) => ({ ...prev, isAuthenticated: true, role: "agent", businessType, userName: agentName, businessName, isAuthorized: authorized }));
  };

  const setBusinessType = (type: BusinessType) => {
    setAuth((prev) => ({ ...prev, businessType: type }));
  };

  const setAuthorized = (authorized: boolean) => {
    setAuth((prev) => ({ ...prev, isAuthorized: authorized }));
  };

  const setBusinessTarget = (target: BusinessTarget | null) => {
    setAuth((prev) => ({ ...prev, businessTarget: target }));
  };

  const setPersonalTarget = (target: PersonalTarget | null) => {
    setAuth((prev) => ({ ...prev, personalTarget: target }));
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, businessType: null, userName: "", businessName: "", isAuthorized: false, businessTarget: null, personalTarget: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, loginAsOwner, loginAsAgent, setAuthorized, setBusinessTarget, setPersonalTarget, setBusinessType, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
