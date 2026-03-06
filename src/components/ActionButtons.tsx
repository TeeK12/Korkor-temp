import { Heart, Bookmark, Share2, MessageCircle, Info } from "lucide-react";
import { useState } from "react";
import type { Property } from "@/data/properties";

interface ActionButtonsProps {
  property: Property;
  onInfoTap: () => void;
}

const ActionButtons = ({ property, onInfoTap }: ActionButtonsProps) => {
  const [liked, setLiked] = useState(property.liked);
  const [saved, setSaved] = useState(property.saved);
  const [likeAnim, setLikeAnim] = useState(false);
  const [likeCount, setLikeCount] = useState(property.likes);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toString();
  };

  return (
    <div className="flex flex-col items-center gap-5" data-action>
      {/* Agent avatar */}
      <button className="flex flex-col items-center gap-1 mb-1">
        <div className="w-11 h-11 rounded-full bg-card border-2 border-primary flex items-center justify-center">
          <span className="font-display text-xs font-bold text-primary">
            {property.agent.avatar}
          </span>
        </div>
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center -mt-3">
          <span className="text-[10px] font-bold text-primary-foreground">+</span>
        </div>
      </button>

      {/* Like */}
      <button onClick={handleLike} className="flex flex-col items-center gap-0.5">
        <div className={`${likeAnim ? "heart-pulse" : ""}`}>
          <Heart
            className={`w-7 h-7 transition-colors drop-shadow-lg ${
              liked ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </div>
        <span className="text-[11px] font-body text-foreground/80">{formatCount(likeCount)}</span>
      </button>

      {/* Comments */}
      <button className="flex flex-col items-center gap-0.5">
        <MessageCircle className="w-7 h-7 text-foreground drop-shadow-lg" />
        <span className="text-[11px] font-body text-foreground/80">{formatCount(property.comments)}</span>
      </button>

      {/* Save */}
      <button onClick={() => setSaved(!saved)} className="flex flex-col items-center gap-0.5">
        <Bookmark
          className={`w-7 h-7 transition-colors drop-shadow-lg ${
            saved ? "fill-primary text-primary" : "text-foreground"
          }`}
        />
        <span className="text-[11px] font-body text-foreground/80">{saved ? "Saved" : "Save"}</span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center gap-0.5">
        <Share2 className="w-7 h-7 text-foreground drop-shadow-lg" />
        <span className="text-[11px] font-body text-foreground/80">Share</span>
      </button>

      {/* Info */}
      <button onClick={onInfoTap} className="flex flex-col items-center gap-0.5">
        <Info className="w-7 h-7 text-foreground drop-shadow-lg" />
        <span className="text-[11px] font-body text-foreground/80">Info</span>
      </button>
    </div>
  );
};

export default ActionButtons;
