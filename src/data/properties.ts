import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

export interface Property {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  type: string;
  agent: {
    name: string;
    handle: string;
  };
  description: string;
  liked: boolean;
  saved: boolean;
  views: string;
}

export const properties: Property[] = [
  {
    id: "1",
    image: property1,
    title: "Oceanview Modern Villa",
    location: "Malibu, California",
    price: "$4,250,000",
    beds: 5,
    baths: 4,
    sqft: "6,200",
    type: "Villa",
    agent: { name: "Sarah Chen", handle: "@sarahrealty" },
    description: "Stunning infinity pool villa perched on the cliffs with panoramic ocean views. Open-concept living with floor-to-ceiling glass.",
    liked: false,
    saved: false,
    views: "12.4K",
  },
  {
    id: "2",
    image: property2,
    title: "Manhattan Sky Penthouse",
    location: "New York City, NY",
    price: "$8,900,000",
    beds: 3,
    baths: 3,
    sqft: "4,800",
    type: "Penthouse",
    agent: { name: "James Miller", handle: "@jmproperties" },
    description: "Ultra-luxury penthouse with 360° city skyline views. Private elevator, smart home system, and rooftop terrace.",
    liked: false,
    saved: false,
    views: "28.1K",
  },
  {
    id: "3",
    image: property3,
    title: "Mediterranean Estate",
    location: "Beverly Hills, CA",
    price: "$12,500,000",
    beds: 7,
    baths: 8,
    sqft: "11,400",
    type: "Estate",
    agent: { name: "Victoria Rose", handle: "@vrose.estates" },
    description: "Grand Mediterranean mansion with lush gardens, wine cellar, home theater, and guest house on 2 acres.",
    liked: false,
    saved: false,
    views: "45.7K",
  },
  {
    id: "4",
    image: property4,
    title: "Tropical Beachfront Retreat",
    location: "Tulum, Mexico",
    price: "$2,100,000",
    beds: 4,
    baths: 3,
    sqft: "3,600",
    type: "Beach House",
    agent: { name: "Marco Reyes", handle: "@marcorealty" },
    description: "Private beachfront escape with natural wood finishes, plunge pool, and direct ocean access. Eco-luxury at its finest.",
    liked: false,
    saved: false,
    views: "8.9K",
  },
];
