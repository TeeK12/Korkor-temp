import { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { useService, ActiveTimer } from "@/contexts/ServiceContext";

const TimerCard = ({ timer, onDismiss }: { timer: ActiveTimer; onDismiss: (id: string) => void }) => {
  const [remaining, setRemaining] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const update = () => {
      const elapsed = Date.now() - timer.startedAt;
      const r = Math.max(0, timer.durationMs - elapsed);
      setRemaining(r);
      if (r <= 0 && !showAlert) setShowAlert(true);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [timer, showAlert]);

  const totalMs = timer.durationMs;
  const pct = totalMs > 0 ? (remaining / totalMs) * 100 : 0;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const color = pct > 50 ? "text-success" : pct > 25 ? "text-warning" : "text-critical";
  const barColor = pct > 50 ? "bg-success" : pct > 25 ? "bg-warning" : "bg-critical";

  if (showAlert) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
        <div className="text-center p-8 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-warning" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Session Complete</h2>
          <p className="text-lg text-foreground mb-1">Time is up.</p>
          <p className="text-sm text-muted-foreground mb-6">{timer.serviceName} — {timer.customerId}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onDismiss(timer.id)}
              className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-foreground"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{timer.serviceName}</p>
          <p className="text-xs text-muted-foreground">{timer.customerId}</p>
        </div>
        <span className={`text-2xl font-bold font-mono ${color}`}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const ServiceTimers = () => {
  const { activeTimers, removeTimer } = useService();

  if (activeTimers.length === 0) return null;

  return (
    <div className="mb-4">
      {activeTimers.slice(0, 3).map((timer) => (
        <TimerCard key={timer.id} timer={timer} onDismiss={removeTimer} />
      ))}
      {activeTimers.length > 3 && (
        <p className="text-xs text-muted-foreground text-center">+{activeTimers.length - 3} more sessions queued</p>
      )}
    </div>
  );
};

export default ServiceTimers;
