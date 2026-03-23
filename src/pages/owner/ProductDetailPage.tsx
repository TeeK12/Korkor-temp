import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, TrendingUp } from "lucide-react";
import { products } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="app-shell dark bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const maxSale = Math.max(...product.salesHistory);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button onClick={() => navigate(`/owner/product/edit/${product.id}`)} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Edit className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-1">{product.name}</h1>
        <p className="text-sm text-muted-foreground mb-6">{product.category}</p>

        {/* Stock Level */}
        <div className="bg-card rounded-lg p-5 border border-border mb-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Stock</p>
          <p className="text-5xl font-bold text-foreground">{product.currentStock}</p>
          <p className="text-sm text-muted-foreground mt-1">{product.sellingUnit}s</p>
        </div>

        {/* Units & Pricing */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground">Buying Unit</p>
            <p className="text-sm font-semibold text-foreground">{product.buyingUnit}</p>
            <p className="text-xs text-muted-foreground mt-1">₦{product.costPrice.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground">Selling Unit</p>
            <p className="text-sm font-semibold text-foreground">{product.sellingUnit}</p>
            <p className="text-xs text-muted-foreground mt-1">₦{product.sellingPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border mb-4">
          <p className="text-xs text-muted-foreground">1 {product.buyingUnit} = {product.unitsPerBuyingUnit} {product.sellingUnit}s</p>
        </div>

        {/* Revenue */}
        <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-success mt-1">₦{product.totalRevenue.toLocaleString()}</p>
        </div>

        {/* Sales Chart */}
        <div className="bg-card rounded-lg p-4 border border-border mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Sales — Last 7 Days</h3>
          <div className="flex items-end justify-between gap-1 h-24">
            {product.salesHistory.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-primary"
                  style={{ height: `${maxSale ? (v / maxSale) * 100 : 0}%`, minHeight: v > 0 ? 4 : 0 }}
                />
                <span className="text-[9px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Log */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Stock Movement</h3>
          <div className="space-y-2">
            {product.stockLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{log.action} — {log.qty} units</p>
                  <p className="text-xs text-muted-foreground">by {log.by}</p>
                </div>
                <span className="text-xs text-muted-foreground">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default ProductDetailPage;
