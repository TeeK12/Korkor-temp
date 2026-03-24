import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Lock, Shield } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const HealthBreakdownPage = () => {
  const navigate = useNavigate();

  // Assets
  const inventoryValue = products.reduce(
    (s, p) => s + p.currentStock * (p.costPrice / p.unitsPerBuyingUnit),
    0
  );
  const weeklyRevenue = products.reduce(
    (s, p) => s + p.salesHistory.reduce((a, b) => a + b, 0) * p.sellingPrice,
    0
  );
  const totalAssets = inventoryValue + weeklyRevenue;

  // Liabilities
  const totalCostOfGoods = products.reduce((s, p) => s + p.costPrice * Math.ceil(p.currentStock / p.unitsPerBuyingUnit), 0);
  const totalExpenses = Math.round(totalCostOfGoods * 0.12); // simulated 12% overhead
  const deadStockValue = products
    .filter((p) => p.status === "dead")
    .reduce((s, p) => s + p.currentStock * (p.costPrice / p.unitsPerBuyingUnit), 0);
  const totalLiabilities = totalCostOfGoods + totalExpenses + deadStockValue;

  // Score
  const score = totalAssets + totalLiabilities > 0
    ? Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)
    : 50;

  const scoreColor = score <= 40 ? "text-critical" : score <= 70 ? "text-warning" : "text-success";
  const scoreBg = score <= 40 ? "bg-critical" : score <= 70 ? "bg-warning" : "bg-success";
  const diff = Math.abs(totalAssets - totalLiabilities);
  const isHealthy = totalAssets >= totalLiabilities;
  const pointsToTarget = Math.max(0, 80 - score);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Business Health Score</h1>
          <div className="w-12" />
        </div>

        {/* Score */}
        <div className="flex flex-col items-center mb-6">
          <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
          <span className="text-sm text-muted-foreground">/100</span>
          <div className="w-full h-3 rounded-full bg-muted mt-4">
            <div className={`h-full rounded-full ${scoreBg} transition-all`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Assets */}
        <div className="bg-card rounded-lg p-4 mb-3 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-foreground">Your Assets</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total inventory value</span>
              <span className="text-sm text-foreground">{fmt(Math.round(inventoryValue))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue this week</span>
              <span className="text-sm text-foreground">{fmt(weeklyRevenue)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-sm font-semibold text-foreground">Total Assets</span>
              <span className="text-base font-bold text-success">{fmt(Math.round(totalAssets))}</span>
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-card rounded-lg p-4 mb-3 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-critical" />
            <span className="text-sm font-semibold text-foreground">Your Liabilities</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cost of goods</span>
              <span className="text-sm text-foreground">{fmt(totalCostOfGoods)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total expenses</span>
              <span className="text-sm text-foreground">{fmt(totalExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dead stock value</span>
              <span className="text-sm text-warning">{fmt(Math.round(deadStockValue))}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-sm font-semibold text-foreground">Total Liabilities</span>
              <span className="text-base font-bold text-critical">{fmt(Math.round(totalLiabilities))}</span>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className={`rounded-lg p-4 mb-4 border ${isHealthy ? "bg-success/5 border-success/20" : "bg-critical/5 border-critical/20"}`}>
          <p className="text-sm text-foreground leading-relaxed">
            {isHealthy
              ? `Your assets exceed your liabilities by ${fmt(diff)}. Your business is healthy.`
              : `Your liabilities are higher than your assets by ${fmt(diff)}. You are currently operating at a loss.`}
          </p>
        </div>

        {/* Why This Matters */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Why This Matters</h2>

        <div className="bg-card rounded-lg p-4 mb-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Distributor Access</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A score of 80+ unlocks the verified distributor network.{" "}
            {pointsToTarget > 0
              ? `You are ${pointsToTarget} points away.`
              : "You have access!"}
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Future Loan Eligibility</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consistent healthy scores build your credit profile for loan access through Bulkbook partners.
          </p>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default HealthBreakdownPage;
