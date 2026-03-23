import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AgentSignupPage = () => {
  const navigate = useNavigate();
  const { loginAsAgent } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    inviteCode: "",
    pin: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.inviteCode || !form.pin) return;
    loginAsAgent(form.name, "Mama Nkechi Provisions");
    navigate("/agent");
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-5 pt-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Join as an Agent</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter the invite code from your business owner to get started</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
            <input
              type="tel"
              placeholder="080XXXXXXXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">6-Digit Invite Code</label>
            <input
              placeholder="Enter invite code"
              maxLength={6}
              value={form.inviteCode}
              onChange={(e) => update("inviteCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm tracking-[0.3em] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Create 4-Digit PIN</label>
            <input
              type="password"
              placeholder="••••"
              maxLength={4}
              value={form.pin}
              onChange={(e) => update("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm tracking-[0.5em] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">You'll use this PIN for daily login</p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Join Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSignupPage;
