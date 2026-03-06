import { useState } from "react";
import { Check } from "lucide-react";

const WaitlistSlide = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

  const types = ["Buyer", "Agent", "Developer", "Investor"];

  const handleSubmit = () => {
    if (name && email && userType) {
      setSubmitted(true);
    }
  };

  return (
    <div className="reel-item relative flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, hsl(30, 8%, 6%) 0%, hsl(35, 12%, 10%) 50%, hsl(30, 8%, 4%) 100%)",
        }}
      >
        {/* Geometric lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 49%, hsl(40,72%,52%) 50%, transparent 51%),
            linear-gradient(90deg, transparent 49%, hsl(40,72%,52%) 50%, transparent 51%)
          `,
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative z-10 px-8 max-w-md w-full">
        {!submitted ? (
          <div className="fade-in">
            <div className="w-12 h-0.5 bg-primary mb-8" />
            <h2 className="font-display text-3xl font-bold text-foreground italic leading-tight mb-3">
              Be the first to own<br />
              <span className="text-primary">the future of property.</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
              Join the Korkor waitlist for priority access to UAE's most exclusive property platform.
            </p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />

              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">I am a</p>
                <div className="flex gap-2 flex-wrap">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${
                        userType === type
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-secondary border-border text-foreground/60 hover:border-foreground/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground gold-shimmer"
            >
              Join the Waitlist
            </button>

            <p className="font-body text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
              Early access members get priority onboarding and locked-in launch pricing.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground italic mb-2">
              You're on the list.
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              We'll be in touch soon, {name.split(" ")[0]}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistSlide;
