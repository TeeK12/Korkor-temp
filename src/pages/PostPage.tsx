import { Upload, Camera, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const PostPage = () => {
  return (
    <div className="h-dvh bg-background flex flex-col">
      <div className="pt-12 px-5 pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-foreground italic">List Property</h1>
        <p className="font-body text-xs text-muted-foreground mt-1">Create a new property listing</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-6 pb-24">
        {/* Photo upload */}
        <div className="mb-6">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Photos & Videos</p>
          <div className="grid grid-cols-3 gap-2">
            <button className="aspect-square rounded-xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors">
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-[10px] text-muted-foreground">Camera</span>
            </button>
            <button className="aspect-square rounded-xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-[10px] text-muted-foreground">Upload</span>
            </button>
            <div className="aspect-square rounded-xl bg-secondary/30 border border-border flex items-center justify-center">
              <span className="font-body text-xs text-muted-foreground">+</span>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {[
            { label: "Property Title", placeholder: "e.g. Luxury 3BR in Dubai Marina" },
            { label: "Building Name", placeholder: "e.g. Marina Gate III" },
            { label: "Developer", placeholder: "e.g. Emaar Properties" },
          ].map((field) => (
            <div key={field.label}>
              <label className="font-body text-xs text-foreground/70 mb-1 block">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="font-body text-xs text-foreground/70 mb-1 block">Location</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search or pin location"
                className="flex-1 bg-transparent text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-foreground/70 mb-1 block">Price (AED)</label>
              <input
                type="text"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-xs text-foreground/70 mb-1 block">Type</label>
              <select className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Beds", placeholder: "0" },
              { label: "Baths", placeholder: "0" },
              { label: "Sqft", placeholder: "0" },
            ].map((field) => (
              <div key={field.label}>
                <label className="font-body text-xs text-foreground/70 mb-1 block">{field.label}</label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="font-body text-xs text-foreground/70 mb-1 block">Description</label>
            <textarea
              placeholder="Describe the property..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="font-body text-xs text-foreground/70 mb-1 block">RERA Permit Number</label>
            <input
              type="text"
              placeholder="DXB-R-XXXX"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button className="w-full py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground gold-shimmer mt-4">
            Publish Listing
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PostPage;
