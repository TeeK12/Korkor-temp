import React, { createContext, useContext, useState, ReactNode } from "react";

export type PaymentMethod = "cash" | "card" | "transfer" | "promise";

export interface SaleRecord {
  id: string;
  items: { productId: string; name: string; qty: number; price: number; unit: string }[];
  total: number;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  date: string;
  recordedBy: string;
  role: "owner" | "agent";
  promisePaid?: boolean;
  promisePaidDate?: string;
}

interface SalesContextType {
  sales: SaleRecord[];
  addSale: (sale: Omit<SaleRecord, "id">) => void;
  markPromisePaid: (id: string) => void;
  getCashInHand: () => number;
  getCashInPromise: () => number;
  getPromiseSales: () => SaleRecord[];
}

const SalesContext = createContext<SalesContextType | null>(null);

export const useSales = () => {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error("useSales must be used within SalesProvider");
  return ctx;
};

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const initialSales: SaleRecord[] = [
  { id: "s1", items: [{ productId: "1", name: "Indomie Chicken (70g)", qty: 5, price: 220, unit: "pack" }], total: 1100, paymentMethod: "cash", date: today, recordedBy: "owner", role: "owner" },
  { id: "s2", items: [{ productId: "2", name: "Dangote Sugar (500g)", qty: 3, price: 650, unit: "pack" }], total: 1950, paymentMethod: "transfer", date: today, recordedBy: "Chidi", role: "agent" },
  { id: "s3", items: [{ productId: "3", name: "Peak Milk (Tin)", qty: 2, price: 480, unit: "tin" }], total: 960, paymentMethod: "promise", customerNote: "Mama Chioma - will pay Friday", date: yesterday, recordedBy: "owner", role: "owner" },
  { id: "s4", items: [{ productId: "4", name: "Golden Penny Semovita (2kg)", qty: 1, price: 1800, unit: "bag" }], total: 1800, paymentMethod: "card", date: today, recordedBy: "owner", role: "owner" },
  { id: "s5", items: [{ productId: "1", name: "Indomie Chicken (70g)", qty: 10, price: 220, unit: "pack" }], total: 2200, paymentMethod: "promise", customerNote: "Oga Emeka - next week", date: new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0], recordedBy: "owner", role: "owner" },
];

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);

  const addSale = (sale: Omit<SaleRecord, "id">) => {
    const id = `s${Date.now()}`;
    setSales((prev) => [{ ...sale, id }, ...prev]);
  };

  const markPromisePaid = (id: string) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, promisePaid: true, promisePaidDate: new Date().toISOString().split("T")[0] } : s
      )
    );
  };

  const getCashInHand = () =>
    sales
      .filter((s) => ["cash", "card", "transfer"].includes(s.paymentMethod) || s.promisePaid)
      .reduce((sum, s) => sum + s.total, 0);

  const getCashInPromise = () =>
    sales
      .filter((s) => s.paymentMethod === "promise" && !s.promisePaid)
      .reduce((sum, s) => sum + s.total, 0);

  const getPromiseSales = () =>
    sales.filter((s) => s.paymentMethod === "promise" && !s.promisePaid);

  return (
    <SalesContext.Provider value={{ sales, addSale, markPromisePaid, getCashInHand, getCashInPromise, getPromiseSales }}>
      {children}
    </SalesContext.Provider>
  );
};
