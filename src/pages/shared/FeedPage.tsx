import { useState } from "react";
import { ArrowLeft, BookOpen, TrendingUp, Bell, X } from "lucide-react";
import { feedItems } from "@/data/mockData";

interface FeedPageProps {
  variant: "owner" | "agent";
  BottomNav: React.ComponentType;
}

const categoryIcons: Record<string, any> = {
  tips: BookOpen,
  market: TrendingUp,
  updates: Bell,
};

const categoryColors: Record<string, string> = {
  tips: "bg-primary/10 text-primary",
  market: "bg-success/10 text-success",
  updates: "bg-sky/10 text-sky",
};

const FeedPage = ({ variant, BottomNav }: FeedPageProps) => {
  const [filter, setFilter] = useState<"all" | "tips" | "market" | "updates">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? feedItems : feedItems.filter((f) => f.category === filter);

  const expandedItem = expanded ? feedItems.find((f) => f.id === expanded) : null;

  return (
    <div className={`app-shell ${variant === "owner" ? "dark" : ""} bg-background`}>
      <div className="page-content px-4 pt-5">
        <h1 className="text-lg font-bold text-foreground mb-4">Feed</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(["all", "tips", "market", "updates"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "tips" ? "Business Tips" : f === "market" ? "Market Insights" : "Updates"}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = categoryIcons[item.category];
            return (
              <button
                key={item.id}
                onClick={() => setExpanded(item.id)}
                className="w-full bg-card rounded-lg p-4 border border-border text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${categoryColors[item.category]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {item.category === "tips" ? "Business Tip" : item.category === "market" ? "Market Insight" : "Update"}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{item.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded overlay */}
      {expandedItem && (
        <div className="absolute inset-0 z-40 bg-background animate-fade-in">
          <div className="page-content px-4 pt-4">
            <button onClick={() => setExpanded(null)} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-4">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${categoryColors[expandedItem.category]}`}>
              {(() => { const Icon = categoryIcons[expandedItem.category]; return <Icon className="w-4 h-4" />; })()}
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">{expandedItem.title}</h1>
            <p className="text-xs text-muted-foreground mb-6">{expandedItem.readTime} read</p>
            <p className="text-sm text-foreground leading-relaxed">{expandedItem.content}</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default FeedPage;
