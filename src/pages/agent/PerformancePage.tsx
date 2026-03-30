import { useState } from "react";
import { Flame, TrendingUp, Star, Zap, Target, Swords } from "lucide-react";
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

  // Goal state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalType, setGoalType] = useState<"sales" | "revenue">("sales");
  const [goalPeriod, setGoalPeriod] = useState<"today" | "week" | "month">("week");
  const [goalTarget, setGoalTarget] = useState("");
  const [activeGoal, setActiveGoal] = useState<{ type: string; target: number; period: string; progress: number } | null>(null);

  // Mock challenge
  const [activeChallenge] = useState<{
    challenger: string;
    target: number;
    metric: string;
    period: string;
    myProgress: number;
    theirProgress: number;
  } | null>({
    challenger: "Ada Obi",
    target: 50,
    metric: "units",
    period: "This Week",
    myProgress: 32,
    theirProgress: 28,
  });

  const handleSetGoal = () => {
    if (!goalTarget) return;
    setActiveGoal({
      type: goalType,
      target: parseInt(goalTarget),
      period: goalPeriod === "today" ? "Today" : goalPeriod === "week" ? "This Week" : "This Month",
      progress: goalType === "sales" ? weeklyTotal : 8750,
    });
    setShowGoalForm(false);
    setGoalTarget("");
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">My Performance</h1>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
          >
            <Target className="w-3.5 h-3.5" />
            Set Goal
          </button>
        </div>

        {/* Goal form */}
        {showGoalForm && (
          <div className="bg-card rounded-2xl p-4 border border-border mb-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-3">Set Personal Goal</h3>
            <div className="flex bg-muted rounded-xl p-1 mb-3">
              <button
                onClick={() => setGoalType("sales")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  goalType === "sales" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Sales Count
              </button>
              <button
                onClick={() => setGoalType("revenue")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  goalType === "revenue" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Revenue
              </button>
            </div>
            <div className="flex bg-muted rounded-xl p-1 mb-3">
              {(["today", "week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setGoalPeriod(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    goalPeriod === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder={goalType === "sales" ? "Target number of sales" : "Target revenue (₦)"}
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground mb-3"
            />
            <button
              onClick={handleSetGoal}
              disabled={!goalTarget}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
            >
              Confirm Goal
            </button>
          </div>
        )}

        {/* Active goal progress */}
        {activeGoal && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">My Goal — {activeGoal.period}</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {activeGoal.progress}/{activeGoal.target}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (activeGoal.progress / activeGoal.target) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activeGoal.type === "sales"
                ? `${Math.max(0, activeGoal.target - activeGoal.progress)} more sales to go`
                : `₦${Math.max(0, activeGoal.target - activeGoal.progress).toLocaleString()} to go`}
            </p>
          </div>
        )}

        {/* Challenge graph */}
        {activeChallenge && (
          <div className="bg-card rounded-2xl p-4 border border-border mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Swords className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Active Challenge</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{activeChallenge.period}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Target: {activeChallenge.target} {activeChallenge.metric} · vs {activeChallenge.challenger}
            </p>
            {/* Dual progress bars */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary">You</span>
                  <span className="text-xs font-bold text-primary">{activeChallenge.myProgress}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(activeChallenge.myProgress / activeChallenge.target) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-warning">{activeChallenge.challenger}</span>
                  <span className="text-xs font-bold text-warning">{activeChallenge.theirProgress}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-warning transition-all"
                    style={{ width: `${(activeChallenge.theirProgress / activeChallenge.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-success font-medium mt-3 text-center">
              {activeChallenge.myProgress > activeChallenge.theirProgress
                ? "You're in the lead! 🔥"
                : activeChallenge.myProgress === activeChallenge.theirProgress
                ? "It's a tie!"
                : "You're behind — push harder! 💪"}
            </p>
          </div>
        )}

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
