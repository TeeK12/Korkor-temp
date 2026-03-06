import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Upload, Check, Shield, FileText, CreditCard, Building2 } from "lucide-react";
import type { Property } from "@/data/properties";

interface BuyRentFlowProps {
  property: Property;
  onClose: () => void;
}

const STEPS = ["Property Info", "KYC", "Payment", "Documentation"];

const BuyRentFlow = ({ property, onClose }: BuyRentFlowProps) => {
  const [step, setStep] = useState(0);
  const [signed, setSigned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const isBuy = property.listingType === "buy";

  const dldFee = isBuy ? property.priceNumeric * 0.04 : 0;
  const commission = isBuy ? property.priceNumeric * 0.02 : property.priceNumeric * 0.05;
  const trusteeFee = isBuy ? 4000 : 0;
  const total = property.priceNumeric + dldFee + commission + trusteeFee;

  const formatAED = (n: number) =>
    "AED " + n.toLocaleString("en-AE");

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-border">
        <button onClick={step > 0 ? prev : onClose} className="p-1">
          {step > 0 ? <ChevronLeft className="w-5 h-5 text-foreground" /> : <X className="w-5 h-5 text-foreground" />}
        </button>
        <h2 className="font-display text-sm font-bold text-foreground italic">
          {isBuy ? "Purchase" : "Rental"} Application
        </h2>
        <div className="w-5" />
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-5 pt-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
            <span className={`font-body text-[9px] ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-6">
        {step === 0 && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground italic">{property.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Location", property.location],
                ["Building", property.buildingName],
                ["Developer", property.developer],
                ["Floor", property.floor],
                ["Size", property.sqft + " sqft"],
                ["Bedrooms", property.beds.toString()],
                ["Bathrooms", property.baths.toString()],
                ["Type", property.type],
                ["Service Charge", property.serviceCharge],
                ["RERA Permit", property.reraPermit],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="font-body text-sm text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {property.amenities.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 font-body text-[10px] text-primary">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card border border-primary/40 flex items-center justify-center">
                <span className="font-display text-xs font-bold text-primary">{property.agent.avatar}</span>
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{property.agent.name}</p>
                <p className="font-body text-xs text-muted-foreground">{property.agent.brokerage}</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground italic">KYC Verification</h3>
            </div>
            <p className="font-body text-xs text-muted-foreground">
              Your documents are encrypted and securely stored in compliance with UAE regulations.
            </p>

            {[
              { label: "Full Legal Name", placeholder: "As per passport" },
              { label: "Nationality", placeholder: "Country" },
              { label: "Passport Number", placeholder: "e.g. AB1234567" },
            ].map((field) => (
              <div key={field.label}>
                <label className="font-body text-xs text-foreground/70 mb-1 block">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}

            {["Passport Copy", "Emirates ID / Visa Copy", "Proof of Address", "Source of Funds Declaration"].map((doc) => (
              <button
                key={doc}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-dashed border-border hover:border-primary/40 transition-colors"
              >
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="font-body text-sm text-foreground/70">{doc}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground italic">Payment Summary</h3>
            </div>

            <div className="space-y-2">
              {[
                [isBuy ? "Purchase Price" : "Annual Rent", formatAED(property.priceNumeric)],
                ...(isBuy ? [
                  ["DLD Transfer Fee (4%)", formatAED(dldFee)],
                  ["Agency Commission (2%)", formatAED(commission)],
                  ["Trustee Fee", formatAED(trusteeFee)],
                ] : [
                  ["Agency Commission (5%)", formatAED(commission)],
                ]),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-body text-xs text-foreground/70">{label}</span>
                  <span className="font-body text-sm text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3">
                <span className="font-display text-sm font-bold text-foreground">Total</span>
                <span className="font-display text-lg font-bold text-primary">{formatAED(total)}</span>
              </div>
            </div>

            <div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Payment Method</p>
              <div className="space-y-2">
                {["Bank Transfer", "Credit / Debit Card", "Cryptocurrency"].map((method) => (
                  <button
                    key={method}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-primary/40" />
                    <span className="font-body text-sm text-foreground">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {isBuy && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="font-body text-xs text-primary font-medium mb-1">Off-Plan Payment Schedule</p>
                <div className="space-y-1.5">
                  {[
                    ["Booking", "10%", formatAED(property.priceNumeric * 0.1)],
                    ["30 Days", "10%", formatAED(property.priceNumeric * 0.1)],
                    ["During Construction", "40%", formatAED(property.priceNumeric * 0.4)],
                    ["On Handover", "40%", formatAED(property.priceNumeric * 0.4)],
                  ].map(([milestone, pct, amount]) => (
                    <div key={milestone} className="flex justify-between">
                      <span className="font-body text-[11px] text-foreground/60">{milestone} ({pct})</span>
                      <span className="font-body text-[11px] text-foreground">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && !confirmed && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground italic">
                {isBuy ? "Memorandum of Understanding" : "Tenancy Contract"}
              </h3>
            </div>

            <div className="w-full h-64 rounded-lg bg-secondary/50 border border-border overflow-y-auto p-4">
              <p className="font-body text-xs text-foreground/60 leading-relaxed">
                This {isBuy ? "Memorandum of Understanding (MOU)" : "Tenancy Contract"} is entered into
                between the parties for the {isBuy ? "purchase" : "rental"} of the property known as{" "}
                <strong className="text-foreground">{property.title}</strong>, located at{" "}
                <strong className="text-foreground">{property.location}</strong>, for the{" "}
                {isBuy ? "consideration" : "annual rent"} of{" "}
                <strong className="text-primary">{property.price}</strong>.
                <br /><br />
                The parties agree to the terms and conditions set forth herein, subject to the laws
                and regulations of the United Arab Emirates and the Real Estate Regulatory Agency (RERA).
                <br /><br />
                RERA Permit Number: <strong className="text-foreground">{property.reraPermit}</strong>
                <br /><br />
                [Full legal document text would appear here with all terms, conditions, obligations,
                representations, and warranties of both parties...]
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <button
                onClick={() => setSigned(!signed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  signed ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {signed && <Check className="w-3 h-3 text-primary-foreground" />}
              </button>
              <span className="font-body text-xs text-foreground/70 leading-relaxed">
                I have read and agree to the terms of this {isBuy ? "MOU" : "Tenancy Contract"} and
                confirm all information provided is accurate.
              </span>
            </label>
          </div>
        )}

        {step === 3 && confirmed && (
          <div className="flex flex-col items-center justify-center h-full text-center fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground italic mb-2">
              Application Submitted
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4 max-w-xs">
              Your {isBuy ? "purchase" : "rental"} application for {property.title} has been received.
            </p>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border w-full max-w-xs">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reference Number</p>
              <p className="font-display text-lg font-bold text-primary">
                KOR-{property.id.padStart(4, "0")}-{Date.now().toString().slice(-6)}
              </p>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-xs">
              Your agent {property.agent.name} will contact you within 24 hours to confirm next steps.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 rounded-xl bg-primary font-display font-bold text-sm text-primary-foreground"
            >
              Back to Browsing
            </button>
          </div>
        )}
      </div>

      {/* Footer button */}
      {!(step === 3 && confirmed) && (
        <div className="px-5 pb-8 pt-4 border-t border-border">
          {step < 3 ? (
            <button
              onClick={next}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground gold-shimmer flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              disabled={!signed}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-opacity ${
                signed
                  ? "text-primary-foreground gold-shimmer"
                  : "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
            >
              Sign & Confirm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyRentFlow;
