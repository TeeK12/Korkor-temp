import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package, UserPlus } from "lucide-react";
import { distributors } from "@/data/distributors";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const DistributorProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const distributor = distributors.find((d) => d.id === id);

  if (!distributor) {
    return (
      <div className="app-shell dark bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Distributor not found</p>
      </div>
    );
  }

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{distributor.logo}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{distributor.name}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{distributor.location}</span>
            </div>
          </div>
        </div>

        {/* Follow button */}
        <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 mb-6">
          <UserPlus className="w-4 h-4" />
          Follow Distributor
        </button>

        {/* Products */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Products ({distributor.products.length})</h3>
        <div className="space-y-3 mb-6">
          {distributor.products.map((p) => (
            <div key={p.id} className="bg-card rounded-lg p-4 border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.availableQty.toLocaleString()} available</p>
              </div>
              <p className="text-sm font-bold text-foreground">₦{p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default DistributorProfilePage;
