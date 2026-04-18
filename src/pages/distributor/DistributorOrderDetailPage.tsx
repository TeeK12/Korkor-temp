import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Check, X } from "lucide-react";
import { useDistributor } from "@/contexts/DistributorContext";
import { toast } from "sonner";

const DistributorOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, setOrderStatus } = useDistributor();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="app-shell dark bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const total = order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const confirm = () => {
    setOrderStatus(order.id, "confirmed");
    toast.success("Order confirmed. Owner has been notified.");
    navigate(-1);
  };

  const decline = () => {
    setOrderStatus(order.id, "declined");
    toast.error("Order declined.");
    navigate(-1);
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Order Details</h1>

        <button
          onClick={() => navigate(`/distributor/owner/${order.buyerId}`)}
          className="w-full bg-card rounded-lg p-4 border border-border flex items-center gap-3 mb-4 active:opacity-80"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">{order.buyerName}</p>
            <p className="text-xs text-muted-foreground">{order.buyerLocation}</p>
          </div>
          <span className="text-xs text-primary">View profile →</span>
        </button>

        <h3 className="text-sm font-semibold text-foreground mb-2">Items</h3>
        <div className="space-y-2 mb-4">
          {order.items.map((i, idx) => (
            <div key={idx} className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{i.productName}</p>
                  <p className="text-xs text-muted-foreground">{i.qty} × ₦{i.unitPrice.toLocaleString()}</p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    i.paymentType === "goodwill"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {i.paymentType === "goodwill" ? "Goodwill" : "Paid"}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground text-right">
                ₦{(i.qty * i.unitPrice).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg p-4 border border-border mb-6">
          <div className="flex items-center justify-between mb-1 text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span className="text-foreground">{order.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">₦{total.toLocaleString()}</span>
          </div>
        </div>

        {order.status === "pending" && (
          <div className="flex gap-3">
            <button
              onClick={decline}
              className="flex-1 h-12 rounded-lg border border-critical text-critical text-sm font-bold flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Decline
            </button>
            <button
              onClick={confirm}
              className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorOrderDetailPage;
