import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { useSales } from "@/contexts/SalesContext";
import OwnerBottomNav from "@/components/OwnerBottomNav";
import { toast } from "sonner";

const PromiseTrackerPage = () => {
  const navigate = useNavigate();
  const { getPromiseSales, markPromisePaid, getCashInPromise } = useSales();
  const promises = getPromiseSales().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalOutstanding = getCashInPromise();

  const getDaysOutstanding = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / 86400000);
  };

  const handleMarkPaid = (id: string) => {
    markPromisePaid(id);
    toast.success("Marked as paid — moved to Cash In Hand");
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Cash In Promise</h1>
          <div className="w-12" />
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold text-primary">₦{totalOutstanding.toLocaleString()}</p>
        </div>

        {promises.length === 0 ? (
          <div className="text-center py-12">
            <Check className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No outstanding promises</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promises.map((s) => {
              const days = getDaysOutstanding(s.date);
              const borderColor = days > 14 ? "border-critical" : days > 7 ? "border-warning" : "border-border";
              return (
                <div key={s.id} className={`bg-card rounded-xl p-4 border ${borderColor}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        ₦{s.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {days > 7 && <AlertTriangle className={`w-3.5 h-3.5 ${days > 14 ? "text-critical" : "text-warning"}`} />}
                      <span className={`text-xs font-medium ${days > 14 ? "text-critical" : days > 7 ? "text-warning" : "text-muted-foreground"}`}>
                        {days}d ago
                      </span>
                    </div>
                  </div>
                  {s.customerNote && (
                    <p className="text-xs text-primary mb-2">"{s.customerNote}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">{new Date(s.date).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleMarkPaid(s.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success text-primary-foreground text-xs font-medium"
                    >
                      <Check className="w-3 h-3" />
                      Mark as Paid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default PromiseTrackerPage;
