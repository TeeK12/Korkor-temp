import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Search, Plus, Minus, X, ShoppingCart, Check, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products, agents } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  unit: string;
}

const RecordSalePage = () => {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();
  const [tab, setTab] = useState<"search" | "camera">("search");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [qty, setQty] = useState("1");
  const [showPreview, setShowPreview] = useState(false);
  const [note, setNote] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [collabQuery, setCollabQuery] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cameraProduct, setCameraProduct] = useState<typeof products[0] | null>(null);
  const [cameraQty, setCameraQty] = useState(1);
  const [scanning, setScanning] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mock unauthorized agents for collaborator suggestions
  const unauthorizedAgents = [
    { id: "u1", name: "Blessing Okoro" },
    { id: "u2", name: "Emeka Uche" },
    { id: "u3", name: "Funmi Adeyemi" },
  ];

  const collabSuggestions = collabQuery.length > 0
    ? unauthorizedAgents.filter((a) => a.name.toLowerCase().includes(collabQuery.toLowerCase()))
    : [];

  const filtered = query.length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (tab === "search" && searchRef.current) {
      searchRef.current.focus();
    }
  }, [tab]);

  useEffect(() => {
    if (tab === "camera" && scanning) {
      const timer = setTimeout(() => {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setCameraProduct(randomProduct);
        setCameraQty(1);
        setScanning(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [tab, scanning]);

  const addToCart = (product: typeof products[0], quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, qty: c.qty + quantity } : c
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        qty: quantity,
        price: product.sellingPrice,
        unit: product.sellingUnit,
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleSearchAdd = () => {
    if (!selectedProduct || !qty || parseInt(qty) < 1) return;
    addToCart(selectedProduct, parseInt(qty));
    setSelectedProduct(null);
    setQty("1");
    setQuery("");
    searchRef.current?.focus();
  };

  const handleCameraAdd = () => {
    if (!cameraProduct) return;
    addToCart(cameraProduct, cameraQty);
    setCameraProduct(null);
    setScanning(true);
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      navigate("/agent");
    }, 1800);
  };

  if (confirmed) {
    return (
      <div className="app-shell bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Sale Recorded!</h2>
          <p className="text-sm text-muted-foreground">{cart.length} items · ₦{grandTotal.toLocaleString()}</p>
          {collaborator && (
            <p className="text-xs text-primary mt-1">Collaborator: {collaborator}</p>
          )}
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="app-shell bg-background">
        <div className="page-content px-4 pt-4">
          <button onClick={() => setShowPreview(false)} className="flex items-center gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Edit Cart</span>
          </button>
          <h1 className="text-xl font-bold text-foreground mb-1">Sale Preview</h1>
          <p className="text-sm text-muted-foreground mb-6">Review before confirming</p>
          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.productId} className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm font-bold text-primary">₦{(item.qty * item.price).toLocaleString()}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.qty} {item.unit}{item.qty > 1 ? "s" : ""} × ₦{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Grand Total</span>
              <span className="text-2xl font-bold text-primary">₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground mb-3"
          />

          {/* Collaborator field */}
          <div className="relative mb-6">
            <label className="text-xs text-muted-foreground mb-1 block">Collaborator (optional)</label>
            <input
              type="text"
              placeholder="Tag another agent who helped with this sale"
              value={collaborator || collabQuery}
              onChange={(e) => {
                setCollaborator("");
                setCollabQuery(e.target.value);
              }}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            {collabSuggestions.length > 0 && !collaborator && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl mt-1 overflow-hidden z-10">
                {collabSuggestions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setCollaborator(a.name); setCollabQuery(""); }}
                    className="w-full px-4 py-3 text-sm text-foreground text-left hover:bg-muted/50 border-b border-border last:border-0"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowPreview(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-foreground">
              Edit
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
              Confirm Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4" style={{ paddingBottom: cart.length > 0 ? 220 : 80 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Record a Sale</h1>
          </div>
          {cart.length > 0 && (
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {cart.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex bg-muted rounded-xl p-1 mb-5">
          <button
            onClick={() => setTab("camera")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "camera" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Camera className="w-4 h-4" />
            Camera
          </button>
          <button
            onClick={() => setTab("search")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "search" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {tab === "camera" && (
          <div className="mb-4">
            <div className="relative bg-foreground/5 rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 to-foreground/5" />
              <div className="relative w-48 h-48 border-2 border-primary/60 rounded-2xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                {scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ScanLine className="w-8 h-8 text-primary animate-pulse" />
                    <p className="text-xs text-muted-foreground mt-2">Scanning...</p>
                  </div>
                )}
              </div>
              <p className="absolute bottom-4 text-xs text-muted-foreground text-center px-4">
                Point camera at a product to identify it
              </p>
            </div>

            {cameraProduct && (
              <div className="bg-card rounded-2xl p-4 border border-border animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{cameraProduct.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{cameraProduct.name}</p>
                    <p className="text-xs text-muted-foreground">₦{cameraProduct.sellingPrice.toLocaleString()} per {cameraProduct.sellingUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-muted rounded-xl px-2">
                    <button onClick={() => setCameraQty(Math.max(1, cameraQty - 1))} className="p-2 text-muted-foreground">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-foreground w-8 text-center">{cameraQty}</span>
                    <button onClick={() => setCameraQty(cameraQty + 1)} className="p-2 text-primary">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={handleCameraAdd} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "search" && (
          <div className="mb-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search product name..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedProduct(null); }}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {query && !selectedProduct && filtered.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden mb-3 max-h-48 overflow-y-auto">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProduct(p); setQuery(p.name); }}
                    className="w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-0 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.currentStock} in stock</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">₦{p.sellingPrice.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}

            {query && !selectedProduct && filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No products found</p>
            )}

            {selectedProduct && (
              <div className="bg-card rounded-2xl p-4 border border-border mb-3 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedProduct.name}</p>
                    <p className="text-xs text-muted-foreground">₦{selectedProduct.sellingPrice.toLocaleString()} per {selectedProduct.sellingUnit}</p>
                  </div>
                  <button onClick={() => { setSelectedProduct(null); setQuery(""); }} className="text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Quantity ({selectedProduct.sellingUnit}s)</label>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      min="1"
                      className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm font-bold text-foreground mt-1"
                      onKeyDown={(e) => e.key === "Enter" && handleSearchAdd()}
                    />
                  </div>
                  <button onClick={handleSearchAdd} className="px-6 py-2.5 mt-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                    Add
                  </button>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium animate-scale-in">
                    <span>{item.name} × {item.qty}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 bg-card border-t border-border px-4 py-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">{cart.length} item{cart.length > 1 ? "s" : ""} in cart</span>
            <span className="text-lg font-bold text-primary">₦{grandTotal.toLocaleString()}</span>
          </div>
          <button onClick={() => setShowPreview(true)} className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
            Preview & Submit
          </button>
        </div>
      )}

      <AgentBottomNav />
    </div>
  );
};

export default RecordSalePage;
