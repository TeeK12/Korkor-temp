export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  /** Original full stock when this batch was added (used for % thresholds). Optional for legacy data. */
  openingStock?: number;
  buyingUnit: string;
  sellingUnit: string;
  unitsPerBuyingUnit: number;
  costPrice: number;
  sellingPrice: number;
  totalRevenue: number;
  status: "healthy" | "low" | "critical" | "dead";
  salesHistory: number[];
  stockLog: { date: string; action: string; qty: number; by: string }[];
  // ISO date of last recorded sale (used for "Dead" detection — 30 days no sales)
  lastSaleDate?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  lastActive: string;
  todaySales: number;
  status: "active" | "inactive";
  salesLog: { time: string; product: string; qty: number; value: number }[];
}

export interface Notification {
  id: string;
  type: "restock" | "agent" | "insight" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface FeedItem {
  id: string;
  category: "tips" | "market" | "updates";
  title: string;
  summary: string;
  content: string;
  readTime: string;
}

export const products: Product[] = [
  {
    id: "1", name: "Indomie Chicken (70g)", category: "Provisions",
    currentStock: 245, buyingUnit: "Carton", sellingUnit: "Piece",
    unitsPerBuyingUnit: 40, costPrice: 5800, sellingPrice: 200,
    totalRevenue: 184000, status: "healthy",
    salesHistory: [32, 45, 28, 52, 38, 41, 47],
    stockLog: [
      { date: "Today 2:30 PM", action: "Sold", qty: 12, by: "Chidi" },
      { date: "Today 11:00 AM", action: "Sold", qty: 8, by: "Amaka" },
      { date: "Yesterday", action: "Restocked", qty: 80, by: "Owner" },
    ],
  },
  {
    id: "2", name: "Peak Milk (Tin)", category: "Provisions",
    currentStock: 18, buyingUnit: "Carton", sellingUnit: "Piece",
    unitsPerBuyingUnit: 24, costPrice: 7200, sellingPrice: 400,
    totalRevenue: 96000, status: "low",
    salesHistory: [12, 18, 15, 20, 14, 16, 19],
    stockLog: [
      { date: "Today 1:15 PM", action: "Sold", qty: 4, by: "Chidi" },
      { date: "Today 9:30 AM", action: "Sold", qty: 6, by: "Amaka" },
    ],
  },
  {
    id: "3", name: "Golden Penny Semovita (2kg)", category: "Provisions",
    currentStock: 62, buyingUnit: "Bag", sellingUnit: "Piece",
    unitsPerBuyingUnit: 10, costPrice: 12000, sellingPrice: 1500,
    totalRevenue: 210000, status: "healthy",
    salesHistory: [8, 12, 6, 10, 9, 11, 7],
    stockLog: [
      { date: "Today 3:00 PM", action: "Sold", qty: 3, by: "Chidi" },
    ],
  },
  {
    id: "4", name: "Cabin Biscuit", category: "Provisions",
    currentStock: 48, buyingUnit: "Carton", sellingUnit: "Piece",
    unitsPerBuyingUnit: 48, costPrice: 4800, sellingPrice: 150,
    totalRevenue: 12000, status: "dead",
    salesHistory: [0, 0, 1, 0, 0, 0, 0],
    stockLog: [
      { date: "9 days ago", action: "Sold", qty: 1, by: "Amaka" },
    ],
  },
  {
    id: "5", name: "Dangote Sugar (500g)", category: "Provisions",
    currentStock: 5, buyingUnit: "Bag", sellingUnit: "Piece",
    unitsPerBuyingUnit: 20, costPrice: 8500, sellingPrice: 550,
    totalRevenue: 132000, status: "critical",
    salesHistory: [15, 22, 18, 20, 25, 19, 23],
    stockLog: [
      { date: "Today 4:00 PM", action: "Sold", qty: 5, by: "Chidi" },
      { date: "Today 12:00 PM", action: "Sold", qty: 8, by: "Amaka" },
    ],
  },
  {
    id: "6", name: "Bama Mayonnaise (500ml)", category: "Provisions",
    currentStock: 30, buyingUnit: "Carton", sellingUnit: "Piece",
    unitsPerBuyingUnit: 12, costPrice: 6000, sellingPrice: 650,
    totalRevenue: 45500, status: "healthy",
    salesHistory: [5, 3, 7, 4, 6, 5, 4],
    stockLog: [
      { date: "Today 1:00 PM", action: "Sold", qty: 2, by: "Chidi" },
    ],
  },
];

export const agents: Agent[] = [
  {
    id: "1", name: "Chidi Okonkwo", role: "Sales Agent",
    lastActive: "5 mins ago", todaySales: 14, status: "active",
    salesLog: [
      { time: "4:30 PM", product: "Indomie Chicken", qty: 5, value: 1000 },
      { time: "3:15 PM", product: "Dangote Sugar", qty: 3, value: 1650 },
      { time: "2:00 PM", product: "Peak Milk", qty: 2, value: 800 },
      { time: "11:45 AM", product: "Semovita", qty: 1, value: 1500 },
      { time: "10:00 AM", product: "Indomie Chicken", qty: 3, value: 600 },
    ],
  },
  {
    id: "2", name: "Amaka Eze", role: "Store Manager",
    lastActive: "2 hrs ago", todaySales: 8, status: "active",
    salesLog: [
      { time: "1:00 PM", product: "Peak Milk", qty: 4, value: 1600 },
      { time: "11:30 AM", product: "Indomie Chicken", qty: 6, value: 1200 },
      { time: "9:00 AM", product: "Bama Mayonnaise", qty: 2, value: 1300 },
    ],
  },
];

export const notifications: Notification[] = [
  { id: "1", type: "restock", title: "Low Stock Alert", message: "Dangote Sugar is critically low — only 5 pieces left", time: "10 mins ago", read: false },
  { id: "2", type: "agent", title: "Agent Activity", message: "Chidi recorded 14 sales today — above average", time: "1 hr ago", read: false },
  { id: "3", type: "insight", title: "AI Insight", message: "Cabin Biscuit hasn't moved in 9 days. Consider a price drop or bundle deal.", time: "3 hrs ago", read: true },
  { id: "4", type: "system", title: "Bulkbook Update", message: "New feature: Stock count verification now available for agents", time: "Yesterday", read: true },
  { id: "5", type: "restock", title: "Low Stock Alert", message: "Peak Milk is running low — 18 pieces remaining", time: "Yesterday", read: true },
];

export const feedItems: FeedItem[] = [
  {
    id: "1", category: "tips", title: "How to Price for Profit in Nigerian Markets",
    summary: "Most small businesses undercharge. Here's how to fix that without losing customers.",
    content: "Pricing is the single most impactful lever for profitability. In Nigerian markets, many sellers price based on competitor imitation rather than cost analysis. Start by knowing your true cost — include transport, storage, and spoilage. Then add your margin. A healthy margin for provisions is 15-25%. Don't compete on price alone — compete on availability and trust.",
    readTime: "2 min",
  },
  {
    id: "2", category: "market", title: "Sugar Prices Expected to Rise in Q2",
    summary: "BUA and Dangote both signalling price increases. Stock up now if you can.",
    content: "Multiple sources confirm that both BUA Sugar and Dangote Sugar will increase ex-factory prices by 8-12% in Q2 2026. This is driven by rising raw material costs and FX pressure. If sugar is a fast mover in your store, consider increasing your stock now at current prices. This could protect your margin for the next 2-3 months.",
    readTime: "2 min",
  },
  {
    id: "3", category: "updates", title: "Distributor Network Coming Soon",
    summary: "Verified distributors will be available to active Bulkbook businesses.",
    content: "We're building a verified distributor network that connects Bulkbook businesses directly to manufacturers and authorized distributors. No middlemen. Better prices. Expected launch: Q3 2026. Businesses that have been active on Bulkbook for 90+ days will get first access.",
    readTime: "1 min",
  },
  {
    id: "4", category: "tips", title: "Why You Should Track Dead Stock Weekly",
    summary: "Dead stock is money sitting on your shelf doing nothing. Here's what to do about it.",
    content: "Dead stock — products that haven't sold in 7+ days — is one of the biggest silent killers of small business profitability. Every week, review your dead stock list. Options: discount it, bundle it with popular items, return to supplier if possible, or mark it down and clear it. The goal is to convert idle inventory back into cash flow.",
    readTime: "2 min",
  },
];

export const businessCategories = [
  "Provisions", "Fashion", "Electronics", "Food", "Cosmetics", "Building Materials", "Other",
];

export const unitTypes = [
  "Carton", "Bag", "Roll", "Piece", "Kg", "Litre", "Pack", "Dozen", "Bundle",
];

export const nigerianStates = [
  "Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Anambra", "Kaduna", "Ogun", "Enugu", "Delta",
  "Edo", "Imo", "Kwara", "Osun", "Ondo", "Abia", "Cross River", "Akwa Ibom", "Bayelsa", "Other",
];
