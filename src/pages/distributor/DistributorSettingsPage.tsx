import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDistributor } from "@/contexts/DistributorContext";
import DistributorBottomNav from "@/components/DistributorBottomNav";
import { toast } from "sonner";

const DistributorSettingsPage = () => {
  const navigate = useNavigate();
  const { logout, businessName, userName } = useAuth();
  const { autoApproveGoodwill, defaultGoodwillDays, setProfile } = useDistributor();

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Business Profile", action: () => navigate("/distributor/profile") },
        { label: "Phone & Password", action: () => toast.info("Coming soon") },
      ],
    },
    {
      title: "Goodwill Settings",
      items: [
        {
          label: `Default repayment period: ${defaultGoodwillDays} days`,
          action: () => {
            const next = defaultGoodwillDays === 30 ? 60 : defaultGoodwillDays === 60 ? 90 : 30;
            setProfile({ defaultGoodwillDays: next });
            toast.success(`Repayment period set to ${next} days`);
          },
        },
        {
          label: autoApproveGoodwill ? "Auto-approve goodwill orders: ON" : "Auto-approve goodwill orders: OFF",
          action: () => setProfile({ autoApproveGoodwill: !autoApproveGoodwill }),
        },
      ],
    },
    {
      title: "Other",
      items: [
        { label: "Notification preferences", action: () => toast.info("Coming soon") },
        { label: "About Bulkbook", action: () => toast.info("Bulkbook v1.0") },
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

        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile card */}
        <div className="bg-card rounded-lg p-4 border border-border mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{(businessName || "D")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{businessName}</p>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
              {section.title}
            </h3>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {section.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 active:opacity-70 ${
                    idx > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-sm text-foreground text-left">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full h-12 rounded-lg border border-critical text-critical text-sm font-semibold mb-6"
        >
          Log Out
        </button>
      </div>
      <DistributorBottomNav />
    </div>
  );
};

export default DistributorSettingsPage;
