import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Lock, Shield, Target, Sparkles } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const HealthBreakdownPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"breakdown" | "target">("breakdown");

  // Target state
  const [targetMetric, setTargetMetric] = useState<"revenue" | "units">("revenue");
  const [targetPeriod, setTargetPeriod] = useState<"week" | "month" | "custom">("week");
  const [targetAmount, setTargetAmount] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [targetConfirmed, setTargetConfirmed] = useState(false);

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
  const totalExpenses = Math.round(totalCostOfGoods * 0.12);
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

  const handleAnalyse = () => {
    if (!targetAmount) return;
    setAnalysing(true);
    setTimeout(() => {
      const target = parseInt(targetAmount);
      const dailyNeeded = targetMetric === "revenue"
        ? Math.ceil(target / 7)
        : Math.ceil(target / 7);
      
      setAnalysis(
        targetMetric === "revenue"
          ? `Based on your current weekly revenue of ${fmt(weeklyRevenue)}, a target of ${fmt(target)} is ${target <= weeklyRevenue * 1.3 ? "realistic" : "ambitious but achievable with effort"}.\n\n` +
            `Daily target: ${fmt(dailyNeeded)} per day.\n\n` +
            `Top products to push:\n• Indomie Chicken — high demand, good margins\n• Dangote Sugar — fast mover, low stock\n• Peak Milk — consistent seller\n\n` +
            `Restock recommendation: Order more Dangote Sugar and Semovita before mid-week.\n\n` +
            `Consider adjusting Indomie pricing slightly upward — current market supports it.`
          : `A target of ${target} units is ${target <= 100 ? "realistic" : "ambitious"} based on your current weekly average of 87 units.\n\n` +
            `Daily target: ${dailyNeeded} units per day.\n\n` +
            `Focus areas:\n• Indomie Chicken has the highest velocity — assign agents to push it\n• Bundle Dangote Sugar with Peak Milk for combo deals\n• Ensure adequate stock levels before the week starts\n\n` +
            `Agent tip: Brief your team on daily targets and incentivize hitting milestones.`
      );
      setAnalysing(false);
    }, 2000);
  };

  const handleConfirmTarget = () => {
    setTargetConfirmed(true);
    setTimeout(() => setTargetConfirmed(false), 3000);
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Business Health Score</h1>
          <div className="w-12" />
        </div>

        {/* Score */}
        <div className="flex flex-col items-center mb-4">
          <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
          <span className="text-sm text-muted-foreground">/100</span>
          <div className="w-full h-3 rounded-full bg-muted mt-4">
            <div className={`h-full rounded-full ${scoreBg} transition-all`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "breakdown" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Breakdown
          </button>
          <button
            onClick={() => setActiveTab("target")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "target" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Set Target
          </button>
        </div>

        {activeTab === "breakdown" && (
          <>
            {/* Target progress if confirmed */}
            {targetConfirmed && targetAmount && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Active Target</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {targetMetric === "revenue" ? fmt(weeklyRevenue) : "87"} / {targetMetric === "revenue" ? fmt(parseInt(targetAmount)) : targetAmount}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (targetMetric === "revenue" ? weeklyRevenue / parseInt(targetAmount) : 87 / parseInt(targetAmount)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

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
          </>
        )}

        {activeTab === "target" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Target metric</label>
              <div className="flex bg-muted rounded-xl p-1">
                <button
                  onClick={() => setTargetMetric("revenue")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    targetMetric === "revenue" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setTargetMetric("units")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    targetMetric === "units" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Units Sold
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Time period</label>
              <div className="flex bg-muted rounded-xl p-1">
                {(["week", "month", "custom"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTargetPeriod(p)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      targetPeriod === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Target {targetMetric === "revenue" ? "amount (₦)" : "units"}
              </label>
              <input
                type="number"
                placeholder={targetMetric === "revenue" ? "e.g. 100000" : "e.g. 200"}
                value={targetAmount}
                onChange={(e) => { setTargetAmount(e.target.value); setAnalysis(null); }}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={handleAnalyse}
              disabled={!targetAmount || analysing}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {analysing ? "Analysing..." : "Analyse Target"}
            </button>

            {analysis && (
              <div className="bg-card rounded-xl p-4 border border-border animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI Assessment</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{analysis}</p>
              </div>
            )}

            {analysis && (
              <button
                onClick={handleConfirmTarget}
                className="w-full py-3 rounded-xl bg-success text-primary-foreground text-sm font-bold flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" />
                Confirm Target
              </button>
            )}

            {targetConfirmed && (
              <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center animate-fade-in">
                <p className="text-sm text-success font-medium">Target confirmed! 🎯</p>
                <p className="text-xs text-muted-foreground mt-1">Notifications sent to all sub accounts</p>
              </div>
            )}
          </div>
        )}
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default HealthBreakdownPage;
