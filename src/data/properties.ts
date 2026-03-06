export interface Hotspot {
  x: number; // percentage from left
  y: number; // percentage from top
  label: string;
  brand: string;
  description: string;
}

export interface PropertyMedia {
  type: "image" | "video";
  url: string; // gradient placeholder
  alt: string;
  hotspots?: Hotspot[];
}

export interface PropertySpace {
  name: string;
  media: PropertyMedia[];
}

export interface Property {
  id: string;
  media: PropertyMedia[];
  spaces: PropertySpace[];
  title: string;
  location: string;
  area: string;
  price: string;
  priceNumeric: number;
  listingType: "buy" | "rent";
  beds: number;
  baths: number;
  sqft: string;
  floor: string;
  buildingName: string;
  developer: string;
  serviceCharge: string;
  reraPermit: string;
  type: string;
  amenities: string[];
  agent: {
    name: string;
    handle: string;
    avatar: string;
    brokerage: string;
  };
  description: string;
  liked: boolean;
  saved: boolean;
  likes: number;
  comments: number;
  views: string;
}

// Gradient placeholders instead of stock photos
const gradients = {
  dusk: "linear-gradient(135deg, hsl(30, 15%, 12%) 0%, hsl(35, 20%, 18%) 40%, hsl(25, 12%, 8%) 100%)",
  golden: "linear-gradient(160deg, hsl(38, 25%, 15%) 0%, hsl(40, 35%, 22%) 50%, hsl(30, 15%, 10%) 100%)",
  midnight: "linear-gradient(145deg, hsl(220, 15%, 10%) 0%, hsl(30, 10%, 15%) 50%, hsl(240, 8%, 8%) 100%)",
  sand: "linear-gradient(170deg, hsl(35, 18%, 20%) 0%, hsl(30, 12%, 14%) 50%, hsl(25, 8%, 8%) 100%)",
  warm: "linear-gradient(135deg, hsl(25, 20%, 14%) 0%, hsl(35, 25%, 20%) 60%, hsl(20, 10%, 8%) 100%)",
  ocean: "linear-gradient(155deg, hsl(200, 15%, 12%) 0%, hsl(190, 10%, 18%) 50%, hsl(210, 12%, 8%) 100%)",
};

