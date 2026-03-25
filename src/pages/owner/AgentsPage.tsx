import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Copy, Check } from "lucide-react";
import { agents } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

// Mock authorization and unread status
const agentAuth: Record<string, boolean> = { "1": true, "2": true };
const unreadRecs: Record<string, number> = { "1": 2, "2": 0 };

const AgentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-foreground">Sub Accounts</h1>
        </div>

        {/* Agent list */}
        <div className="space-y-3">
          {agents.map((agent) => {
            const unread = unreadRecs[agent.id] || 0;
            const authorized = agentAuth[agent.id] ?? false;
            return (
              <button
                key={agent.id}
                onClick={() => navigate(`/owner/agent/${agent.id}`)}
                className="w-full bg-card rounded-lg p-4 border border-border flex items-center gap-3 text-left relative"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative">
                  <span className="text-sm font-bold text-primary">{agent.name[0]}</span>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <span className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{agent.role} · {agent.lastActive}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      authorized ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    }`}>
                      {authorized ? "Authorized" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-primary">{agent.todaySales}</p>
                  <p className="text-[10px] text-muted-foreground">sales today</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Locked slot */}
        <div className="mt-4 bg-muted/30 rounded-lg p-4 border border-dashed border-border text-center">
          <p className="text-sm font-medium text-muted-foreground">+ Add More Agents</p>
          <p className="text-xs text-muted-foreground mt-1">Upgrade to add more sub accounts</p>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default AgentsPage;
