import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDistributor } from "@/contexts/DistributorContext";
import { toast } from "sonner";

const CATEGORIES = ["Dairy", "Beverages", "Grains", "Provisions", "Cosmetics", "Electronics", "Building Materials", "Other"];
const PAYMENT_OPTS = ["Cash", "Bank Transfer", "Online Payment", "Goodwill"];

const DistributorAddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useDistributor();
  const [form, setForm] = useState({
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    currentStock: "",
    freeShippingThreshold: "",
    goodwillEnabled: false,
    goodwillRepaymentDays: "30",
  });
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["Cash", "Bank Transfer"]);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const togglePm = (m: string) =>
    setPaymentMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleSave = () => {
    if (!form.name || !form.category || !form.costPrice || !form.sellingPrice || !form.currentStock) {
      toast.error("Fill in required fields");
      return;
    }
    addProduct({
      name: form.name,
      category: form.category,
      costPrice: parseFloat(form.costPrice),
      sellingPrice: parseFloat(form.sellingPrice),
      currentStock: parseInt(form.currentStock),
      freeShippingThreshold: form.freeShippingThreshold ? parseFloat(form.freeShippingThreshold) : undefined,
      goodwillEnabled: form.goodwillEnabled,
      goodwillRepaymentDays: form.goodwillEnabled ? parseInt(form.goodwillRepaymentDays) : undefined,
      paymentMethods,
    });
    toast.success("Product added");
    navigate("/distributor/inventory");
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-5 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Add Product</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Peak Milk (Tin)"
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => update("category", c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    form.category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Cost Price (₦)</label>
              <input
                type="number"
                value={form.costPrice}
                onChange={(e) => update("costPrice", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Selling Price (₦)</label>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => update("sellingPrice", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Current Stock</label>
            <input
              type="number"
              value={form.currentStock}
              onChange={(e) => update("currentStock", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Free shipping */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Free shipping on orders above (optional)
            </label>
            <input
              type="number"
              placeholder="Leave blank if not offering"
              value={form.freeShippingThreshold}
              onChange={(e) => update("freeShippingThreshold", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Goodwill */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">Buy Now Pay Later (Goodwill)</p>
                <p className="text-xs text-muted-foreground">Allow buyers to pay after selling</p>
              </div>
              <button
                onClick={() => update("goodwillEnabled", !form.goodwillEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.goodwillEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
                    form.goodwillEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {form.goodwillEnabled && (
              <div className="mt-3">
                <label className="text-xs text-muted-foreground block mb-1.5">Repayment period</label>
                <select
                  value={form.goodwillRepaymentDays}
                  onChange={(e) => update("goodwillRepaymentDays", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            )}
          </div>

          {/* Payment methods */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Payment Methods Accepted</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTS.map((m) => (
                <button
                  key={m}
                  onClick={() => togglePm(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    paymentMethods.includes(m)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorAddProductPage;
