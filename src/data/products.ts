export const categories = ["Home objects", "Planters", "Desk companions", "Tiny treasures"] as const;
export type Category = (typeof categories)[number];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  popularity: number;
  badge?: string;
  available: boolean;
  description: string;
  colors: string[];
  shape: "vase" | "planter" | "organizer" | "orb" | "mushroom" | "twist" | "candle" | "tray";
  palette: string;
};

export const products: Product[] = [
  {
    id: "solstice-vase",
    name: "Solstice bud vase",
    category: "Home objects",
    price: 32,
    rating: 4.9,
    reviews: 28,
    popularity: 98,
    badge: "Bestseller",
    available: true,
    description: "A little vessel for one perfect stem. Printed slowly in a soft, plant-based matte finish, with gentle ridges that catch the afternoon light.",
    colors: ["Oat", "Moss", "Terracotta"],
    shape: "vase",
    palette: "rose",
  },
  {
    id: "moss-planter",
    name: "Moss mini planter",
    category: "Planters",
    price: 26,
    rating: 4.8,
    reviews: 19,
    popularity: 91,
    badge: "Small-batch",
    available: true,
    description: "A cozy home for your smallest leafy friend. Includes a fitted inner pot and a thoughtful drainage channel.",
    colors: ["Sage", "Chalk", "Ink"],
    shape: "planter",
    palette: "sage",
  },
  {
    id: "arc-organizer",
    name: "Arc desk organizer",
    category: "Desk companions",
    price: 38,
    rating: 5.0,
    reviews: 12,
    popularity: 86,
    available: true,
    description: "Make room for a clearer mind. A sculptural catch-all for pens, clips, and the little things you reach for every day.",
    colors: ["Sand", "Slate"],
    shape: "organizer",
    palette: "sand",
  },
  {
    id: "pocket-orb",
    name: "Pocket moon orb",
    category: "Tiny treasures",
    price: 18,
    rating: 4.9,
    reviews: 34,
    popularity: 95,
    badge: "A tiny favorite",
    available: true,
    description: "A palm-sized reminder to pause. Keep it on your desk, tuck it into a pocket, or gift it to someone who needs a little calm.",
    colors: ["Moonstone", "Moss", "Lilac"],
    shape: "orb",
    palette: "lavender",
  },
  {
    id: "daydream-mushroom",
    name: "Daydream mushroom",
    category: "Tiny treasures",
    price: 22,
    rating: 4.7,
    reviews: 16,
    popularity: 74,
    available: true,
    description: "A tiny, friendly forest dweller. Each one is printed and finished by hand, so every little cap has its own character.",
    colors: ["Rust", "Butter", "Moss"],
    shape: "mushroom",
    palette: "butter",
  },
  {
    id: "soft-serve-vase",
    name: "Soft serve bud vase",
    category: "Home objects",
    price: 34,
    rating: 4.9,
    reviews: 21,
    popularity: 88,
    badge: "Just made",
    available: true,
    description: "A twist of color and a place for a single flower. The playful spiral is made one layer at a time in our little studio.",
    colors: ["Peach", "Oat", "Lilac"],
    shape: "twist",
    palette: "peach",
  },
  {
    id: "slow-morning-holder",
    name: "Slow morning candle cup",
    category: "Home objects",
    price: 24,
    rating: 4.8,
    reviews: 9,
    popularity: 62,
    available: false,
    description: "A warm little home for your favorite tea light. Designed with a softly rippled silhouette to make slow evenings feel special.",
    colors: ["Oat", "Terracotta"],
    shape: "candle",
    palette: "clay",
  },
  {
    id: "tideline-tray",
    name: "Tideline catchall tray",
    category: "Desk companions",
    price: 29,
    rating: 4.9,
    reviews: 14,
    popularity: 81,
    available: true,
    description: "A shallow, ripple-edged landing spot for rings, keys, or the treasures you bring home from a walk.",
    colors: ["Sea glass", "Chalk", "Oat"],
    shape: "tray",
    palette: "blue",
  },
];
