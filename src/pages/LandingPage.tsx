import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell bg-deep flex flex-col items-center justify-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            bulkbook
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Inventory. Transparency. Growth.
          </p>
        </div>

        {/* Role Selection */}
        <div className="w-full space-y-4 max-w-sm">
          <button
            onClick={() => navigate("/signup/owner")}
            className="w-full flex items-center gap-4 p-5 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">I'm a Business Owner</p>
              <p className="text-sm text-muted-foreground">
                Manage inventory, track agents, grow your business
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/signup/agent")}
            className="w-full flex items-center gap-4 p-5 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-sky/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-sky" />
            </div>
            <div>
              <p className="font-semibold text-foreground">I'm an Agent</p>
              <p className="text-sm text-muted-foreground">
                Record sales, track performance, build your career
              </p>
            </div>
          </button>
        </div>

        {/* Login link */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Already have an account? <span className="text-primary font-medium">Log in</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
