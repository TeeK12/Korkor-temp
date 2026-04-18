import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAsOwner, loginAsAgent, loginAsDistributor } = useAuth();
  const [mode, setMode] = useState<"owner" | "agent" | "distributor">("owner");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (mode === "owner") {
      loginAsOwner("Mama Nkechi Provisions", "Nkechi Okafor");
      navigate("/owner");
    } else if (mode === "agent") {
      loginAsAgent("Chidi Okonkwo", "Mama Nkechi Provisions");
      navigate("/agent");
    } else {
      loginAsDistributor("Peak Milk Depot", "Bola Adesina");
      navigate("/distributor");
    }
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-5 pt-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Log in to your Bulkbook account</p>

        {/* Toggle */}
        <div className="flex rounded-lg bg-muted p-1 mb-8 gap-1">
          {(["owner", "agent", "distributor"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 h-10 rounded-md text-xs font-medium transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "owner" ? "Owner" : m === "agent" ? "Agent" : "Distributor"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
            <input
              type="tel"
              placeholder="080XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {mode !== "agent" ? (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">PIN</label>
              <input
                type="password"
                placeholder="••••"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm tracking-[0.5em] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <button className="text-sm text-primary hover:underline">Forgot password?</button>

          <button
            onClick={handleLogin}
            className="w-full h-12 mt-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
