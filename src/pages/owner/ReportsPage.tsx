import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/data/mockData";
import { useExpenses } from "@/contexts/ExpensesContext";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const periods = [
  { label: "This Week", key: "this-week", salesIdx: 6 },
  { label: "Last Week", key: "last-week", salesIdx: 5 },
  { label: "March 2026", key: "mar-2026", salesIdx: 4 },
  { label: "February 2026", key: "feb-2026", salesIdx: 3 },
  { label: "January 2026", key: "jan-2026", salesIdx: 2 },
];

const ReportsPage = () => {
  const navigate = useNavigate();
  const { expenses } = useExpenses();
  const [periodIndex, setPeriodIndex] = useState(0);
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  const currentPeriod = periods[periodIndex];
  const idx = currentPeriod.salesIdx;

  const topProducts = [...products].sort((a, b) => b.salesHistory[idx] - a.salesHistory[idx]).slice(0, 3);
  const slowProducts = [...products].sort((a, b) => a.salesHistory[idx] - b.salesHistory[idx]).slice(0, 3);
  const totalRevenue = products.reduce((s, p) => s + p.salesHistory[idx] * p.sellingPrice, 0);
  const totalProductCost = products.reduce((s, p) => s + p.salesHistory[idx] * (p.costPrice / p.unitsPerBuyingUnit), 0);

  // Operational expenses total (use all for simplicity since we don't have real period filtering on mock)
  const operationalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalCost = totalProductCost + operationalExpenses;
  const netProfit = totalRevenue - totalCost;

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-lg font-bold text-foreground mb-4">Reports</h1>

        {/* Period navigation */}
        <div className="flex items-center justify-between bg-card rounded-lg p-3 border border-border mb-4">
          <button
            onClick={() => setPeriodIndex((i) => Math.min(i + 1, periods.length - 1))}
            disabled={periodIndex >= periods.length - 1}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <span className="text-sm font-semibold text-foreground">{currentPeriod.label}</span>
          <button
            onClick={() => setPeriodIndex((i) => Math.max(i - 1, 0))}
            disabled={periodIndex <= 0}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Toggle */}
        <div className="flex rounded-lg bg-muted p-1 mb-4">
          {(["daily", "weekly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {p === "daily" ? "Daily" : "Weekly"}
            </button>
          ))}
        </div>

        {/* AI Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">AI Summary</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {period === "daily"
              ? "Strong day for Indomie with 47 units moved. Dangote Sugar needs urgent restocking. Cabin Biscuit continues to stall — consider discounting or bundling."
              : "Revenue is up 8% week-over-week. Indomie and Semovita are driving growth. Peak Milk sell-through rate is accelerating — increase stock to avoid stockout."}
          </p>
        </div>

        {/* Revenue & Cost cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => navigate(`/owner/reports/revenue?period=${periodIndex}`)}
            className="bg-card rounded-lg p-4 border border-border text-left active:opacity-80 transition-opacity"
          >
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold text-success">₦{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-primary mt-1">Tap for breakdown →</p>
          </button>
          <button
            onClick={() => navigate(`/owner/reports/cost?period=${periodIndex}`)}
            className="bg-card rounded-lg p-4 border border-border text-left active:opacity-80 transition-opacity"
          >
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-xl font-bold text-foreground">₦{Math.round(totalCost).toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Incl. ₦{operationalExpenses.toLocaleString()} expenses</p>
            <p className="text-[10px] text-primary mt-0.5">Tap for breakdown →</p>
          </button>
        </div>

        {/* Net Profit card */}
        <button
          onClick={() => navigate(`/owner/reports/profit?period=${periodIndex}`)}
          className="w-full bg-card rounded-lg p-4 border border-border text-left active:opacity-80 transition-opacity mb-4"
        >
          <p className="text-xs text-muted-foreground">Net Profit</p>
          <p className={`text-xl font-bold ${netProfit >= 0 ? "text-success" : "text-critical"}`}>
            ₦{Math.abs(Math.round(netProfit)).toLocaleString()}
            {netProfit < 0 && " (loss)"}
          </p>
          <p className={`text-[10px] mt-1 ${netProfit >= 0 ? "text-success" : "text-critical"}`}>
            {netProfit >= 0 ? "You are in profit" : "You are currently at a loss"}
          </p>
          <p className="text-[10px] text-primary mt-0.5">Tap for breakdown →</p>
        </button>

        {/* Top products */}
        <div className="bg-card rounded-lg p-4 border border-border mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Top Products</h3>
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">#{i + 1}</span>
                <span className="text-sm text-foreground">{p.name.split("(")[0].trim()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-sm font-semibold text-foreground">{p.salesHistory[idx]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Slowest */}
        <div className="bg-card rounded-lg p-4 border border-border mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Slowest Products</h3>
          {slowProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-foreground">{p.name.split("(")[0].trim()}</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-critical" />
                <span className="text-sm font-semibold text-foreground">{p.salesHistory[idx]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default ReportsPage;