export const properties: Property[] = [
  {
    id: "1",
    media: [
      { type: "image", url: gradients.golden, alt: "Exterior view of penthouse tower", hotspots: [
        { x: 30, y: 60, label: "Marble Facade", brand: "Italian Calacatta", description: "Hand-selected Calacatta marble cladding" },
        { x: 70, y: 40, label: "Smart Glass", brand: "SageGlass", description: "Electrochromic glass that adjusts tint automatically" },
      ]},
      { type: "image", url: gradients.dusk, alt: "Living room with panoramic views", hotspots: [
        { x: 25, y: 70, label: "Sectional Sofa", brand: "Minotti", description: "Freeman Duvet modular system in cashmere blend" },
        { x: 65, y: 50, label: "Chandelier", brand: "Flos", description: "IC S2 brass suspension light" },
        { x: 50, y: 85, label: "Coffee Table", brand: "Cattelan Italia", description: "Skorpio round table in brushed bronze" },
      ]},
      { type: "image", url: gradients.warm, alt: "Kitchen with island", hotspots: [
        { x: 40, y: 60, label: "Kitchen Island", brand: "Boffi", description: "K14 island in dark oak with integrated induction" },
        { x: 75, y: 45, label: "Fridge", brand: "Gaggenau", description: "Vario 400 series fully integrated" },
      ]},
      { type: "image", url: gradients.midnight, alt: "Master bedroom suite" },
      { type: "image", url: gradients.ocean, alt: "Infinity pool terrace" },
    ],
    spaces: [
      { name: "Living Room", media: [
        { type: "image", url: gradients.dusk, alt: "Living room", hotspots: [
          { x: 25, y: 70, label: "Sectional Sofa", brand: "Minotti", description: "Freeman Duvet modular system" },
          { x: 65, y: 50, label: "Chandelier", brand: "Flos", description: "IC S2 brass suspension" },
        ]},
      ]},
      { name: "Kitchen", media: [
        { type: "image", url: gradients.warm, alt: "Kitchen", hotspots: [
          { x: 40, y: 60, label: "Kitchen Island", brand: "Boffi", description: "K14 island in dark oak" },
        ]},
      ]},
      { name: "Master Bedroom", media: [
        { type: "image", url: gradients.midnight, alt: "Master bedroom" },
      ]},
      { name: "Bathroom", media: [
        { type: "image", url: gradients.sand, alt: "Master bathroom" },
      ]},
      { name: "Terrace", media: [
        { type: "image", url: gradients.ocean, alt: "Terrace with pool" },
      ]},
    ],
    title: "The Residences at Dorchester Collection",
    location: "Palm Jumeirah, Dubai",
    area: "Palm Jumeirah",
    price: "AED 45,000,000",
    priceNumeric: 45000000,
    listingType: "buy",
    beds: 5,
    baths: 7,
    sqft: "12,500",
    floor: "42nd Floor",
    buildingName: "Dorchester Collection Tower",
    developer: "Omniyat",
    serviceCharge: "AED 45/sqft",
    reraPermit: "DXB-R-4521",
    type: "Penthouse",
    amenities: ["Private Pool", "Cinema Room", "Wine Cellar", "Smart Home", "Private Elevator", "Concierge", "Valet Parking", "Gym", "Spa"],
    agent: {
      name: "Khalid Al Mansoori",
      handle: "@khalid.luxury",
      avatar: "KA",
      brokerage: "Knight Frank UAE",
    },
    description: "An ultra-exclusive sky residence crowning the Dorchester Collection tower. Bespoke interiors by Gilles & Boissier with unobstructed views of the Arabian Gulf.",
    liked: false,
    saved: false,
    likes: 2841,
    comments: 156,
    views: "45.2K",
  },
  {
    id: "2",
    media: [
      { type: "image", url: gradients.midnight, alt: "DIFC tower exterior at night", hotspots: [
        { x: 50, y: 30, label: "LED Facade", brand: "Zumtobel", description: "Programmable architectural LED system" },
      ]},
      { type: "image", url: gradients.golden, alt: "Open plan living and dining", hotspots: [
        { x: 35, y: 65, label: "Dining Table", brand: "Poliform", description: "Concorde table in Emperador marble" },
        { x: 70, y: 55, label: "Pendant Light", brand: "Tom Dixon", description: "Melt Gold pendant cluster" },
      ]},
      { type: "image", url: gradients.sand, alt: "Bedroom with city views" },
      { type: "image", url: gradients.warm, alt: "Bathroom with freestanding tub" },
    ],
    spaces: [
      { name: "Living & Dining", media: [
        { type: "image", url: gradients.golden, alt: "Living dining", hotspots: [
          { x: 35, y: 65, label: "Dining Table", brand: "Poliform", description: "Concorde in Emperador marble" },
        ]},
      ]},
      { name: "Master Bedroom", media: [
        { type: "image", url: gradients.sand, alt: "Master bedroom" },
      ]},
      { name: "Bathroom", media: [
        { type: "image", url: gradients.warm, alt: "Bathroom" },
      ]},
      { name: "Study", media: [
        { type: "image", url: gradients.midnight, alt: "Study room" },
      ]},
    ],
    title: "One Za'abeel Residences",
    location: "DIFC, Dubai",
    area: "DIFC",
    price: "AED 18,500,000",
    priceNumeric: 18500000,
    listingType: "buy",
    beds: 3,
    baths: 4,
    sqft: "5,200",
    floor: "55th Floor",
    buildingName: "One Za'abeel",
    developer: "Ithra Dubai",
    serviceCharge: "AED 38/sqft",
    reraPermit: "DXB-R-7823",
    type: "Apartment",
    amenities: ["Sky Pool", "Observatory", "Concierge", "Smart Home", "Gym", "Residents Lounge", "Valet"],
    agent: {
      name: "Layla Hassan",
      handle: "@layla.estates",
      avatar: "LH",
      brokerage: "Luxhabitat",
    },
    description: "Elevated living in Dubai's most iconic architectural masterpiece. Floor-to-ceiling windows frame the Burj Khalifa and Downtown skyline.",
    liked: false,
    saved: false,
    likes: 4210,
    comments: 289,
    views: "68.1K",
  },
  {
    id: "3",
    media: [
      { type: "image", url: gradients.sand, alt: "Beachfront villa exterior", hotspots: [
        { x: 40, y: 75, label: "Travertine Paving", brand: "Salvatori", description: "Honed Roman travertine poolside" },
      ]},
      { type: "image", url: gradients.ocean, alt: "Beach club level", hotspots: [
        { x: 30, y: 50, label: "Daybed", brand: "Paola Lenti", description: "Float daybed in outdoor fabric" },
        { x: 65, y: 70, label: "Outdoor Kitchen", brand: "Officine Gullo", description: "Full outdoor kitchen in marine steel" },
      ]},
      { type: "image", url: gradients.golden, alt: "Interior majlis" },
      { type: "image", url: gradients.dusk, alt: "Garden courtyard" },
      { type: "image", url: gradients.warm, alt: "Private beach access" },
    ],
    spaces: [
      { name: "Majlis", media: [
        { type: "image", url: gradients.golden, alt: "Majlis" },
      ]},
      { name: "Beach Club", media: [
        { type: "image", url: gradients.ocean, alt: "Beach club" },
      ]},
      { name: "Garden", media: [
        { type: "image", url: gradients.dusk, alt: "Garden" },
      ]},
      { name: "Master Suite", media: [
        { type: "image", url: gradients.midnight, alt: "Master suite" },
      ]},
      { name: "Pool", media: [
        { type: "image", url: gradients.sand, alt: "Pool area" },
      ]},
    ],
    title: "Jumeirah Bay Island Villa",
    location: "Jumeirah Bay Island, Dubai",
    area: "Jumeirah Bay",
    price: "AED 120,000,000",
    priceNumeric: 120000000,
    listingType: "buy",
    beds: 7,
    baths: 9,
    sqft: "25,000",
    floor: "Ground + 2",
    buildingName: "Bvlgari Island Villa",
    developer: "Meraas",
    serviceCharge: "AED 55/sqft",
    reraPermit: "DXB-R-1156",
    type: "Villa",
    amenities: ["Private Beach", "Infinity Pool", "Staff Quarters", "Cinema", "Wine Room", "Hammam", "Helipad Access", "Marina Berth"],
    agent: {
      name: "Omar Farooq",
      handle: "@omar.bespoke",
      avatar: "OF",
      brokerage: "Betterhomes",
    },
    description: "The pinnacle of island living. A Bvlgari-designed waterfront estate with private beach, marina berth, and unparalleled exclusivity.",
    liked: false,
    saved: false,
    likes: 8923,
    comments: 512,
    views: "124K",
  },
  {
    id: "4",
    media: [
      { type: "image", url: gradients.warm, alt: "Marina apartment exterior" },
      { type: "image", url: gradients.dusk, alt: "Living area with marina views", hotspots: [
        { x: 45, y: 55, label: "Media Console", brand: "B&B Italia", description: "PAB modular system in dark oak" },
        { x: 20, y: 40, label: "Floor Lamp", brand: "Artemide", description: "Tolomeo Mega floor lamp" },
      ]},
      { type: "image", url: gradients.golden, alt: "Kitchen" },
    ],
    spaces: [
      { name: "Living Room", media: [
        { type: "image", url: gradients.dusk, alt: "Living room" },
      ]},
      { name: "Kitchen", media: [
        { type: "image", url: gradients.golden, alt: "Kitchen" },
      ]},
      { name: "Bedroom", media: [
        { type: "image", url: gradients.midnight, alt: "Bedroom" },
      ]},
      { name: "Balcony", media: [
        { type: "image", url: gradients.ocean, alt: "Balcony" },
      ]},
    ],
    title: "Marina Gate Tower III",
    location: "Dubai Marina, Dubai",
    area: "Dubai Marina",
    price: "AED 180,000/yr",
    priceNumeric: 180000,
    listingType: "rent",
    beds: 2,
    baths: 3,
    sqft: "1,800",
    floor: "28th Floor",
    buildingName: "Marina Gate III",
    developer: "Select Group",
    serviceCharge: "AED 18/sqft",
    reraPermit: "DXB-R-9934",
    type: "Apartment",
    amenities: ["Pool", "Gym", "Concierge", "Kids Play Area", "BBQ Area", "Sauna"],
    agent: {
      name: "Priya Mehta",
      handle: "@priya.homes",
      avatar: "PM",
      brokerage: "Allsopp & Allsopp",
    },
    description: "Sophisticated marina living with full yacht club views. Premium finishes throughout with wraparound balcony.",
    liked: false,
    saved: false,
    likes: 1456,
    comments: 87,
    views: "19.3K",
  },
];
