import { useNavigate } from "react-router-dom";
import { Bell, Settings, TrendingUp, TrendingDown, AlertTriangle, Package, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { businessName } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const topMovers = products.filter((p) => p.status === "healthy").slice(0, 3);
  const deadStock = products.filter((p) => p.status === "dead");
  const restockItems = products.filter((p) => p.status === "low" || p.status === "critical");
  const todayRevenue = products.reduce((s, p) => s + p.salesHistory[6] * p.sellingPrice, 0);
  const todayCost = products.reduce((s, p) => s + p.salesHistory[6] * (p.costPrice / p.unitsPerBuyingUnit), 0);

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="text-lg font-bold text-foreground">{businessName || "Mama Nkechi Provisions"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/owner/notifications")} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-critical text-[9px] text-primary-foreground flex items-center justify-center font-bold">3</span>
            </button>
            <button onClick={() => navigate("/owner/settings")} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Health Score */}
        <div onClick={() => navigate("/owner/health")} className="bg-card rounded-lg p-4 mb-4 border border-border cursor-pointer active:opacity-80 transition-opacity">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">Business Health Score</span>
            <Zap className="w-4 h-4 text-warning" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-warning">72</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted mt-3">
            <div className="h-full rounded-full bg-warning" style={{ width: "72%" }} />
          </div>
        </div>

        {/* AI Brief */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Daily Brief</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Your best seller today is <strong>Indomie</strong>. You are running low on <strong>Peak Milk</strong>. 
            Cabin Biscuit has not moved in <strong>9 days</strong> — consider a price drop.
          </p>
        </div>

        {/* Top Movers */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Top Moving Products</h2>
          <div className="grid grid-cols-3 gap-2">
            {topMovers.map((p, i) => (
              <div key={p.id} className="bg-card rounded-lg p-3 border border-border text-center">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="text-xs font-medium text-foreground truncate">{p.name.split("(")[0].trim()}</p>
                <p className="text-lg font-bold text-primary">{p.salesHistory[6]}</p>
                <p className="text-[10px] text-muted-foreground">sold today</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Stock */}
        {deadStock.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Dead Stock Alert</span>
            </div>
            {deadStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{p.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">No sales 9d</span>
              </div>
            ))}
          </div>
        )}

        {/* Restock Alerts */}
        <button onClick={() => navigate("/owner/restock")} className="w-full bg-card rounded-lg p-4 mb-4 border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Restock Alerts</p>
              <p className="text-xs text-muted-foreground">{restockItems.length} products need restocking</p>
            </div>
          </div>
          <span className="w-6 h-6 rounded-full bg-warning text-primary-foreground text-xs font-bold flex items-center justify-center">
            {restockItems.length}
          </span>
        </button>

        {/* Revenue Snapshot */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Today's Revenue</p>
            <p className="text-xl font-bold text-success">₦{todayRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-[10px] text-success">+12%</span>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Today's Cost</p>
            <p className="text-xl font-bold text-foreground">₦{Math.round(todayCost).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">steady</span>
            </div>
          </div>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default OwnerDashboard;
