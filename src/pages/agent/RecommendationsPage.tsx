import { useState } from "react";
import { ArrowLeft, Send, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AgentBottomNav from "@/components/AgentBottomNav";

interface Rec {
  id: string;
  text: string;
  time: string;
  seen: boolean;
}

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [recs, setRecs] = useState<Rec[]>([
    { id: "1", text: "Customers keep asking for Dano Cool Cow milk. We should stock it.", time: "Yesterday", seen: true },
    { id: "2", text: "The Dangote Sugar 500g is almost finished but many people are coming for it.", time: "2 days ago", seen: true },
    { id: "3", text: "I noticed we sell more Indomie in the evening. Maybe we should keep more for evening rush.", time: "3 days ago", seen: false },
  ]);

  const handleSend = () => {
    if (!text.trim()) return;
    setRecs([{ id: Date.now().toString(), text, time: "Just now", seen: false }, ...recs]);
    setText("");
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-xl font-bold text-foreground mb-2">Recommendations</h1>
        <p className="text-sm text-muted-foreground mb-6">Share observations with the business owner</p>

        {/* Input */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-4">
          <textarea
            placeholder="What have you noticed? A product customers keep asking for? Something running low?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>

        {/* Prompt ideas */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["Product request", "Stock alert", "General observation"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setText(prompt === "Product request" ? "Customers keep asking for " : prompt === "Stock alert" ? "This product is running low: " : "")}
              className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground whitespace-nowrap hover:bg-muted transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* History */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Past Recommendations</h3>
        <div className="space-y-2">
          {recs.map((rec) => (
            <div key={rec.id} className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-foreground">{rec.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{rec.time}</span>
                <div className="flex items-center gap-1">
                  {rec.seen ? (
                    <>
                      <Eye className="w-3 h-3 text-success" />
                      <span className="text-[10px] text-success">Seen</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Not seen</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default RecommendationsPage;
