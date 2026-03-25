import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const CostBreakdownPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const periodIdx = parseInt(searchParams.get("period") || "0");

  const salesIndices = [6, 5, 4, 3, 2];
  const idx = salesIndices[periodIdx] ?? 6;

  const cogBreakdown = products
    .map((p) => {
      const unitsSold = p.salesHistory[idx];
      const cogPerUnit = p.costPrice / p.unitsPerBuyingUnit;
      return {
        name: p.name,
        unitsSold,
        cog: unitsSold * cogPerUnit,
      };
    })
    .filter((p) => p.unitsSold > 0)
    .sort((a, b) => b.cog - a.cog);

  // Mock transport/handling costs per product (proportional to cost)
  const expenseBreakdown = products
    .map((p) => {
      const unitsSold = p.salesHistory[idx];
      const transportPerUnit = (p.costPrice / p.unitsPerBuyingUnit) * 0.05;
      return {
        name: p.name,
        unitsSold,
        expense: Math.round(unitsSold * transportPerUnit),
      };
    })
    .filter((p) => p.unitsSold > 0 && p.expense > 0)
    .sort((a, b) => b.expense - a.expense);

  const totalCog = cogBreakdown.reduce((s, p) => s + p.cog, 0);
  const totalExpenses = expenseBreakdown.reduce((s, p) => s + p.expense, 0);
  const totalCost = totalCog + totalExpenses;

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-xl font-bold text-foreground mb-1">Cost Breakdown</h1>
        <p className="text-sm text-muted-foreground mb-6">Where your money went</p>

        {/* Cost of Goods */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Cost of Goods</h3>
        <div className="space-y-3 mb-6">
          {cogBreakdown.map((p, i) => (
            <div key={i} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.unitsSold} units</p>
              </div>
              <p className="text-sm font-bold text-foreground">₦{Math.round(p.cog).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Expenses */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Expenses (Transport & Handling)</h3>
        <div className="space-y-3 mb-6">
          {expenseBreakdown.map((p, i) => (
            <div key={i} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
              </div>
              <p className="text-sm font-bold text-warning">₦{p.expense.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-primary/10 rounded-lg p-5 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Cost of Goods</span>
              <span className="text-sm font-semibold text-foreground">₦{Math.round(totalCog).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expenses</span>
              <span className="text-sm font-semibold text-foreground">₦{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Cost</span>
              <span className="text-2xl font-bold text-foreground">₦{Math.round(totalCost).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default CostBreakdownPage;
