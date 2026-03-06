import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { properties } from "@/data/properties";
import BottomNav from "@/components/BottomNav";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [listingType, setListingType] = useState<"all" | "buy" | "rent">("all");

  const filtered = properties.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.area.toLowerCase().includes(query.toLowerCase());
    const matchesType = listingType === "all" || p.listingType === listingType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="h-dvh bg-background flex flex-col">
      <div className="pt-12 px-5 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground italic mb-4">Discover</h1>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search location, building, area..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-colors ${
              showFilters ? "bg-primary/10 border-primary" : "bg-secondary border-border"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 fade-in">
            <div className="flex gap-2">
              {(["all", "buy", "rent"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setListingType(t)}
                  className={`px-4 py-2 rounded-full font-body text-xs border transition-colors capitalize ${
                    listingType === t
                      ? "bg-primary/15 border-primary text-primary"
                      : "bg-secondary border-border text-foreground/60"
                  }`}
                >
                  {t === "all" ? "All" : t === "buy" ? "For Sale" : "For Rent"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-24">
        <p className="font-body text-xs text-muted-foreground mb-3">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
        </p>

        <div className="space-y-3">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
            >
              <div className="h-40 relative" style={{ background: property.media[0].url }}>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-card/80 backdrop-blur-sm">
                  <span className="font-body text-[10px] uppercase tracking-wider text-primary font-semibold">
                    {property.listingType === "buy" ? "For Sale" : "For Rent"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-card">
                <h3 className="font-display text-sm font-bold text-foreground italic truncate">{property.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-body text-xs text-muted-foreground">{property.location}</span>
                </div>
                <p className="font-display text-base font-bold text-primary mt-1">{property.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3 text-foreground/40" />
                    <span className="font-body text-[11px] text-foreground/60">{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3 text-foreground/40" />
                    <span className="font-body text-[11px] text-foreground/60">{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-3 h-3 text-foreground/40" />
                    <span className="font-body text-[11px] text-foreground/60">{property.sqft} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
