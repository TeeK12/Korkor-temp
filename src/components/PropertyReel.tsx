import { useRef, useState, useCallback } from "react";
import { properties } from "@/data/properties";
import PropertyCard from "./PropertyCard";
import WaitlistSlide from "./WaitlistSlide";
import BottomNav from "./BottomNav";
import { ChevronDown } from "lucide-react";

const PropertyReel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = properties.length + 1; // +1 for waitlist

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  }, []);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-background">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: "var(--overlay-top)" }}
      >
        <h1 className="font-display text-xl font-bold text-foreground tracking-tight italic">
          Korkor
        </h1>
        <div className="flex items-center gap-1">
          <button className="font-body text-xs font-medium text-foreground/50 px-3 py-1.5 rounded-full transition-colors">
            Following
          </button>
          <button className="font-body text-xs font-semibold text-foreground px-3 py-1.5 rounded-full border-b-2 border-primary">
            For You
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary border border-primary/30 flex items-center justify-center">
          <span className="font-display text-xs font-bold text-primary">U</span>
        </div>
      </div>

      {/* Reel scroll */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reel-container hide-scrollbar"
      >
        {properties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            isActive={index === activeIndex}
            index={index}
          />
        ))}
        <WaitlistSlide />
      </div>

      {/* Progress dots */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === activeIndex ? "h-6 bg-primary" : "h-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint on first */}
      {activeIndex === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="w-5 h-5 text-foreground/30" />
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default PropertyReel;
