import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/data/properties";

interface PropertyOverlayProps {
  property: Property;
}

const PropertyOverlay = ({ property }: PropertyOverlayProps) => {
  return (
    <div
      className="absolute bottom-0 left-0 right-16 z-10 p-5 pb-24"
      style={{ background: "var(--overlay-gradient)" }}
    >
      <div className="inline-block mb-2 px-2.5 py-0.5 rounded-sm bg-primary/15 border border-primary/30">
        <span className="font-body text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">
          {property.type} · {property.listingType === "buy" ? "For Sale" : "For Rent"}
        </span>
      </div>

      <h2 className="font-display text-xl font-bold text-foreground leading-snug mb-1 italic">
        {property.title}
      </h2>

      <div className="flex items-center gap-1.5 mb-2">
        <MapPin className="w-3 h-3 text-primary" />
        <span className="font-body text-xs text-foreground/70">{property.location}</span>
      </div>

      <p className="font-display text-2xl font-bold text-primary mb-3">
        {property.price}
      </p>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <BedDouble className="w-3.5 h-3.5 text-foreground/50" />
          <span className="font-body text-xs text-foreground/70">{property.beds}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="w-3.5 h-3.5 text-foreground/50" />
          <span className="font-body text-xs text-foreground/70">{property.baths}</span>
        </div>
        <div className="flex items-center gap-1">
          <Maximize className="w-3.5 h-3.5 text-foreground/50" />
          <span className="font-body text-xs text-foreground/70">{property.sqft} sqft</span>
        </div>
      </div>

      <p className="font-body text-xs text-foreground/50 line-clamp-2 leading-relaxed">
        {property.description}
      </p>

      {/* Agent info */}
      <div className="flex items-center gap-2 mt-3">
        <div className="w-7 h-7 rounded-full bg-card border border-primary/40 flex items-center justify-center">
          <span className="font-display text-[10px] font-bold text-primary">
            {property.agent.avatar}
          </span>
        </div>
        <div>
          <p className="font-body text-xs font-medium text-foreground">{property.agent.name}</p>
          <p className="font-body text-[10px] text-muted-foreground">{property.agent.brokerage}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverlay;
