import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type CartPaymentType = "cash" | "goodwill";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "declined";

export interface CartItem {
  productId: string;
  productName: string;
  distributorId: string;
  distributorName: string;
  unitPrice: number;
  quantity: number;
  paymentType: CartPaymentType;
  goodwillSupported?: boolean;
  goodwillRepaymentDays?: number;
}

export interface PlacedOrder {
  id: string;
  date: string;
  items: CartItem[];
  paymentMethod: "Bank Transfer" | "Online Payment";
  buyerName: string;
  distributorId: string;
  distributorName: string;
  status: OrderStatus;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface CartContextType {
  items: CartItem[];
  orders: PlacedOrder[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, paymentType: CartPaymentType) => void;
  updateQuantity: (productId: string, paymentType: CartPaymentType, qty: number) => void;
  updateItemPaymentType: (productId: string, currentPaymentType: CartPaymentType, newPaymentType: CartPaymentType) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: "Bank Transfer" | "Online Payment", buyerName: string) => PlacedOrder[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  itemCount: number;
  grandTotal: number;
  cashTotal: number;
  goodwillTotal: number;
  activeOrderCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.paymentType === item.paymentType
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.paymentType === item.paymentType
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, paymentType: CartPaymentType) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.paymentType === paymentType)));
  };

  const updateQuantity = (productId: string, paymentType: CartPaymentType, qty: number) => {
    if (qty <= 0) return removeItem(productId, paymentType);
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.paymentType === paymentType ? { ...i, quantity: qty } : i
      )
    );
  };

  const updateItemPaymentType = (
    productId: string,
    currentPaymentType: CartPaymentType,
    newPaymentType: CartPaymentType
  ) => {
    if (currentPaymentType === newPaymentType) return;
    setItems((prev) => {
      const target = prev.find((i) => i.productId === productId && i.paymentType === currentPaymentType);
      if (!target) return prev;
      const without = prev.filter((i) => !(i.productId === productId && i.paymentType === currentPaymentType));
      const existing = without.find((i) => i.productId === productId && i.paymentType === newPaymentType);
      if (existing) {
        return without.map((i) =>
          i.productId === productId && i.paymentType === newPaymentType
            ? { ...i, quantity: i.quantity + target.quantity }
            : i
        );
      }
      return [...without, { ...target, paymentType: newPaymentType }];
    });
  };

  const clearCart = () => setItems([]);

  const placeOrder = (paymentMethod: "Bank Transfer" | "Online Payment", buyerName: string) => {
    // Group items by distributor — one order per distributor for accurate tracking
    const groups: Record<string, CartItem[]> = {};
    items.forEach((it) => {
      if (!groups[it.distributorId]) groups[it.distributorId] = [];
      groups[it.distributorId].push(it);
    });
    const baseTs = Date.now();
    const newOrders: PlacedOrder[] = Object.entries(groups).map(([did, list], idx) => ({
      id: `o-${baseTs}-${idx}`,
      date: new Date().toISOString(),
      items: [...list],
      paymentMethod,
      buyerName,
      distributorId: did,
      distributorName: list[0].distributorName,
      status: "pending",
    }));
    setOrders((prev) => [...newOrders, ...prev]);
    setItems([]);
    return newOrders;
  };

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const stamp = new Date().toISOString();
        return {
          ...o,
          status,
          confirmedAt: status === "confirmed" ? stamp : o.confirmedAt,
          shippedAt: status === "shipped" ? stamp : o.shippedAt,
          deliveredAt: status === "delivered" ? stamp : o.deliveredAt,
        };
      })
    );
  }, []);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const cashTotal = items.filter((i) => i.paymentType === "cash").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const goodwillTotal = items.filter((i) => i.paymentType === "goodwill").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const activeOrderCount = orders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status)).length;

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addItem,
        removeItem,
        updateQuantity,
        updateItemPaymentType,
        clearCart,
        placeOrder,
        updateOrderStatus,
        itemCount,
        grandTotal,
        cashTotal,
        goodwillTotal,
        activeOrderCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
