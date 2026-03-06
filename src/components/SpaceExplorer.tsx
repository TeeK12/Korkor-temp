import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import type { Property, Hotspot } from "@/data/properties";

interface SpaceExplorerProps {
  property: Property;
  onClose: () => void;
  onBuyRent: () => void;
}

const SpaceExplorer = ({ property, onClose, onBuyRent }: SpaceExplorerProps) => {
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [spaceMediaIndex, setSpaceMediaIndex] = useState(0);
  const [showHotspots, setShowHotspots] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const handleSpaceTap = (index: number) => {
    setSelectedSpace(index);
    setSpaceMediaIndex(0);
    setShowHotspots(false);
    setSelectedHotspot(null);
  };

  const handleBack = () => {
    setSelectedSpace(null);
    setShowHotspots(false);
    setSelectedHotspot(null);
  };

  const currentSpaceMedia = selectedSpace !== null
    ? property.spaces[selectedSpace].media[spaceMediaIndex]
    : null;

  return (
    <div className="absolute inset-0 z-40 slide-up">
      {/* Top quarter - property image peek */}
      <div className="h-[25%] relative" onClick={onClose}>
        <div className="absolute inset-0" style={{ background: property.media[0].url }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
      </div>

      {/* Bottom 3/4 - panel */}
      <div className="h-[75%] bg-card rounded-t-3xl -mt-6 relative overflow-hidden">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-foreground/20" />

        <div className="p-5 pt-8 h-full overflow-y-auto hide-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {selectedSpace !== null ? (
              <button onClick={handleBack} className="flex items-center gap-1 text-primary">
                <ChevronLeft className="w-4 h-4" />
                <span className="font-body text-sm">Back</span>
              </button>
            ) : (
              <h3 className="font-display text-lg font-bold text-foreground italic">
                Explore Spaces
              </h3>
            )}
            <button onClick={onClose} className="p-2 rounded-full bg-secondary">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {selectedSpace === null ? (
            <>
              {/* Space cards horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
                {property.spaces.map((space, i) => (
                  <button
                    key={space.name}
                    onClick={() => handleSpaceTap(i)}
                    className="flex-shrink-0 w-32 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
                  >
                    <div
                      className="w-full h-24"
                      style={{ background: space.media[0].url }}
                    />
                    <div className="p-2 bg-secondary">
                      <p className="font-body text-xs font-medium text-foreground text-center truncate">
                        {space.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Property quick info */}
              <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <h4 className="font-display text-base font-bold text-foreground italic mb-2">
                  {property.title}
                </h4>
                <p className="font-body text-xs text-muted-foreground mb-3">{property.description}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-display text-lg font-bold text-primary">{property.beds}</p>
                    <p className="font-body text-[10px] text-muted-foreground">Bedrooms</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-primary">{property.baths}</p>
                    <p className="font-body text-[10px] text-muted-foreground">Bathrooms</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-primary">{property.sqft}</p>
                    <p className="font-body text-[10px] text-muted-foreground">Sq Ft</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-4">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2.5 py-1 rounded-full bg-secondary border border-border font-body text-[10px] text-foreground/70"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buy / Rent buttons */}
              <div className="mt-6 flex gap-3">
                {property.listingType === "buy" ? (
                  <button
                    onClick={onBuyRent}
                    className="flex-1 py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground gold-shimmer"
                  >
                    Buy Now — {property.price}
                  </button>
                ) : (
                  <button
                    onClick={onBuyRent}
                    className="flex-1 py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground gold-shimmer"
                  >
                    Rent Now — {property.price}
                  </button>
                )}
              </div>
              <div className="h-8" />
            </>
          ) : (
            <>
              {/* Expanded space view */}
              <h4 className="font-display text-base font-bold text-foreground italic mb-3">
                {property.spaces[selectedSpace].name}
              </h4>

              <div
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3"
                onClick={() => {
                  if (currentSpaceMedia?.hotspots?.length) {
                    setShowHotspots(!showHotspots);
                    setSelectedHotspot(null);
                  }
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: currentSpaceMedia?.url }}
                />

                {/* Hotspots */}
                {showHotspots && currentSpaceMedia?.hotspots?.map((h) => (
                  <button
                    key={h.label}
                    className="absolute hotspot-dot z-10"
                    style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(selectedHotspot?.label === h.label ? null : h);
                    }}
                  >
                    <div className="w-4 h-4 rounded-full bg-primary/90 border-2 border-foreground/40" />
                  </button>
                ))}

                {selectedHotspot && (
                  <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-xl border border-border rounded-lg p-3 z-20 fade-in">
                    <p className="font-display text-sm font-semibold text-foreground">{selectedHotspot.label}</p>
                    <p className="font-body text-xs text-primary">{selectedHotspot.brand}</p>
                    <p className="font-body text-[11px] text-muted-foreground mt-1">{selectedHotspot.description}</p>
                  </div>
                )}

                {currentSpaceMedia?.hotspots?.length && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm">
                    <span className="font-body text-[10px] text-foreground/60">Tap to explore items</span>
                  </div>
                )}
              </div>

              {/* Media dots */}
              {property.spaces[selectedSpace].media.length > 1 && (
                <div className="flex justify-center gap-1.5 mb-4">
                  {property.spaces[selectedSpace].media.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSpaceMediaIndex(i); setShowHotspots(false); setSelectedHotspot(null); }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === spaceMediaIndex ? "bg-primary" : "bg-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceExplorer;
