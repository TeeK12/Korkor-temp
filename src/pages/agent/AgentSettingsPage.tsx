import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Building2, ChevronRight, LogOut, Send, Mic, Square, Play, Pause, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

interface Rec {
  id: string;
  text: string;
  hasVoice: boolean;
  time: string;
  seen: boolean;
}

const AgentSettingsPage = () => {
  const navigate = useNavigate();
  const { logout, userName, businessName } = useAuth();
  const [activeSection, setActiveSection] = useState<"menu" | "linked">("menu");
  const [recText, setRecText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [playingBack, setPlayingBack] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [recs, setRecs] = useState<Rec[]>([
    { id: "1", text: "Customers keep asking for Dano Cool Cow milk. We should stock it.", hasVoice: false, time: "Yesterday", seen: true },
    { id: "2", text: "The Dangote Sugar 500g is almost finished but many people are coming for it.", hasVoice: false, time: "2 days ago", seen: true },
    { id: "3", text: "", hasVoice: true, time: "3 days ago", seen: false },
  ]);

  const startRecording = () => {
    setRecording(true);
    setRecordDuration(0);
    timerRef.current = setInterval(() => {
      setRecordDuration((d) => d + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setHasRecording(true);
  };

  const handleSend = () => {
    if (!recText.trim() && !hasRecording) return;
    setRecs([
      { id: Date.now().toString(), text: recText, hasVoice: hasRecording, time: "Just now", seen: false },
      ...recs,
    ]);
    setRecText("");
    setHasRecording(false);
    setRecordDuration(0);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Linked Business Page with Recommendations
  if (activeSection === "linked") {
    return (
      <div className="app-shell bg-background">
        <div className="page-content px-4 pt-4">
          <button onClick={() => setActiveSection("menu")} className="flex items-center gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>

          <h1 className="text-xl font-bold text-foreground mb-1">Linked Business</h1>
          <p className="text-sm text-muted-foreground mb-6">{businessName || "Mama Nkechi Provisions"}</p>

          {/* Business info card */}
          <div className="bg-card rounded-2xl p-4 border border-border mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Business Name</span>
                <span className="text-sm font-medium text-foreground">{businessName || "Mama Nkechi Provisions"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Your Role</span>
                <span className="text-sm font-medium text-foreground">Sales Agent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Joined</span>
                <span className="text-sm font-medium text-foreground">15 Jan 2025</span>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-foreground mb-1">Send a Recommendation</h2>
            <p className="text-xs text-muted-foreground mb-4">Share what you're seeing on the ground with your business owner</p>

            {/* Text input */}
            <textarea
              placeholder="Type your observation or suggestion…"
              value={recText}
              onChange={(e) => setRecText(e.target.value)}
              rows={3}
              className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
            />

            {/* Voice recording */}
            <div className="mb-3">
              {!recording && !hasRecording && (
                <button
                  onMouseDown={startRecording}
                  onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm"
                >
                  <Mic className="w-4 h-4" />
                  Hold to Record
                </button>
              )}

              {recording && (
                <button
                  onMouseUp={stopRecording}
                  onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm w-full"
                >
                  <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  <span className="flex-1 text-left">Recording... {formatDuration(recordDuration)}</span>
                  {/* Waveform animation */}
                  <div className="flex items-center gap-0.5">
                    {[3, 5, 2, 6, 4, 3, 5].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-destructive rounded-full animate-pulse"
                        style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <Square className="w-4 h-4" />
                </button>
              )}

              {hasRecording && !recording && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-success/10 text-success text-sm">
                  <button onClick={() => setPlayingBack(!playingBack)}>
                    {playingBack ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 h-1 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-success rounded-full" />
                  </div>
                  <span className="text-xs">{formatDuration(recordDuration)}</span>
                  <button onClick={() => { setHasRecording(false); setRecordDuration(0); }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!recText.trim() && !hasRecording}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send Recommendation
            </button>
          </div>

          {/* Recommendation history */}
          <h3 className="text-sm font-semibold text-foreground mb-3">Past Recommendations</h3>
          <div className="space-y-2">
            {recs.map((rec) => (
              <div key={rec.id} className="bg-card rounded-xl p-4 border border-border">
                {rec.text ? (
                  <p className="text-sm text-foreground">{rec.text}</p>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice message</span>
                  </div>
                )}
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
                        <span className="text-[10px] text-muted-foreground">Pending</span>
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
  }

  // Main settings menu
  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile card */}
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{(userName || "C")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName || "Chidi Okonkwo"}</p>
            <p className="text-xs text-muted-foreground">Agent</p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { icon: User, label: "Personal Profile", desc: "Name, phone number", action: undefined },
            { icon: Lock, label: "Change PIN", desc: "Update your 4-digit login PIN", action: undefined },
            { icon: Building2, label: "Linked Business", desc: businessName || "Mama Nkechi Provisions", action: () => setActiveSection("linked") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-3 py-4 border-b border-border"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 py-4 text-destructive mt-6"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default AgentSettingsPage;
