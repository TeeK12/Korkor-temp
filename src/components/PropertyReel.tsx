import { useRef, useState } from "react";
import { properties } from "@/data/properties";
import PropertyOverlay from "./PropertyOverlay";
import ActionButtons from "./ActionButtons";
import BottomNav from "./BottomNav";
import { ChevronDown } from "lucide-react";

const PropertyReel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-background">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-12 pb-3"
        style={{ background: "var(--overlay-top)" }}>
        <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
          Prop<span className="text-primary">Reel</span>
        </h1>
        <div className="flex items-center gap-1">
          <button className="font-display text-sm font-medium text-foreground/60 px-3 py-1 rounded-full">
            Following
          </button>
          <button className="font-display text-sm font-bold text-foreground px-3 py-1 rounded-full border-b-2 border-primary">
            For You
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
          <span className="font-display text-xs font-bold text-foreground">U</span>
        </div>
      </div>

      {/* Reel scroll */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reel-container hide-scrollbar"
      >
        {properties.map((property, index) => (
          <div key={property.id} className="reel-item relative">
            {/* Full screen image */}
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Property info overlay */}
            <PropertyOverlay property={property} />

            {/* Action buttons - right side */}
            <div className="absolute right-3 bottom-36 z-20">
              <ActionButtons property={property} />
            </div>

            {/* Scroll indicator on first item */}
            {index === 0 && activeIndex === 0 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <ChevronDown className="w-5 h-5 text-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        {properties.map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === activeIndex ? "h-6 bg-primary" : "h-1.5 bg-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default PropertyReel;
