import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Check, Camera } from "lucide-react";
import { products } from "@/data/mockData";
import AgentBottomNav from "@/components/AgentBottomNav";

const RecordSalePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const filtered = query.length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleConfirm = () => {
    if (!selectedProduct || !qty) return;
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setSelectedProduct(null);
      setQty("");
      setNote("");
      setQuery("");
      navigate("/agent");
    }, 1500);
  };

  if (confirmed) {
    return (
      <div className="app-shell bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-success animate-check-pop" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sale Recorded!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {qty} × {selectedProduct?.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-xl font-bold text-foreground mb-6">Record a Sale</h1>

        {!selectedProduct ? (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Results */}
            <div className="space-y-2">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProduct(p); setQuery(""); }}
                  className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₦{p.sellingPrice} per {p.sellingUnit.toLowerCase()}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.currentStock} in stock</span>
                </button>
              ))}
              {query.length > 0 && filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No products found</p>
              )}
              {query.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Type a product name to search</p>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Selected product */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground">{selectedProduct.name}</p>
              <p className="text-xs text-muted-foreground">₦{selectedProduct.sellingPrice} per {selectedProduct.sellingUnit.toLowerCase()}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Quantity Sold</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {qty && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-foreground">₦{(parseInt(qty) * selectedProduct.sellingPrice).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Note (optional)</label>
              <input
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleConfirm}
              disabled={!qty}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50 mt-4"
            >
              Confirm Sale
            </button>

            <button onClick={() => setSelectedProduct(null)} className="w-full text-sm text-muted-foreground py-2">
              Choose different product
            </button>
          </div>
        )}
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default RecordSalePage;
