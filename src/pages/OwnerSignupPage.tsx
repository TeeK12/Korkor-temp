import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { businessCategories, nigerianStates } from "@/data/mockData";

const OwnerSignupPage = () => {
  const navigate = useNavigate();
  const { loginAsOwner } = useAuth();
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    category: "",
    state: "",
    area: "",
    password: "",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    if (!form.businessName || !form.ownerName || !form.phone || !form.password) return;
    loginAsOwner(form.businessName, form.ownerName);
    navigate("/owner");
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-5 pt-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Create Business Account</h1>
        <p className="text-sm text-muted-foreground mb-8">Set up your Bulkbook account in under 2 minutes</p>

        <div className="space-y-4">
          {[
            { key: "businessName", label: "Business Name", placeholder: "e.g. Mama Nkechi Provisions", type: "text" },
            { key: "ownerName", label: "Owner Full Name", placeholder: "Your full name", type: "text" },
            { key: "phone", label: "Phone Number", placeholder: "080XXXXXXXX", type: "tel" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Business Category</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                {businessCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">State</label>
              <select
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                {nigerianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Market / Area</label>
              <input
                placeholder="e.g. Alaba"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignupPage;
