import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExpenses, ExpenseType } from "@/contexts/ExpensesContext";
import OwnerBottomNav from "@/components/OwnerBottomNav";
import { toast } from "sonner";

const expenseTypes: ExpenseType[] = ["Fuel/Generator", "Rent", "Salary", "Packaging", "Transport", "Market Levy", "Electricity", "Miscellaneous"];

const LogExpensePage = () => {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<ExpenseType>("Fuel/Generator");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (!name || !amount) return;
    addExpense({
      name,
      amount: parseInt(amount),
      type,
      date,
      note: note || undefined,
      loggedBy: "owner",
      role: "owner",
    });
    toast.success("Expense saved!");
    navigate("/owner/expenses");
  };

  return (
    <div className="app-shell dark bg-background">
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
              placeholder="e.g. Generator fuel, Shop rent, Staff salary"
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
              {expenseTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
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

          <button
            onClick={handleSave}
            disabled={!name || !amount}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
          >
            Save Expense
          </button>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default LogExpensePage;
