import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SessionTier {
  id: string;
  sessions: number;
  duration: number; // minutes
  chips: number;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  tiers: SessionTier[];
}

export interface ChipRequest {
  id: string;
  agentName: string;
  amount: number;
  note: string;
  status: "pending" | "approved" | "denied";
  timestamp: string;
}

export interface AgentChipAllocation {
  agentName: string;
  allocated: number;
  used: number;
  history: { timestamp: string; amount: number; sessionType: string; action: "deducted" | "added" }[];
}

export interface ServiceSale {
  id: string;
  agentName: string;
  serviceName: string;
  tierSessions: number;
  duration: number;
  chipsDeducted: number;
  amount: number;
  timestamp: string;
}

export interface ActiveTimer {
  id: string;
  serviceName: string;
  customerId: string;
  durationMs: number;
  startedAt: number; // Date.now()
}

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  chipDefinition: string;
  setChipDefinition: (def: string) => void;
  autoApproveChips: boolean;
  setAutoApproveChips: (v: boolean) => void;
  agentAllocations: AgentChipAllocation[];
  addChipsToAgent: (agentName: string, amount: number) => void;
  deductChips: (agentName: string, amount: number, sessionType: string) => void;
  getAgentAllocation: (agentName: string) => AgentChipAllocation;
  chipRequests: ChipRequest[];
  requestChips: (agentName: string, amount: number, note: string) => void;
  approveChipRequest: (requestId: string) => void;
  denyChipRequest: (requestId: string) => void;
  serviceSales: ServiceSale[];
  recordServiceSale: (sale: Omit<ServiceSale, "id">) => void;
  activeTimers: ActiveTimer[];
  addTimer: (timer: Omit<ActiveTimer, "id">) => void;
  removeTimer: (id: string) => void;
  getTodaysSessions: () => ServiceSale[];
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const useService = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useService must be used within ServiceProvider");
  return ctx;
};

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "PlayStation Session",
      description: "Play any game on PS5",
      tiers: [
        { id: "t1", sessions: 1, duration: 30, chips: 1, price: 500 },
        { id: "t2", sessions: 2, duration: 60, chips: 1.5, price: 1000 },
        { id: "t3", sessions: 3, duration: 90, chips: 2, price: 1500 },
      ],
    },
    {
      id: "2",
      name: "Browsing Hour",
      description: "Internet access per hour",
      tiers: [
        { id: "t4", sessions: 1, duration: 60, chips: 1, price: 300 },
        { id: "t5", sessions: 2, duration: 120, chips: 1.5, price: 500 },
      ],
    },
  ]);

  const [chipDefinition, setChipDefinition] = useState("1 chip = 30 minutes of console time = ₦500");
  const [autoApproveChips, setAutoApproveChips] = useState(false);

  const [agentAllocations, setAgentAllocations] = useState<AgentChipAllocation[]>([
    { agentName: "Chidi", allocated: 20, used: 8, history: [
      { timestamp: new Date().toISOString(), amount: 1, sessionType: "PlayStation Session", action: "deducted" },
    ]},
    { agentName: "Blessing Okoro", allocated: 15, used: 5, history: [] },
  ]);

  const [chipRequests, setChipRequests] = useState<ChipRequest[]>([]);
  const [serviceSales, setServiceSales] = useState<ServiceSale[]>([]);
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);

  const addService = (service: Omit<Service, "id">) => {
    setServices(prev => [...prev, { ...service, id: Date.now().toString() }]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const getAgentAllocation = (agentName: string): AgentChipAllocation => {
    return agentAllocations.find(a => a.agentName === agentName) || { agentName, allocated: 0, used: 0, history: [] };
  };

  const addChipsToAgent = (agentName: string, amount: number) => {
    setAgentAllocations(prev => {
      const exists = prev.find(a => a.agentName === agentName);
      if (exists) {
        return prev.map(a => a.agentName === agentName ? {
          ...a, allocated: a.allocated + amount,
          history: [...a.history, { timestamp: new Date().toISOString(), amount, sessionType: "Top-up", action: "added" as const }]
        } : a);
      }
      return [...prev, { agentName, allocated: amount, used: 0, history: [{ timestamp: new Date().toISOString(), amount, sessionType: "Top-up", action: "added" as const }] }];
    });
  };

  const deductChips = (agentName: string, amount: number, sessionType: string) => {
    setAgentAllocations(prev => prev.map(a => a.agentName === agentName ? {
      ...a, used: a.used + amount,
      history: [...a.history, { timestamp: new Date().toISOString(), amount, sessionType, action: "deducted" as const }]
    } : a));
  };

  const requestChips = (agentName: string, amount: number, note: string) => {
    const req: ChipRequest = { id: Date.now().toString(), agentName, amount, note, status: "pending", timestamp: new Date().toISOString() };
    if (autoApproveChips) {
      req.status = "approved";
      addChipsToAgent(agentName, amount);
    }
    setChipRequests(prev => [...prev, req]);
  };

  const approveChipRequest = (requestId: string) => {
    setChipRequests(prev => prev.map(r => {
      if (r.id === requestId && r.status === "pending") {
        addChipsToAgent(r.agentName, r.amount);
        return { ...r, status: "approved" as const };
      }
      return r;
    }));
  };

  const denyChipRequest = (requestId: string) => {
    setChipRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "denied" as const } : r));
  };

  const recordServiceSale = (sale: Omit<ServiceSale, "id">) => {
    setServiceSales(prev => [...prev, { ...sale, id: Date.now().toString() }]);
  };

  const addTimer = (timer: Omit<ActiveTimer, "id">) => {
    setActiveTimers(prev => [...prev.slice(-2), { ...timer, id: Date.now().toString() }]); // max 3
  };

  const removeTimer = (id: string) => {
    setActiveTimers(prev => prev.filter(t => t.id !== id));
  };

  const getTodaysSessions = () => {
    const today = new Date().toDateString();
    return serviceSales.filter(s => new Date(s.timestamp).toDateString() === today);
  };

  return (
    <ServiceContext.Provider value={{
      services, addService, updateService, deleteService,
      chipDefinition, setChipDefinition,
      autoApproveChips, setAutoApproveChips,
      agentAllocations, addChipsToAgent, deductChips, getAgentAllocation,
      chipRequests, requestChips, approveChipRequest, denyChipRequest,
      serviceSales, recordServiceSale,
      activeTimers, addTimer, removeTimer,
      getTodaysSessions,
    }}>
      {children}
    </ServiceContext.Provider>
  );
};
