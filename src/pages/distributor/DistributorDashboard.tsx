import { useNavigate } from "react-router-dom";
import { Bell, Settings, Zap, ClipboardList, AlertTriangle, Package, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDistributor } from "@/contexts/DistributorContext";
import DistributorBottomNav from "@/components/DistributorBottomNav";

const DistributorDashboard = () => {
  const navigate = useNavigate();
  const { businessName } = useAuth();
  const { products, orders } = useDistributor();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Health score calculation
  const inventoryValue = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0);
  const cashReceived = orders
    .filter((o) => o.status === "confirmed")
    .reduce((s, o) => s + o.items.filter(i => i.paymentType === "cash").reduce((ss, i) => ss + i.qty * i.unitPrice, 0), 0);
  const cashInPromise = orders
    .filter((o) => o.status === "confirmed")
    .reduce((s, o) => s + o.items.filter(i => i.paymentType === "goodwill").reduce((ss, i) => ss + i.qty * i.unitPrice, 0), 0);
  const totalAssets = inventoryValue + cashReceived + cashInPromise;
  const totalCOGS = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0);
  const score = totalAssets + totalCOGS > 0 ? Math.round((totalAssets / (totalAssets + totalCOGS)) * 100) : 0;

  const today = new Date().toDateString();
  const todaysOrders = orders.filter((o) => new Date(o.date).toDateString() === today);
  const todayValue = todaysOrders.reduce(
    (s, o) => s + o.items.reduce((ss, i) => ss + i.qty * i.unitPrice, 0),
    0
  );

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="text-lg font-bold text-foreground">{businessName || "Peak Milk Depot"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/distributor/notifications")} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-critical text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                {orders.filter(o => o.status === "pending").length}
              </span>
            </button>
            <button onClick={() => navigate("/distributor/settings")} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-card rounded-lg p-4 mb-4 border border-border cursor-pointer active:opacity-80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">Business Health Score</span>
            <Zap className="w-4 h-4 text-warning" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-bold ${score >= 71 ? "text-success" : score >= 41 ? "text-warning" : "text-critical"}`}>{score}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted mt-3">
            <div
              className={`h-full rounded-full ${score >= 71 ? "bg-success" : score >= 41 ? "bg-warning" : "bg-critical"}`}
              style={{ width: `${score}%` }}
            />
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
            <strong>{todaysOrders.length} new orders</strong> received today. Peak Milk stock is running low. 
            <strong> 2 businesses</strong> are due for goodwill repayment this week.
          </p>
        </div>

        {/* Today's Orders */}
        <button
          onClick={() => navigate("/distributor/orders")}
          className="w-full bg-card rounded-lg p-4 mb-4 border border-border flex items-center justify-between active:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Today's Orders</p>
              <p className="text-xs text-muted-foreground">{todaysOrders.length} orders received</p>
            </div>
          </div>
          <p className="text-lg font-bold text-primary">₦{todayValue.toLocaleString()}</p>
        </button>

        {/* Request Feed */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Request Feed</h2>
        {orders.length === 0 ? (
          <div className="bg-card rounded-lg p-6 border border-border text-center">
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {orders.map((o) => {
              const total = o.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
              const hasGoodwill = o.items.some((i) => i.paymentType === "goodwill");
              return (
                <div key={o.id} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <button
                      onClick={() => navigate(`/distributor/owner/${o.buyerId}`)}
                      className="flex items-center gap-2 text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground hover:underline">{o.buyerName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(o.date).toLocaleString()}
                        </p>
                      </div>
                    </button>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        o.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : o.status === "confirmed"
                          ? "bg-success/10 text-success"
                          : "bg-critical/10 text-critical"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {i.productName} × {i.qty}
                        </span>
                        <span className="text-foreground">₦{(i.qty * i.unitPrice).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${hasGoodwill ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                      {hasGoodwill ? "Goodwill" : "Paid"}
                    </span>
                    <button
                      onClick={() => navigate(`/distributor/order/${o.id}`)}
                      className="text-xs text-primary font-semibold"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <DistributorBottomNav />
    </div>
  );
};

export default DistributorDashboard;
