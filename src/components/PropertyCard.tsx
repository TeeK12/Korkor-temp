import { useState, useEffect, useCallback } from "react";
import type { Property, Hotspot } from "@/data/properties";
import ActionButtons from "./ActionButtons";
import PropertyOverlay from "./PropertyOverlay";
import SpaceExplorer from "./SpaceExplorer";
import BuyRentFlow from "./BuyRentFlow";

interface PropertyCardProps {
  property: Property;
  isActive: boolean;
  index: number;
}

const PropertyCard = ({ property, isActive, index }: PropertyCardProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showHotspots, setShowHotspots] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showSpaceExplorer, setShowSpaceExplorer] = useState(false);
  const [showBuyRent, setShowBuyRent] = useState(false);

  const media = property.media;
  const currentMedia = media[currentMediaIndex];
  const AUTO_ADVANCE_MS = 4000;

  // Auto-advance media
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % media.length);
      setShowHotspots(false);
      setSelectedHotspot(null);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isActive, media.length]);

  const handleImageTap = useCallback((e: React.MouseEvent) => {
    // Don't trigger if tapping on buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-action]")) return;
    
    if (currentMedia.hotspots && currentMedia.hotspots.length > 0) {
      setShowHotspots((prev) => !prev);
      setSelectedHotspot(null);
    }
  }, [currentMedia]);

  const handleHotspotTap = (hotspot: Hotspot) => {
    setSelectedHotspot(selectedHotspot?.label === hotspot.label ? null : hotspot);
  };

  return (
    <div className="reel-item relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-700"
        style={{ background: currentMedia.url }}
        onClick={handleImageTap}
      >
        {/* Architectural line art overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            linear-gradient(30deg, transparent 48%, hsl(40,72%,52%) 49%, transparent 51%),
            linear-gradient(-30deg, transparent 48%, hsl(40,72%,52%) 49%, transparent 51%)
          `,
          backgroundSize: "80px 80px",
        }} />
      </div>

      {/* Media progress bar */}
      <div className="absolute top-24 left-5 right-14 z-20 flex gap-1">
        {media.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-foreground/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                i < currentMediaIndex
                  ? "bg-foreground/80 w-full"
                  : i === currentMediaIndex
                  ? "bg-primary"
                  : "w-0"
              }`}
              style={
                i === currentMediaIndex && isActive
                  ? { animation: `progressFill ${AUTO_ADVANCE_MS}ms linear forwards` }
                  : i < currentMediaIndex
                  ? { width: "100%" }
                  : { width: "0%" }
              }
            />
          </div>
        ))}
      </div>

      {/* Media type label */}
      <div className="absolute top-[7.5rem] left-5 z-20">
        <span className="font-body text-[10px] uppercase tracking-widest text-foreground/40">
          {currentMedia.alt}
        </span>
      </div>

      {/* Hotspot dots */}
      {showHotspots && currentMedia.hotspots && (
        <div className="absolute inset-0 z-15">
          {currentMedia.hotspots.map((hotspot) => (
            <button
              key={hotspot.label}
              className="absolute hotspot-dot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}
              onClick={(e) => { e.stopPropagation(); handleHotspotTap(hotspot); }}
            >
              <div className="w-4 h-4 rounded-full bg-primary/90 border-2 border-foreground/40" />
            </button>
          ))}

          {/* Hotspot detail popup */}
          {selectedHotspot && (
            <div
              className="absolute z-30 bg-card/95 backdrop-blur-xl border border-border rounded-lg p-3 max-w-[200px] fade-in"
              style={{
                left: `${Math.min(selectedHotspot.x, 65)}%`,
                top: `${Math.min(selectedHotspot.y + 5, 75)}%`,
              }}
            >
              <p className="font-display text-sm font-semibold text-foreground">{selectedHotspot.label}</p>
              <p className="font-body text-xs text-primary mt-0.5">{selectedHotspot.brand}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed">{selectedHotspot.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Property info overlay */}
      <PropertyOverlay property={property} />

      {/* Action buttons */}
      <div className="absolute right-3 bottom-36 z-20">
        <ActionButtons
          property={property}
          onInfoTap={() => setShowSpaceExplorer(true)}
        />
      </div>

      {/* Space Explorer Panel */}
      {showSpaceExplorer && (
        <SpaceExplorer
          property={property}
          onClose={() => setShowSpaceExplorer(false)}
          onBuyRent={() => {
            setShowSpaceExplorer(false);
            setShowBuyRent(true);
          }}
        />
      )}

      {/* Buy/Rent Flow */}
      {showBuyRent && (
        <BuyRentFlow
          property={property}
          onClose={() => setShowBuyRent(false)}
        />
      )}
    </div>
  );
};

export default PropertyCard;
