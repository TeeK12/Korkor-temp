import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { agents } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const AgentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="app-shell dark bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  const perfData = [12, 18, 8, 22, 14, 16, agent.todaySales];
  const maxPerf = Math.max(...perfData);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{agent.name[0]}</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.role} · {agent.lastActive}</p>
          </div>
        </div>

        {/* Performance chart */}
        <div className="bg-card rounded-lg p-4 border border-border mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance — 7 Days</h3>
          <div className="flex items-end justify-between gap-1 h-20">
            {perfData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-sm bg-primary" style={{ height: `${(v / maxPerf) * 100}%`, minHeight: 4 }} />
                <span className="text-[9px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Sales */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Today's Sales</h3>
          <div className="space-y-2">
            {agent.salesLog.map((sale, i) => (
              <div key={i} className="bg-card rounded-lg p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.product}</p>
                  <p className="text-xs text-muted-foreground">{sale.qty} units · {sale.time}</p>
                </div>
                <p className="text-sm font-bold text-success">₦{sale.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default AgentDetailPage;
