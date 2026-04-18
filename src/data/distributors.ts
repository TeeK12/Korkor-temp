export type PaymentMethodAccepted = "Cash" | "Bank Transfer" | "Online Payment" | "Goodwill";

export interface DistributorProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  availableQty: number;
  image?: string;
  goodwillAvailable?: boolean;
  goodwillRepaymentDays?: number;
}

export interface Distributor {
  id: string;
  name: string;
  logo: string;
  location: string;
  categories: string[];
  freeShippingThreshold?: number;
  paymentMethods: PaymentMethodAccepted[];
  rating?: number;
  products: DistributorProduct[];
}

export const distributors: Distributor[] = [
  {
    id: "d1",
    name: "Dangote Distribution Hub",
    logo: "D",
    location: "Iganmu, Lagos",
    categories: ["Provisions", "Grains"],
    freeShippingThreshold: 50000,
    paymentMethods: ["Cash", "Bank Transfer", "Online Payment", "Goodwill"],
    rating: 4.8,
    products: [
      { id: "dp1", name: "Dangote Sugar (500g)", category: "Provisions", price: 420, availableQty: 5000, goodwillAvailable: true, goodwillRepaymentDays: 30 },
      { id: "dp2", name: "Dangote Salt (250g)", category: "Provisions", price: 150, availableQty: 3200 },
      { id: "dp3", name: "Dangote Pasta (500g)", category: "Grains", price: 380, availableQty: 1800, goodwillAvailable: true, goodwillRepaymentDays: 30 },
    ],
  },
  {
    id: "d2",
    name: "Peak Milk Depot",
    logo: "P",
    location: "Ikeja, Lagos",
    categories: ["Dairy"],
    freeShippingThreshold: 30000,
    paymentMethods: ["Cash", "Bank Transfer", "Goodwill"],
    rating: 4.6,
    products: [
      { id: "dp4", name: "Peak Milk (Tin)", category: "Dairy", price: 350, availableQty: 2400, goodwillAvailable: true, goodwillRepaymentDays: 60 },
      { id: "dp5", name: "Peak Milk (Sachet x10)", category: "Dairy", price: 280, availableQty: 4000 },
    ],
  },
  {
    id: "d3",
    name: "Mama Gold Wholesale",
    logo: "M",
    location: "Apapa, Lagos",
    categories: ["Provisions", "Grains", "Beverages"],
    paymentMethods: ["Cash", "Bank Transfer", "Online Payment"],
    rating: 4.5,
    products: [
      { id: "dp6", name: "Indomie Chicken (70g)", category: "Provisions", price: 140, availableQty: 10000 },
      { id: "dp7", name: "Golden Penny Semovita (2kg)", category: "Grains", price: 1200, availableQty: 800 },
      { id: "dp8", name: "Bama Mayonnaise (500ml)", category: "Provisions", price: 520, availableQty: 600 },
    ],
  },
];

// Flatten all products with distributor info for the feed
export const distributorFeedItems = distributors.flatMap((d) =>
  d.products.map((p) => ({
    ...p,
    distributorId: d.id,
    distributorName: d.name,
  }))
);
