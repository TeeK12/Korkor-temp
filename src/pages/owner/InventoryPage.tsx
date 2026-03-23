import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Package } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const statusColors: Record<string, string> = {
  healthy: "bg-success/15 text-success",
  low: "bg-warning/15 text-warning",
  critical: "bg-critical/15 text-critical",
  dead: "bg-muted text-muted-foreground",
};

const InventoryPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "dead" | "healthy">("all");

  const filtered = products.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    if (filter === "all") return matchQuery;
    if (filter === "low") return matchQuery && (p.status === "low" || p.status === "critical");
    return matchQuery && p.status === filter;
  });

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-lg font-bold text-foreground mb-4">Inventory</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(["all", "healthy", "low", "dead"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "low" ? "Low Stock" : f === "dead" ? "Dead Stock" : "Healthy"}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="space-y-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/owner/product/${p.id}`)}
              className="w-full bg-card rounded-lg p-4 border border-border flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">{p.currentStock}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/owner/product/add")}
        className="absolute bottom-24 right-5 z-20 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </button>

      <OwnerBottomNav />
    </div>
  );
};

export default InventoryPage;
