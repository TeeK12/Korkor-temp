import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExpenses, ExpenseType } from "@/contexts/ExpensesContext";
import { useAuth } from "@/contexts/AuthContext";
import AgentBottomNav from "@/components/AgentBottomNav";
import { toast } from "sonner";

const agentExpenseTypes: ExpenseType[] = ["Packaging", "Transport", "Market Levy", "Miscellaneous"];

const AgentLogExpensePage = () => {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  const { userName } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<ExpenseType>("Packaging");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!name || !amount) return;
    addExpense({
      name,
      amount: parseInt(amount),
      type,
      date,
      note: note || undefined,
      loggedBy: userName || "Agent",
      role: "agent",
    });
    toast.success("Expense submitted!");
    navigate(-1);
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-xl font-bold text-foreground mb-6">Log Expense</h1>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Expense name</label>
            <input
              type="text"
              placeholder="e.g. Packaging bags, Market levy, Delivery cost"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (₦)</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Expense type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ExpenseType)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground"
            >
              {agentExpenseTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
            <input
              type="text"
              placeholder="Add a short note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name || !amount}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
          >
            Submit Expense
          </button>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
};

export default AgentLogExpensePage;
