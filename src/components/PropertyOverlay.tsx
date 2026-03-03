import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/data/properties";
import { Badge } from "@/components/ui/badge";

interface PropertyOverlayProps {
  property: Property;
}

const PropertyOverlay = ({ property }: PropertyOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-16 z-10 p-5 pb-24"
      style={{ background: "var(--overlay-gradient)" }}>
      
      <Badge className="mb-3 bg-primary/90 text-primary-foreground font-display text-xs tracking-wide border-0">
        {property.type}
      </Badge>

      <h2 className="font-display text-2xl font-bold text-foreground leading-tight mb-1">
        {property.title}
      </h2>

      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span className="font-body text-sm text-foreground/80">{property.location}</span>
      </div>

      <p className="font-display text-3xl font-bold text-primary mb-3">
        {property.price}
      </p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <BedDouble className="w-4 h-4 text-foreground/60" />
          <span className="font-body text-sm text-foreground/80">{property.beds} beds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-foreground/60" />
          <span className="font-body text-sm text-foreground/80">{property.baths} baths</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Maximize className="w-4 h-4 text-foreground/60" />
          <span className="font-body text-sm text-foreground/80">{property.sqft} sqft</span>
        </div>
      </div>

      <p className="font-body text-sm text-foreground/60 line-clamp-2 leading-relaxed">
        {property.description}
      </p>

      <div className="flex items-center gap-2 mt-4">
        <div className="w-8 h-8 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
          <span className="font-display text-xs font-bold text-foreground">
            {property.agent.name[0]}
          </span>
        </div>
        <div>
          <p className="font-display text-sm font-medium text-foreground">{property.agent.name}</p>
          <p className="font-body text-xs text-muted-foreground">{property.agent.handle}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverlay;
