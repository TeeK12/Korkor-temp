import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartPaymentType = "cash" | "goodwill";

export interface CartItem {
  productId: string;
  productName: string;
  distributorId: string;
  distributorName: string;
  unitPrice: number;
  quantity: number;
  paymentType: CartPaymentType;
  goodwillRepaymentDays?: number;
}

export interface PlacedOrder {
  id: string;
  date: string;
  items: CartItem[];
  paymentMethod: "Bank Transfer" | "Online Payment";
  buyerName: string;
  status: "pending" | "confirmed" | "declined";
}

interface CartContextType {
  items: CartItem[];
  orders: PlacedOrder[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, paymentType: CartPaymentType) => void;
  updateQuantity: (productId: string, paymentType: CartPaymentType, qty: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: "Bank Transfer" | "Online Payment", buyerName: string) => PlacedOrder;
  itemCount: number;
  grandTotal: number;
  cashTotal: number;
  goodwillTotal: number;
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

  const clearCart = () => setItems([]);

  const placeOrder = (paymentMethod: "Bank Transfer" | "Online Payment", buyerName: string) => {
    const order: PlacedOrder = {
      id: `o-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      paymentMethod,
      buyerName,
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    setItems([]);
    return order;
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const cashTotal = items.filter((i) => i.paymentType === "cash").reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const goodwillTotal = items.filter((i) => i.paymentType === "goodwill").reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, orders, addItem, removeItem, updateQuantity, clearCart, placeOrder, itemCount, grandTotal, cashTotal, goodwillTotal }}>
      {children}
    </CartContext.Provider>
  );
};
