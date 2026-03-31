import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

const TargetBreakdownPage = () => {
  const navigate = useNavigate();
  const { personalTarget } = useAuth();

  const target = personalTarget?.target || 25;
  const progress = personalTarget?.progress || 14;
  const isRevenue = personalTarget?.type === "revenue";
  const progressPct = Math.min(100, (progress / target) * 100);

  // Mock 14-day history
  const dailyHistory = [
    { day: "Mon 17", actual: 22, target: 25 },
    { day: "Tue 18", actual: 28, target: 25 },
    { day: "Wed 19", actual: 18, target: 25 },
    { day: "Thu 20", actual: 30, target: 25 },
    { day: "Fri 21", actual: 12, target: 25 },
    { day: "Sat 22", actual: 26, target: 25 },
    { day: "Sun 23", actual: 20, target: 25 },
    { day: "Mon 24", actual: 25, target: 25 },
    { day: "Tue 25", actual: 27, target: 25 },
    { day: "Wed 26", actual: 15, target: 25 },
    { day: "Thu 27", actual: 29, target: 25 },
    { day: "Fri 28", actual: 24, target: 25 },
    { day: "Sat 29", actual: 26, target: 25 },
    { day: "Sun 30", actual: 14, target: 25 }, // today
  ];

  const maxVal = Math.max(...dailyHistory.map((d) => d.actual));

  const getBarColor = (actual: number, tgt: number, isToday: boolean) => {
    if (actual >= tgt) return "bg-success";
    if (actual >= tgt * 0.8) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Target Breakdown</h1>
          <div className="w-12" />
        </div>

        {/* Current progress */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Current Progress</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {isRevenue ? `₦${progress.toLocaleString()}/₦${target.toLocaleString()}` : `${progress}/${target} units`}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${progressPct >= 100 ? "bg-success" : progressPct >= 60 ? "bg-primary" : "bg-warning"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Your Strengths */}
        <div className="bg-success/5 border border-success/20 rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">💪 Your Strengths</h3>
          <p className="text-sm text-foreground leading-relaxed">
            You hit your target 4 out of the last 5 days. Your strongest sales are in the morning between 9am and 12pm. Thursday is consistently your best day — great energy!
          </p>
        </div>

        {/* What's Been Lacking */}
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">🔍 Areas to Improve</h3>
          <p className="text-sm text-foreground leading-relaxed">
            You missed your target on 3 Mondays this month. Afternoon sales are consistently below average. Consider focusing more energy on the 2pm–5pm window — that's where the gap is.
          </p>
        </div>

        {/* Daily Target History Graph */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Daily Target History</h3>
          <div className="flex items-end justify-between gap-1 h-32">
            {dailyHistory.map((d, i) => {
              const isToday = i === dailyHistory.length - 1;
              const barHeight = maxVal > 0 ? (d.actual / maxVal) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-medium text-foreground">{d.actual}</span>
                  <div
                    className={`w-full rounded-md ${getBarColor(d.actual, d.target, isToday)} ${isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
                    style={{ height: `${barHeight}%`, minHeight: 6 }}
                  />
                  <span className="text-[7px] text-muted-foreground leading-none">{d.day.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-success" />
              <span className="text-[9px] text-muted-foreground">Met</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-warning" />
              <span className="text-[9px] text-muted-foreground">Close</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-destructive" />
              <span className="text-[9px] text-muted-foreground">Missed</span>
            </div>
          </div>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default TargetBreakdownPage;
