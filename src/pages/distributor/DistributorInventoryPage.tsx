import { useNavigate } from "react-router-dom";
import { Plus, Package, Truck, Handshake } from "lucide-react";
import { useDistributor } from "@/contexts/DistributorContext";
import DistributorBottomNav from "@/components/DistributorBottomNav";

const DistributorInventoryPage = () => {
  const navigate = useNavigate();
  const { products } = useDistributor();

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-2xl font-bold text-foreground mb-6">Inventory</h1>

        <div className="space-y-3 mb-6">
          {products.length === 0 ? (
            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <p className="text-sm text-muted-foreground">No products yet</p>
            </div>
          ) : (
            products.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/distributor/inventory/${p.id}`)}
                className="w-full bg-card rounded-lg p-4 border border-border text-left active:opacity-80"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Stock: <span className="text-foreground font-medium">{p.currentStock.toLocaleString()}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Price: <span className="text-foreground font-medium">₦{p.sellingPrice.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.freeShippingThreshold && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
                          <Truck className="w-2.5 h-2.5" />
                          Free ship ₦{p.freeShippingThreshold.toLocaleString()}+
                        </span>
                      )}
                      {p.goodwillEnabled && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">
                          <Handshake className="w-2.5 h-2.5" />
                          Goodwill {p.goodwillRepaymentDays}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/distributor/inventory/add")}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg active:opacity-90 z-10"
          style={{ right: "max(1rem, calc(50% - 215px + 1rem))" }}
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>
      <DistributorBottomNav />
    </div>
  );
};

export default DistributorInventoryPage;
