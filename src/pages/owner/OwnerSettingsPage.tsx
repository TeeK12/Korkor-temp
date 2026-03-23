import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, User, CreditCard, Info, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const OwnerSettingsPage = () => {
  const navigate = useNavigate();
  const { logout, businessName, userName } = useAuth();

  const sections = [
    {
      title: "Business Profile",
      items: [
        { icon: Building2, label: "Business name, category, location", action: () => {} },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Phone number, password", action: () => {} },
      ],
    },
    {
      title: "Billing",
      items: [
        { icon: CreditCard, label: "Sub account plan & upgrade", action: () => {} },
      ],
    },
    {
      title: "About",
      items: [
        { icon: Info, label: "About Bulkbook", action: () => {} },
      ],
    },
  ];

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-lg font-bold text-foreground mb-6">Settings</h1>

        {/* Profile card */}
        <div className="bg-card rounded-lg p-4 border border-border flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{(userName || "N")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName || "Nkechi Okafor"}</p>
            <p className="text-xs text-muted-foreground">{businessName || "Mama Nkechi Provisions"}</p>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">{section.title}</p>
            {section.items.map((item, i) => (
              <button key={i} onClick={item.action} className="w-full flex items-center gap-3 py-3 border-b border-border last:border-0">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ))}

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 py-3 text-critical mt-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default OwnerSettingsPage;
