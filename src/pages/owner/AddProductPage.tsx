import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Camera } from "lucide-react";
import { businessCategories, unitTypes } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", category: "", buyingUnit: "", sellingUnit: "",
    unitsPerBuying: "", costPrice: "", sellingPrice: "", openingStock: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "name", label: "Product Name", placeholder: "e.g. Indomie Chicken (70g)", type: "text" },
  ];

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Add Product</h1>
          <div className="w-12" />
        </div>

        {/* Photo */}
        <button className="w-full h-32 rounded-lg border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 mb-6">
          <Camera className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Add product photo (optional)</span>
        </button>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Product Name</label>
            <input
              placeholder="e.g. Indomie Chicken (70g)"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
            <div className="relative">
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                {businessCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "buyingUnit", label: "Buying Unit" },
              { key: "sellingUnit", label: "Selling Unit" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
                <select value={(form as any)[f.key]} onChange={(e) => update(f.key, e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select</option>
                  {unitTypes.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Units per Buying Unit</label>
            <input type="number" placeholder="e.g. 12" value={form.unitsPerBuying}
              onChange={(e) => update("unitsPerBuying", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Cost Price (₦)</label>
              <input type="number" placeholder="Per buying unit" value={form.costPrice}
                onChange={(e) => update("costPrice", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Selling Price (₦)</label>
              <input type="number" placeholder="Per selling unit" value={form.sellingPrice}
                onChange={(e) => update("sellingPrice", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Opening Stock</label>
            <input type="number" placeholder="Current quantity" value={form.openingStock}
              onChange={(e) => update("openingStock", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <button className="w-full h-12 mt-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            Save Product
          </button>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default AddProductPage;
