import { useState } from "react";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const ReportsPage = () => {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  const topProducts = [...products].sort((a, b) => b.salesHistory[6] - a.salesHistory[6]).slice(0, 3);
  const slowProducts = [...products].sort((a, b) => a.salesHistory[6] - b.salesHistory[6]).slice(0, 3);
  const totalRevenue = products.reduce((s, p) => s + p.salesHistory[6] * p.sellingPrice, 0);
  const totalCost = products.reduce((s, p) => s + p.salesHistory[6] * (p.costPrice / p.unitsPerBuyingUnit), 0);

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-lg font-bold text-foreground mb-4">Reports</h1>

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

        {/* Revenue */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold text-success">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-xl font-bold text-foreground">₦{Math.round(totalCost).toLocaleString()}</p>
          </div>
        </div>

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
                <span className="text-sm font-semibold text-foreground">{p.salesHistory[6]}</span>
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
                <span className="text-sm font-semibold text-foreground">{p.salesHistory[6]}</span>
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
