import { useState } from "react";
import {
  User, Settings, FileText, CreditCard, Heart, Bookmark, Home,
  MessageCircle, BarChart3, Users, Building2, Wrench, ChevronRight,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const ProfilePage = () => {
  const [mode, setMode] = useState<"buyer" | "agent">("buyer");

  return (
    <div className="h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 px-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold text-foreground italic">Profile</h1>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground italic">Guest User</p>
            <p className="font-body text-xs text-muted-foreground">Sign in to access all features</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["buyer", "agent"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl font-body text-xs font-medium border transition-colors capitalize ${
                mode === m
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-secondary border-border text-foreground/60"
              }`}
            >
              {m === "buyer" ? "Buyer / Renter" : "Agent"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 pb-24">
        {mode === "buyer" ? (
          <div className="space-y-1">
            {[
              { icon: FileText, label: "Active Applications", badge: "2" },
              { icon: Bookmark, label: "Saved Properties", badge: "7" },
              { icon: Heart, label: "Liked Properties", badge: "23" },
              { icon: FileText, label: "Documents", badge: null },
              { icon: CreditCard, label: "Payment History", badge: null },
              { icon: CreditCard, label: "Rent Payments", badge: "Due" },
              { icon: CreditCard, label: "Service Charges", badge: null },
              { icon: Wrench, label: "Maintenance Requests", badge: null },
              { icon: MessageCircle, label: "Messages", badge: "3" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full font-body text-[10px] font-medium ${
                      item.badge === "Due"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-primary/15 text-primary"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {[
              { icon: Building2, label: "Active Listings", badge: "5" },
              { icon: Users, label: "Leads & Enquiries", badge: "12" },
              { icon: Home, label: "Upload Listing", badge: null },
              { icon: CreditCard, label: "Commission Tracker", badge: null },
              { icon: FileText, label: "RERA Permits", badge: null },
              { icon: BarChart3, label: "Performance Analytics", badge: null },
              { icon: MessageCircle, label: "Client Messages", badge: "8" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-body text-[10px] font-medium">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
