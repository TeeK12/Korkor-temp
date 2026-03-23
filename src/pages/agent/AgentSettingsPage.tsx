import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Building2, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

const AgentSettingsPage = () => {
  const navigate = useNavigate();
  const { logout, userName, businessName } = useAuth();

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile card */}
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{(userName || "C")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName || "Chidi Okonkwo"}</p>
            <p className="text-xs text-muted-foreground">Agent</p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { icon: User, label: "Personal Profile", desc: "Name, phone number" },
            { icon: Lock, label: "Change PIN", desc: "Update your 4-digit login PIN" },
            { icon: Building2, label: "Linked Business", desc: businessName || "Mama Nkechi Provisions" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 py-4 border-b border-border">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 py-4 text-critical mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default AgentSettingsPage;
