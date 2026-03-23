import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Users, BarChart3, Newspaper } from "lucide-react";

const OwnerBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Home, label: "Home", path: "/owner" },
    { icon: Package, label: "Inventory", path: "/owner/inventory" },
    { icon: Users, label: "Agents", path: "/owner/agents" },
    { icon: BarChart3, label: "Reports", path: "/owner/reports" },
    { icon: Newspaper, label: "Feed", path: "/owner/feed" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2 pb-6">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 min-w-[48px]"
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] transition-colors ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default OwnerBottomNav;
