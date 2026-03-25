export interface DistributorProduct {
  id: string;
  name: string;
  price: number;
  availableQty: number;
  image?: string;
}

export interface Distributor {
  id: string;
  name: string;
  logo: string;
  location: string;
  products: DistributorProduct[];
}

export const distributors: Distributor[] = [
  {
    id: "d1",
    name: "Dangote Distribution Hub",
    logo: "D",
    location: "Iganmu, Lagos",
    products: [
      { id: "dp1", name: "Dangote Sugar (500g)", price: 420, availableQty: 5000 },
      { id: "dp2", name: "Dangote Salt (250g)", price: 150, availableQty: 3200 },
      { id: "dp3", name: "Dangote Pasta (500g)", price: 380, availableQty: 1800 },
    ],
  },
  {
    id: "d2",
    name: "Peak Milk Depot",
    logo: "P",
    location: "Ikeja, Lagos",
    products: [
      { id: "dp4", name: "Peak Milk (Tin)", price: 350, availableQty: 2400 },
      { id: "dp5", name: "Peak Milk (Sachet x10)", price: 280, availableQty: 4000 },
    ],
  },
  {
    id: "d3",
    name: "Mama Gold Wholesale",
    logo: "M",
    location: "Apapa, Lagos",
    products: [
      { id: "dp6", name: "Indomie Chicken (70g)", price: 140, availableQty: 10000 },
      { id: "dp7", name: "Golden Penny Semovita (2kg)", price: 1200, availableQty: 800 },
      { id: "dp8", name: "Bama Mayonnaise (500ml)", price: 520, availableQty: 600 },
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
