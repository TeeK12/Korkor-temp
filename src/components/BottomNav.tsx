import { Home, Search, PlusCircle, BarChart3, User } from "lucide-react";

const BottomNav = () => {
  const items = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Explore", active: false },
    { icon: PlusCircle, label: "List", active: false },
    { icon: BarChart3, label: "Manage", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around py-2 pb-6">
        {items.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center gap-0.5 min-w-[48px]"
          >
            <item.icon
              className={`w-5 h-5 ${
                item.active ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-[10px] font-body ${
                item.active ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
