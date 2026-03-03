import { Heart, Bookmark, Share2, MessageCircle, Eye } from "lucide-react";
import { useState } from "react";
import type { Property } from "@/data/properties";

interface ActionButtonsProps {
  property: Property;
}

const ActionButtons = ({ property }: ActionButtonsProps) => {
  const [liked, setLiked] = useState(property.liked);
  const [saved, setSaved] = useState(property.saved);
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <button onClick={handleLike} className="flex flex-col items-center gap-1">
        <div className={`rounded-full bg-secondary/60 backdrop-blur-sm p-3 ${likeAnim ? "heart-pulse" : ""}`}>
          <Heart
            className={`w-6 h-6 transition-colors ${liked ? "fill-destructive text-destructive" : "text-foreground"}`}
          />
        </div>
        <span className="text-xs font-body text-foreground/80">
          {liked ? "Liked" : "Like"}
        </span>
      </button>

      <button onClick={() => setSaved(!saved)} className="flex flex-col items-center gap-1">
        <div className="rounded-full bg-secondary/60 backdrop-blur-sm p-3">
          <Bookmark
            className={`w-6 h-6 transition-colors ${saved ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </div>
        <span className="text-xs font-body text-foreground/80">
          {saved ? "Saved" : "Save"}
        </span>
      </button>

      <button className="flex flex-col items-center gap-1">
        <div className="rounded-full bg-secondary/60 backdrop-blur-sm p-3">
          <MessageCircle className="w-6 h-6 text-foreground" />
        </div>
        <span className="text-xs font-body text-foreground/80">Inquire</span>
      </button>

      <button className="flex flex-col items-center gap-1">
        <div className="rounded-full bg-secondary/60 backdrop-blur-sm p-3">
          <Share2 className="w-6 h-6 text-foreground" />
        </div>
        <span className="text-xs font-body text-foreground/80">Share</span>
      </button>

      <div className="flex flex-col items-center gap-1 mt-1">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-body text-muted-foreground">{property.views}</span>
      </div>
    </div>
  );
};

export default ActionButtons;
