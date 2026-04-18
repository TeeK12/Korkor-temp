import { useNavigate } from "react-router-dom";
import { Zap, TrendingUp, Receipt } from "lucide-react";
import { useDistributor } from "@/contexts/DistributorContext";
import DistributorBottomNav from "@/components/DistributorBottomNav";

const DistributorReportsPage = () => {
  const navigate = useNavigate();
  const { orders, products } = useDistributor();

  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const revenue = confirmedOrders.reduce(
    (s, o) => s + o.items.reduce((ss, i) => ss + i.qty * i.unitPrice, 0),
    0
  );
  const cost = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0);
  const netProfit = revenue - cost;

  // Goodwill repayment tracker — synthetic data based on confirmed goodwill orders
  const goodwillEntries = confirmedOrders.flatMap((o) =>
    o.items
      .filter((i) => i.paymentType === "goodwill")
      .map((i) => {
        const dueInDays = 30 - Math.floor((Date.now() - new Date(o.date).getTime()) / (1000 * 60 * 60 * 24));
        const product = products.find((p) => p.id === i.productId);
        const totalSold = product ? Math.floor(product.currentStock * 0.4) : 0;
        return {
          orderId: o.id,
          buyerId: o.buyerId,
          buyerName: o.buyerName,
          productName: i.productName,
          value: i.qty * i.unitPrice,
          dueInDays,
          progressPct: Math.round((totalSold / (i.qty || 1)) * 100),
        };
      })
  );

  // Add some seed entries if none
  if (goodwillEntries.length === 0) {
    goodwillEntries.push({
      orderId: "seed1",
      buyerId: "owner-mn",
      buyerName: "Mama Nkechi Provisions",
      productName: "Peak Milk (Tin)",
      value: 17500,
      dueInDays: 12,
      progressPct: 80,
    });
  }

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-2xl font-bold text-foreground mb-6">Reports</h1>

        {/* Revenue / Cost / Net Profit */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <p className="text-xl font-bold text-success">₦{revenue.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Cost</p>
            <p className="text-xl font-bold text-foreground">₦{cost.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border mb-6">
          <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-success" : "text-critical"}`}>
            ₦{netProfit.toLocaleString()}
          </p>
        </div>

        {/* AI Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Summary</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Mama Nkechi Provisions</strong> has sold 80% of the Peak Milk you sent on goodwill. 
            Repayment due in <strong>12 days</strong>. Consider reaching out.
          </p>
        </div>

        {/* Goodwill Repayment Tracker */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Businesses Due for Repayment</h3>
        <div className="space-y-3">
          {goodwillEntries.map((g, idx) => {
            const status =
              g.dueInDays < 0 ? "overdue" : g.dueInDays <= 7 ? "warning" : "good";
            const colorClass =
              status === "overdue"
                ? "text-critical bg-critical/10"
                : status === "warning"
                ? "text-warning bg-warning/10"
                : "text-success bg-success/10";
            return (
              <div key={idx} className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => navigate(`/distributor/owner/${g.buyerId}`)}
                    className="text-sm font-semibold text-foreground hover:underline"
                  >
                    {g.buyerName}
                  </button>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${colorClass}`}>
                    {g.dueInDays < 0 ? `${-g.dueInDays}d overdue` : `${g.dueInDays}d left`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">{g.productName}</span>
                  <span className="text-foreground font-medium">₦{g.value.toLocaleString()}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Sold so far</span>
                    <span className="text-foreground">{g.progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${Math.min(100, g.progressPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DistributorBottomNav />
    </div>
  );
};

export default DistributorReportsPage;
