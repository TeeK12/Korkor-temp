import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Camera, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { businessCategories } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const unitTypes = ["Carton", "Bag", "Roll", "Piece", "Kg", "Litre", "Yard", "Other"];

const AddProductPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", category: "", buyingUnit: "", sellingUnit: "",
    unitsPerBuying: "", costOfGoods: "", expenses: "",
    marketPrice: "", actualSellingPrice: "", openingStock: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Calculations
  const calc = useMemo(() => {
    const units = parseFloat(form.unitsPerBuying) || 0;
    const cog = parseFloat(form.costOfGoods) || 0;
    const exp = parseFloat(form.expenses) || 0;
    const asp = parseFloat(form.actualSellingPrice) || 0;

    const totalCostPerBuying = cog + exp;
    const costPerSelling = units > 0 ? totalCostPerBuying / units : 0;
    const minViablePrice = costPerSelling * 1.1;
    const idealPrice = costPerSelling * 1.3;
    const marginPerUnit = asp - costPerSelling;
    const marginPct = costPerSelling > 0 ? ((asp - costPerSelling) / costPerSelling) * 100 : 0;

    let verdictLabel = "";
    let verdictColor = "";
    if (asp > 0 && costPerSelling > 0) {
      if (marginPerUnit < 0) { verdictLabel = "Selling at a loss"; verdictColor = "text-critical"; }
      else if (marginPct < 15) { verdictLabel = "Low margin"; verdictColor = "text-warning"; }
      else { verdictLabel = "Healthy margin"; verdictColor = "text-success"; }
    }

    return { totalCostPerBuying, costPerSelling, minViablePrice, idealPrice, marginPerUnit, marginPct, verdictLabel, verdictColor };
  }, [form.unitsPerBuying, form.costOfGoods, form.expenses, form.actualSellingPrice]);

  const fmt = (n: number) => `₦${Math.round(n).toLocaleString()}`;

  const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Select</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );

  const TextField = ({ label, placeholder, value, onChange, type = "text", prefix }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; prefix?: string }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 ${prefix ? "pl-8" : "px-4"} pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary`} />
      </div>
    </div>
  );

  const ReadOnlyField = ({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className={`w-full h-12 px-4 rounded-lg border border-input bg-muted/50 flex items-center text-sm font-semibold ${color}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Add Product</h1>
          <div className="w-12" />
        </div>

        {/* Photo */}
        <button className="w-full h-28 rounded-lg border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 mb-6">
          <Camera className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Add product photo (optional)</span>
        </button>

        <div className="space-y-4">
          {/* Product Info */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Info</p>
          <TextField label="Product Name" placeholder="e.g. Indomie Chicken (70g)" value={form.name} onChange={(v) => update("name", v)} />
          <SelectField label="Category" value={form.category} onChange={(v) => update("category", v)} options={businessCategories} />

          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Buying Unit" value={form.buyingUnit} onChange={(v) => update("buyingUnit", v)} options={unitTypes} />
            <SelectField label="Selling Unit" value={form.sellingUnit} onChange={(v) => update("sellingUnit", v)} options={unitTypes} />
          </div>

          <TextField label="Units per Buying Unit" placeholder="e.g. 12" value={form.unitsPerBuying} onChange={(v) => update("unitsPerBuying", v)} type="number" />

          {/* Cost Calculator */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Cost Calculator</p>
          </div>

          <TextField label="Cost of Goods per Buying Unit" placeholder="What you paid supplier" value={form.costOfGoods} onChange={(v) => update("costOfGoods", v)} type="number" prefix="₦" />
          <TextField label="Total Expenses per Buying Unit" placeholder="Transport, handling, storage" value={form.expenses} onChange={(v) => update("expenses", v)} type="number" prefix="₦" />

          <ReadOnlyField label="Total Cost per Buying Unit" value={calc.totalCostPerBuying > 0 ? fmt(calc.totalCostPerBuying) : "—"} color="text-primary" />
          <ReadOnlyField label="Cost per Selling Unit" value={calc.costPerSelling > 0 ? fmt(calc.costPerSelling) : "—"} />

          {/* Pricing */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Pricing</p>
          </div>

          <TextField label="Current Market Price (per selling unit)" placeholder="What competitors charge" value={form.marketPrice} onChange={(v) => update("marketPrice", v)} type="number" prefix="₦" />

          <ReadOnlyField label="Minimum Viable Price (10% margin)" value={calc.minViablePrice > 0 ? fmt(calc.minViablePrice) : "—"} color="text-warning" />
          <ReadOnlyField label="Ideal Selling Price (30% margin)" value={calc.idealPrice > 0 ? fmt(calc.idealPrice) : "—"} color="text-success" />

          <TextField label="Actual Selling Price" placeholder="Your price per selling unit" value={form.actualSellingPrice} onChange={(v) => update("actualSellingPrice", v)} type="number" prefix="₦" />

          {/* Live Margin */}
          {calc.verdictLabel && (
            <div className={`rounded-lg p-4 border ${calc.verdictColor === "text-success" ? "bg-success/5 border-success/20" : calc.verdictColor === "text-warning" ? "bg-warning/5 border-warning/20" : "bg-critical/5 border-critical/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {calc.marginPerUnit >= 0 ? <TrendingUp className={`w-4 h-4 ${calc.verdictColor}`} /> : <TrendingDown className="w-4 h-4 text-critical" />}
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{calc.verdictLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Margin per unit</span>
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{fmt(calc.marginPerUnit)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Margin percentage</span>
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{Math.round(calc.marginPct)}%</span>
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Stock</p>
          </div>

          <TextField label="Opening Stock Quantity" placeholder="Current quantity" value={form.openingStock} onChange={(v) => update("openingStock", v)} type="number" />

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
