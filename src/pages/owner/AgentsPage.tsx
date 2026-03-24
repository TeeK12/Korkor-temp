import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Copy, Check } from "lucide-react";
import { agents } from "@/data/mockData";
import OwnerBottomNav from "@/components/OwnerBottomNav";

// Mock unread counts per agent
const unreadRecs: Record<string, number> = { "1": 2, "2": 0 };

const AgentsPage = () => {
  const navigate = useNavigate();
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const inviteCode = "482971";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-foreground">Sub Accounts</h1>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Invite Agent
          </button>
        </div>

        {/* Invite modal */}
        {showInvite && (
          <div className="bg-card rounded-lg p-5 border border-border mb-4 animate-fade-in">
            <p className="text-sm font-semibold text-foreground mb-2">Share this invite code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-primary tracking-[0.3em]">{inviteCode}</span>
              </div>
              <button onClick={handleCopy} className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                {copied ? <Check className="w-5 h-5 text-primary-foreground" /> : <Copy className="w-5 h-5 text-primary-foreground" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Agent enters this code during sign up to link to your business</p>
            <button onClick={() => setShowInvite(false)} className="text-xs text-primary mt-3">Close</button>
          </div>
        )}

        {/* Agent list */}
        <div className="space-y-3">
          {agents.map((agent) => {
            const unread = unreadRecs[agent.id] || 0;
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
                  <p className="text-xs text-muted-foreground">{agent.role} · {agent.lastActive}</p>
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
