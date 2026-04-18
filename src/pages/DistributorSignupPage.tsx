import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDistributor } from "@/contexts/DistributorContext";
import { nigerianStates } from "@/data/mockData";

const CATEGORIES = ["Dairy", "Beverages", "Grains", "Provisions", "Cosmetics", "Electronics", "Building Materials", "Other"];

const DistributorSignupPage = () => {
  const navigate = useNavigate();
  const { loginAsDistributor } = useAuth();
  const { setProfile } = useDistributor();
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    state: "",
    area: "",
    password: "",
  });
  const [categories, setCategories] = useState<string[]>([]);

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const toggleCat = (c: string) =>
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleSubmit = () => {
    if (!form.businessName || !form.ownerName || !form.phone || !form.password || categories.length === 0) return;
    setProfile({
      businessName: form.businessName,
      ownerName: form.ownerName,
      phone: form.phone,
      state: form.state,
      area: form.area,
      categories,
    });
    loginAsDistributor(form.businessName, form.ownerName);
    navigate("/distributor");
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-5 pt-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Create Distributor Account</h1>
        <p className="text-sm text-muted-foreground mb-8">Supply goods to businesses on Bulkbook</p>

        <div className="space-y-4">
          {[
            { key: "businessName", label: "Business / Depot Name", placeholder: "e.g. Peak Milk Depot", type: "text" },
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">State</label>
              <div className="relative">
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
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Area</label>
              <input
                placeholder="e.g. Apapa"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Product Categories You Supply</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    categories.includes(c)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
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
            disabled={!form.businessName || !form.ownerName || !form.phone || !form.password || categories.length === 0}
            className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorSignupPage;
