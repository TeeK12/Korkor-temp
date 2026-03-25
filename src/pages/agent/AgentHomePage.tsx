import { useNavigate } from "react-router-dom";
import { ShoppingCart, TrendingUp, Flame, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

const AgentHomePage = () => {
  const navigate = useNavigate();
  const { userName, isAuthorized, businessName } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const todaySales = 14;
  const dailyTarget = 25;
  const totalValue = 8750;
  const progress = (todaySales / dailyTarget) * 100;

  const recentSales = [
    { time: "4:30 PM", product: "Indomie Chicken", qty: 5, value: 1000 },
    { time: "3:15 PM", product: "Dangote Sugar", qty: 3, value: 1650 },
    { time: "2:00 PM", product: "Peak Milk", qty: 2, value: 800 },
    { time: "11:45 AM", product: "Semovita 2kg", qty: 1, value: 1500 },
    { time: "10:00 AM", product: "Indomie Chicken", qty: 3, value: 600 },
  ];

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-5">
        {/* Greeting */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{greeting},</p>
          <h1 className="text-xl font-bold text-foreground">{userName || "Chidi"} 👋</h1>
        </div>

        {/* Unauthorized banner */}
        {!isAuthorized && (
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Your account is pending authorization</p>
              <p className="text-xs text-muted-foreground mt-0.5">Contact your business owner to get full access.</p>
            </div>
          </div>
        )}

        {/* Target Progress */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Today's Target</span>
            <span className="text-sm font-bold text-primary">{todaySales}/{dailyTarget}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{dailyTarget - todaySales} more to hit your daily target</p>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => isAuthorized && navigate("/agent/record-sale")}
          disabled={!isAuthorized}
          className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 mb-4 shadow-lg ${
            isAuthorized
              ? "bg-primary text-primary-foreground shadow-primary/20"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {!isAuthorized && <Lock className="w-4 h-4" />}
          <ShoppingCart className="w-5 h-5" />
          Record a Sale
        </button>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card rounded-2xl p-3 border border-border text-center">
            <p className="text-2xl font-bold text-primary">{todaySales}</p>
            <p className="text-[10px] text-muted-foreground">Sales</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border text-center">
            <p className="text-lg font-bold text-foreground">₦{totalValue.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Value</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-lg font-bold text-foreground">5</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Recent Sales</h2>
          <div className="space-y-2">
            {recentSales.map((sale, i) => (
              <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.product}</p>
                  <p className="text-xs text-muted-foreground">{sale.qty} units · {sale.time}</p>
                </div>
                <p className="text-sm font-bold text-success">₦{sale.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default AgentHomePage;
