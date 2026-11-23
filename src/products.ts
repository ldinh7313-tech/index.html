export type ProductCategory =
  | "Decorative models"
  | "Desk accessories"
  | "Home objects"
  | "Miniatures"
  | "Anime & character figures"
  | "Custom prints";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  availability: "In stock" | "Made to order";
  isNew?: boolean;
  isBestSeller?: boolean;
  dimensions: string;
  material: string;
  colors: string[];
  productionTime: string;
  shape: "vase" | "arch" | "lamp" | "planter" | "orb" | "sculpture";
  swatch: string;
};

export const categories: ProductCategory[] = [
  "Decorative models",
  "Desk accessories",
  "Home objects",
  "Miniatures",
  "Anime & character figures",
  "Custom prints",
];

export const products: Product[] = [
  {
    id: "arc-vessel",
    name: "Arc Vessel",
    category: "Home objects",
    price: 38,
    description: "A sculptural vessel with a softly ribbed silhouette, designed to bring a little rhythm to a shelf or side table.",
    availability: "In stock",
    isBestSeller: true,
    dimensions: "18 × 12 × 12 cm",
    material: "Matte PLA",
    colors: ["Chalk", "Stone", "Terracotta"],
    productionTime: "Ships in 2–3 days",
    shape: "vase",
    swatch: "sand",
  },
  {
    id: "orbit-desk-set",
    name: "Orbit Desk Set",
    category: "Desk accessories",
    price: 46,
    description: "A considered home for the little things: pen cup, catch-all tray, and a tidy cable guide.",
    availability: "Made to order",
    isNew: true,
    dimensions: "Set of 3 · 14 × 10 × 9 cm",
    material: "Recycled PLA",
    colors: ["Ink", "Olive", "Chalk"],
    productionTime: "Made in 4–6 days",
    shape: "orb",
    swatch: "green",
  },
  {
    id: "folded-light",
    name: "Folded Light",
    category: "Home objects",
    price: 72,
    description: "A warm ambient lamp with a folded shade that turns a simple form into a gentle play of light.",
    availability: "Made to order",
    isBestSeller: true,
    dimensions: "24 × 16 × 16 cm",
    material: "PETG · LED included",
    colors: ["Warm white", "Clay"],
    productionTime: "Made in 5–7 days",
    shape: "lamp",
    swatch: "lilac",
  },
  {
    id: "little-arch",
    name: "Little Arch",
    category: "Decorative models",
    price: 24,
    description: "A small architectural object with a big sense of calm. Lovely alone, even better in a pair.",
    availability: "In stock",
    isNew: true,
    dimensions: "14 × 9 × 4 cm",
    material: "Matte PLA",
    colors: ["Chalk", "Moss", "Apricot"],
    productionTime: "Ships in 2–3 days",
    shape: "arch",
    swatch: "peach",
  },
  {
    id: "ripple-planter",
    name: "Ripple Planter",
    category: "Home objects",
    price: 32,
    description: "A tactile, water-resistant planter with an integrated saucer and a softly undulating profile.",
    availability: "In stock",
    dimensions: "13 × 14 × 14 cm",
    material: "PETG",
    colors: ["Moss", "Sand", "Ink"],
    productionTime: "Ships in 2–3 days",
    shape: "planter",
    swatch: "blue",
  },
  {
    id: "pocket-planet",
    name: "Pocket Planet",
    category: "Miniatures",
    price: 18,
    description: "A palm-sized, topographic little world made to live on your desk, nightstand, or anywhere you need a moment.",
    availability: "Made to order",
    dimensions: "8 × 8 × 8 cm",
    material: "Matte PLA",
    colors: ["Stone", "Ocean", "Sun"],
    productionTime: "Made in 3–4 days",
    shape: "sculpture",
    swatch: "pink",
  },
  {
    id: "small-figure",
    name: "Small Things Figure",
    category: "Anime & character figures",
    price: 28,
    description: "A friendly little desk companion with a soft silhouette, made for collectors of small, good things.",
    availability: "Made to order",
    isNew: true,
    dimensions: "11 × 7 × 6 cm",
    material: "Matte PLA",
    colors: ["Chalk", "Apricot", "Moss"],
    productionTime: "Made in 3–5 days",
    shape: "sculpture",
    swatch: "peach",
  },
  {
    id: "custom-form",
    name: "Custom Form",
    category: "Custom prints",
    price: 58,
    description: "A made-to-order sculptural piece, finished in your choice of studio color. Reach out with your idea.",
    availability: "Made to order",
    dimensions: "Approx. 16 × 12 × 10 cm",
    material: "PLA · color selected at checkout",
    colors: ["Chalk", "Stone", "Olive"],
    productionTime: "Made in 7–10 days",
    shape: "sculpture",
    swatch: "sand",
  },
];
