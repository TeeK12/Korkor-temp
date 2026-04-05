import React, { createContext, useContext, useState, ReactNode } from "react";

export type ExpenseType = "Fuel/Generator" | "Rent" | "Salary" | "Packaging" | "Transport" | "Market Levy" | "Electricity" | "Miscellaneous";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  type: ExpenseType;
  date: string; // ISO date string
  note?: string;
  loggedBy: string; // agent name or "owner"
  role: "owner" | "agent";
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesForPeriod: (start: Date, end: Date) => Expense[];
  getTodaysExpenses: () => Expense[];
  getAgentExpenses: (agentName: string) => Expense[];
}

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export const useExpenses = () => {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
};

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

const initialExpenses: Expense[] = [
  { id: "e1", name: "Generator fuel", amount: 3500, type: "Fuel/Generator", date: today, note: "Morning run", loggedBy: "owner", role: "owner" },
  { id: "e2", name: "Market levy", amount: 500, type: "Market Levy", date: today, loggedBy: "owner", role: "owner" },
  { id: "e3", name: "Packaging bags", amount: 1200, type: "Packaging", date: yesterday, loggedBy: "Chidi", role: "agent" },
  { id: "e4", name: "Delivery bike fuel", amount: 2000, type: "Transport", date: yesterday, loggedBy: "owner", role: "owner" },
  { id: "e5", name: "Shop rent", amount: 45000, type: "Rent", date: twoDaysAgo, loggedBy: "owner", role: "owner" },
  { id: "e6", name: "Staff salary advance", amount: 5000, type: "Salary", date: twoDaysAgo, loggedBy: "owner", role: "owner" },
];

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const id = `e${Date.now()}`;
    setExpenses((prev) => [{ ...expense, id }, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const getExpensesForPeriod = (start: Date, end: Date) => {
    return expenses.filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
  };

  const getTodaysExpenses = () => {
    const t = new Date().toISOString().split("T")[0];
    return expenses.filter((e) => e.date === t);
  };

  const getAgentExpenses = (agentName: string) => {
    return expenses.filter((e) => e.loggedBy === agentName && e.role === "agent");
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, getExpensesForPeriod, getTodaysExpenses, getAgentExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};
