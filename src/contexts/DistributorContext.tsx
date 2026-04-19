import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface DistributorOwnProduct {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  freeShippingThreshold?: number;
  goodwillEnabled: boolean;
  goodwillRepaymentDays?: number;
  paymentMethods: string[];
}

export type DistributorOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "declined";

export interface DistributorIncomingOrder {
  id: string;
  date: string;
  buyerId: string;
  buyerName: string;
  buyerLocation: string;
  items: { productId: string; productName: string; qty: number; unitPrice: number; paymentType: "cash" | "goodwill" }[];
  paymentMethod: string;
  status: DistributorOrderStatus;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface DistributorState {
  businessName: string;
  ownerName: string;
  phone: string;
  state: string;
  area: string;
  categories: string[];
  freeShippingThreshold?: number;
  defaultGoodwillDays: number;
  autoApproveGoodwill: boolean;
  products: DistributorOwnProduct[];
  orders: DistributorIncomingOrder[];
}

interface DistributorContextType extends DistributorState {
  setProfile: (data: Partial<DistributorState>) => void;
  addProduct: (p: Omit<DistributorOwnProduct, "id">) => void;
  removeProduct: (id: string) => void;
  addIncomingOrder: (o: Omit<DistributorIncomingOrder, "id" | "status" | "date"> & { id?: string; date?: string }) => void;
  setOrderStatus: (id: string, status: DistributorOrderStatus) => void;
}

const seedProducts: DistributorOwnProduct[] = [
  { id: "dop1", name: "Peak Milk (Tin)", category: "Dairy", costPrice: 280, sellingPrice: 350, currentStock: 2400, freeShippingThreshold: 30000, goodwillEnabled: true, goodwillRepaymentDays: 60, paymentMethods: ["Cash", "Bank Transfer", "Goodwill"] },
  { id: "dop2", name: "Peak Milk (Sachet x10)", category: "Dairy", costPrice: 220, sellingPrice: 280, currentStock: 4000, goodwillEnabled: false, paymentMethods: ["Cash", "Bank Transfer"] },
];

const seedOrders: DistributorIncomingOrder[] = [
  {
    id: "io1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    buyerId: "owner-mn",
    buyerName: "Mama Nkechi Provisions",
    buyerLocation: "Alaba, Lagos",
    items: [
      { productId: "dop1", productName: "Peak Milk (Tin)", qty: 50, unitPrice: 350, paymentType: "goodwill" },
    ],
    paymentMethod: "Bank Transfer",
    status: "pending",
  },
];

const DistributorContext = createContext<DistributorContextType | null>(null);

export const useDistributor = () => {
  const ctx = useContext(DistributorContext);
  if (!ctx) throw new Error("useDistributor must be used within DistributorProvider");
  return ctx;
};

export const DistributorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DistributorState>({
    businessName: "",
    ownerName: "",
    phone: "",
    state: "",
    area: "",
    categories: [],
    defaultGoodwillDays: 30,
    autoApproveGoodwill: false,
    products: seedProducts,
    orders: seedOrders,
  });

  const setProfile = (data: Partial<DistributorState>) => setState((p) => ({ ...p, ...data }));

  const addProduct = (p: Omit<DistributorOwnProduct, "id">) =>
    setState((s) => ({ ...s, products: [...s.products, { ...p, id: `dop-${Date.now()}` }] }));

  const removeProduct = (id: string) =>
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));

  const addIncomingOrder = (o: Omit<DistributorIncomingOrder, "id" | "status" | "date"> & { id?: string; date?: string }) =>
    setState((s) => ({
      ...s,
      orders: [
        {
          ...o,
          id: o.id ?? `io-${Date.now()}`,
          status: "pending",
          date: o.date ?? new Date().toISOString(),
        } as DistributorIncomingOrder,
        ...s.orders,
      ],
    }));

  const setOrderStatus = useCallback((id: string, status: DistributorOrderStatus) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== id) return o;
        const stamp = new Date().toISOString();
        return {
          ...o,
          status,
          confirmedAt: status === "confirmed" ? stamp : o.confirmedAt,
          shippedAt: status === "shipped" ? stamp : o.shippedAt,
          deliveredAt: status === "delivered" ? stamp : o.deliveredAt,
        };
      }),
    }));
  }, []);

  return (
    <DistributorContext.Provider value={{ ...state, setProfile, addProduct, removeProduct, addIncomingOrder, setOrderStatus }}>
      {children}
    </DistributorContext.Provider>
  );
};
