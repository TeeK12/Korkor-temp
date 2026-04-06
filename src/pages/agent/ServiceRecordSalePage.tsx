import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, Clock, Check, ChevronDown } from "lucide-react";
import { useService, SessionTier, Service } from "@/contexts/ServiceContext";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";

const ServiceRecordSalePage = () => {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const { services, getAgentAllocation, deductChips, recordServiceSale, addTimer } = useService();
  const agentName = userName || "Agent";
  const alloc = getAgentAllocation(agentName);
  const remaining = alloc.allocated - alloc.used;
  const pct = alloc.allocated > 0 ? (remaining / alloc.allocated) * 100 : 0;
  const chipColor = pct > 50 ? "text-success" : pct > 25 ? "text-warning" : "text-critical";
  const barColor = pct > 50 ? "bg-success" : pct > 25 ? "bg-warning" : "bg-critical";

  const [showChipDetail, setShowChipDetail] = useState(false);
  const [showRequestChips, setShowRequestChips] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTier, setSelectedTier] = useState<SessionTier | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [customerId, setCustomerId] = useState("");

  // Flatten all tiers for selection
  const allTiers = services.flatMap(s => s.tiers.map(t => ({ ...t, serviceName: s.name, serviceId: s.id })));

  const handleSelectTier = (tier: typeof allTiers[0]) => {
    setSelectedService(services.find(s => s.id === tier.serviceId) || null);
    setSelectedTier(tier);
  };

  const handleConfirm = () => {
    if (!selectedTier || !selectedService) return;
    deductChips(agentName, selectedTier.chips, selectedService.name);
    recordServiceSale({
      agentName,
      serviceName: selectedService.name,
      tierSessions: selectedTier.sessions,
      duration: selectedTier.duration,
      chipsDeducted: selectedTier.chips,
      amount: selectedTier.price,
      timestamp: new Date().toISOString(),
    });
    addTimer({
      serviceName: selectedService.name,
      customerId: customerId || `Customer ${Date.now().toString().slice(-4)}`,
      durationMs: selectedTier.duration * 60 * 1000,
      startedAt: Date.now(),
    });
    setConfirmed(true);
    setTimeout(() => navigate("/agent"), 1800);
  };

  if (confirmed) {
    return (
      <div className="app-shell bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Session Started!</h2>
          <p className="text-sm text-muted-foreground">Timer is now running on your home page</p>
        </div>
      </div>
    );
  }

  if (showPreview && selectedTier && selectedService) {
    return (
      <div className="app-shell bg-background">
        <div className="page-content px-4 pt-4">
          <button onClick={() => setShowPreview(false)} className="flex items-center gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold text-foreground mb-6">Confirm Session</h1>

          <div className="bg-card rounded-2xl p-5 border border-border mb-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Service</span>
              <span className="text-sm font-semibold text-foreground">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sessions</span>
              <span className="text-sm font-semibold text-foreground">{selectedTier.sessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-semibold text-foreground">{selectedTier.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Chips deducted</span>
              <span className="text-sm font-bold text-warning">{selectedTier.chips}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="text-sm font-medium text-foreground">Amount to collect</span>
              <span className="text-xl font-bold text-primary">₦{selectedTier.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground block mb-1.5">Customer ID (optional)</label>
            <input
              placeholder="e.g. Seat 3, Customer name"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          <button
            onClick={handleConfirm}
            disabled={remaining < selectedTier.chips}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
          >
            {remaining < selectedTier.chips ? "Not enough chips" : "Submit Sale"}
          </button>
        </div>
      </div>
    );
  }

  if (showChipDetail) {
    const todayUsed = alloc.history.filter(h => h.action === "deducted" && new Date(h.timestamp).toDateString() === new Date().toDateString()).reduce((s, h) => s + h.amount, 0);
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0,0,0,0);
    const weekUsed = alloc.history.filter(h => h.action === "deducted" && new Date(h.timestamp) >= weekStart).reduce((s, h) => s + h.amount, 0);

    return (
      <div className="app-shell bg-background">
        <div className="page-content px-4 pt-4">
          <button onClick={() => setShowChipDetail(false)} className="flex items-center gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold text-foreground mb-6">My Chips</h1>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">{todayUsed}</p>
              <p className="text-[10px] text-muted-foreground">chips used</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">{weekUsed}</p>
              <p className="text-[10px] text-muted-foreground">chips used</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Total Allocated</span>
              <span className="text-sm font-bold text-foreground">{alloc.allocated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className={`text-2xl font-bold ${chipColor}`}>{remaining}</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-3">Usage History</h3>
          <div className="space-y-2 mb-6">
            {alloc.history.length === 0 && <p className="text-sm text-muted-foreground">No history yet</p>}
            {[...alloc.history].reverse().map((h, i) => (
              <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{h.sessionType}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-bold ${h.action === "deducted" ? "text-critical" : "text-success"}`}>
                  {h.action === "deducted" ? "-" : "+"}{h.amount}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setShowChipDetail(false); setShowRequestChips(true); }}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
          >
            Request More Chips
          </button>
        </div>
      </div>
    );
  }

  if (showRequestChips) {
    return <RequestChipsView onBack={() => setShowRequestChips(false)} agentName={agentName} />;
  }

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Record a Sale</h1>
        </div>

        {/* Chip Balance Card */}
        <button
          onClick={() => setShowChipDetail(true)}
          className="w-full bg-card rounded-2xl p-5 border border-border mb-5 text-left active:opacity-80"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Chips Remaining</span>
            </div>
            <span className={`text-2xl font-bold ${chipColor}`}>{remaining} <span className="text-sm text-muted-foreground font-normal">/ {alloc.allocated}</span></span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted">
            <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Tap for details</p>
        </button>

        {/* Session Selection */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Select Session Type</h2>
        <div className="space-y-2 mb-6">
          {allTiers.map((tier, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTier(tier)}
              className={`w-full bg-card rounded-xl p-4 border text-left transition-all ${
                selectedTier?.id === tier.id ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{tier.serviceName} — {tier.sessions} Session{tier.sessions > 1 ? "s" : ""}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{tier.duration} min</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Coins className="w-3 h-3" />{tier.chips} chip{tier.chips !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">₦{tier.price.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Preview details */}
        {selectedTier && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Chips to deduct</span><span className="font-bold text-warning">{selectedTier.chips}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount to collect</span><span className="font-bold text-primary">₦{selectedTier.price.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-bold text-foreground">{selectedTier.duration} minutes</span></div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowPreview(true)}
          disabled={!selectedTier}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 mb-4"
        >
          Preview
        </button>
      </div>
      <AgentBottomNav />
    </div>
  );
};

// Request Chips sub-view
const RequestChipsView = ({ onBack, agentName }: { onBack: () => void; agentName: string }) => {
  const { requestChips, autoApproveChips } = useService();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!amount) return;
    requestChips(agentName, parseFloat(amount), note);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="app-shell bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">
            {autoApproveChips ? "Chips Added!" : "Request Sent!"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {autoApproveChips ? `${amount} chips have been added to your balance` : "Waiting for owner approval"}
          </p>
          <button onClick={onBack} className="mt-4 text-primary text-sm font-medium">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl font-bold text-foreground mb-6">Request More Chips</h1>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">How many chips?</label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Note (optional)</label>
            <input
              placeholder="e.g. Running low, busy day"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!amount}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRecordSalePage;
