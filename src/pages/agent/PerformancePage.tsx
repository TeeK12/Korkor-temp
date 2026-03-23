import { Flame, TrendingUp, Star, Zap } from "lucide-react";
import AgentBottomNav from "@/components/AgentBottomNav";

const PerformancePage = () => {
  const weeklyTotal = 87;
  const bestDay = "Thursday";
  const topProduct = "Indomie Chicken";
  const streak = 5;
  const tipsEarned = 1200;

  const monthlyData = [62, 78, 85, 87];
  const maxMonthly = Math.max(...monthlyData);
  const months = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-5">
        <h1 className="text-xl font-bold text-foreground mb-6">My Performance</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Weekly Sales</p>
            <p className="text-3xl font-bold text-primary mt-1">{weeklyTotal}</p>
            <p className="text-[10px] text-muted-foreground">units sold</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Best Day</p>
            <p className="text-lg font-bold text-foreground mt-1">{bestDay}</p>
            <p className="text-[10px] text-success">22 units</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Top Product</p>
            <p className="text-sm font-bold text-foreground mt-1">{topProduct}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-warning" />
              <span className="text-[10px] text-muted-foreground">38 sold</span>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Tips Earned</p>
            <p className="text-lg font-bold text-success mt-1">₦{tipsEarned.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">this week</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Flame className="w-8 h-8 text-warning" />
          <div>
            <p className="text-sm font-semibold text-foreground">{streak}-day streak! 🔥</p>
            <p className="text-xs text-muted-foreground">Keep recording sales daily to build your streak</p>
          </div>
        </div>

        {/* AI motivation */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Coach's Note</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Great week, Chidi! You're consistently improving — this week's total is 12% higher than last week. 
            Focus on pushing Dangote Sugar — it's a fast mover and customers are looking for it. Keep going! 💪
          </p>
        </div>

        {/* Monthly chart */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Progress</h3>
          <div className="flex items-end justify-between gap-2 h-24">
            {monthlyData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-foreground">{v}</span>
                <div className="w-full rounded-lg bg-primary" style={{ height: `${(v / maxMonthly) * 100}%`, minHeight: 8 }} />
                <span className="text-[9px] text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default PerformancePage;
