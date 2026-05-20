import { catalogImages } from "./catalogImages";
import {
  bottomsCatalog,
  capsCatalog,
  glassesCatalog,
  hoodieCatalog,
  jacketsCatalog,
  sneakersCatalog,
  sweatshirtCatalog,
  tshirtCatalog,
} from "./catalogData";

export const categories = [
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Bottoms",
  "Caps",
  "Jackets",
  "Sneakers",
  "Glasses",
];

function buildCategoryProducts(catalog, category, images, startId) {
  return catalog.map((item, index) => {
    const product = {
      id: startId + index,
      name: item.name,
      category,
      price: item.price,
      rating: item.rating,
      description: item.desc,
      image: images[index % images.length],
    };
    if (item.badge) product.badge = item.badge;
    return product;
  });
}

let nextId = 1;
const teeProducts = buildCategoryProducts(
  tshirtCatalog,
  "T-Shirts",
  catalogImages["T-Shirts"],
  nextId
);
nextId += teeProducts.length;

const hoodieProducts = buildCategoryProducts(
  hoodieCatalog,
  "Hoodies",
  catalogImages.Hoodies,
  nextId
);
nextId += hoodieProducts.length;

const sweatshirtProducts = buildCategoryProducts(
  sweatshirtCatalog,
  "Sweatshirts",
  catalogImages.Sweatshirts,
  nextId
);
nextId += sweatshirtProducts.length;

const bottomProducts = buildCategoryProducts(
  bottomsCatalog,
  "Bottoms",
  catalogImages.Bottoms,
  nextId
);
nextId += bottomProducts.length;

const capProducts = buildCategoryProducts(
  capsCatalog,
  "Caps",
  catalogImages.Caps,
  nextId
);
nextId += capProducts.length;

const jacketProducts = buildCategoryProducts(
  jacketsCatalog,
  "Jackets",
  catalogImages.Jackets,
  nextId
);
nextId += jacketProducts.length;

const sneakerProducts = buildCategoryProducts(
  sneakersCatalog,
  "Sneakers",
  catalogImages.Sneakers,
  nextId
);
nextId += sneakerProducts.length;

const glassesProducts = buildCategoryProducts(
  glassesCatalog,
  "Glasses",
  catalogImages.Glasses,
  nextId
);

export const products = [
  ...teeProducts,
  ...hoodieProducts,
  ...sweatshirtProducts,
  ...bottomProducts,
  ...capProducts,
  ...jacketProducts,
  ...sneakerProducts,
  ...glassesProducts,
];

export const productCounts = {
  "T-Shirts": teeProducts.length,
  Hoodies: hoodieProducts.length,
  Sweatshirts: sweatshirtProducts.length,
  Bottoms: bottomProducts.length,
  Caps: capProducts.length,
  Jackets: jacketProducts.length,
  Sneakers: sneakerProducts.length,
  Glasses: glassesProducts.length,
  total: products.length,
};

export const styleInspiration = [
  {
    quote: "Style is a way to say who you are without speaking.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "Minimal tones. Maximum confidence.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    quote: "Dress for the street you want to own.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const stats = [
  { value: "12K+", label: "Happy Shoppers" },
  { value: `${products.length}+`, label: "Curated Styles" },
  { value: "4.8", label: "Avg. Rating" },
  { value: "48h", label: "Fast Delivery" },
];

export const outfitSetTypes = [
  "All Sets",
  "Tracksuit",
  "Co-ord Set",
  "Layered Look",
  "Athleisure",
];

export const outfitSets = [
  {
    id: "set-1",
    name: "Urban Flex Tracksuit",
    type: "Tracksuit",
    vibe: "Athleisure · Day to night",
    price: 4499,
    originalPrice: 5298,
    rating: 4.9,
    badge: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Head-to-toe matching tracksuit built for comfort, movement, and clean street silhouettes.",
    pieces: [
      "Relaxed-fit track hoodie",
      "Tapered track pants with zip pockets",
      "Low-profile performance cap",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "set-2",
    name: "Shadow Core Co-ord",
    type: "Co-ord Set",
    vibe: "Minimal · Monochrome",
    price: 3899,
    originalPrice: 4598,
    rating: 4.8,
    badge: "NEW DROP",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Oversized hoodie and cargo bottom combo in matching tones — instant outfit, zero guesswork.",
    pieces: [
      "Oversized fleece hoodie",
      "Wide-leg cargo bottoms",
      "Essential cotton tee (layering)",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "set-3",
    name: "Street Runner Kit",
    type: "Athleisure",
    vibe: "Sport · Urban commute",
    price: 5999,
    originalPrice: 7197,
    rating: 4.9,
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Full athletic street kit: sneakers, joggers, tee, and windbreaker — ready for the city grind.",
    pieces: [
      "Cushioned street runner sneakers",
      "Tech-fabric joggers",
      "Breathable performance tee",
      "Lightweight windbreaker jacket",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "set-4",
    name: "Night Layer Statement",
    type: "Layered Look",
    vibe: "Evening · Layered",
    price: 5499,
    originalPrice: 6498,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elevated layered costume: jacket over sweatshirt with fitted bottoms and tinted frames.",
    pieces: [
      "Structured street jacket",
      "Boxy crew sweatshirt",
      "Slim tapered bottoms",
      "Tinted urban glasses",
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "set-5",
    name: "Campus Chill Tracksuit",
    type: "Tracksuit",
    vibe: "Casual · Campus",
    price: 3299,
    originalPrice: 3998,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
    description:
      "Soft fleece tracksuit set for everyday campus fits — hoodie, joggers, and logo cap included.",
    pieces: [
      "Classic crew sweatshirt",
      "Essential jogger pants",
      "Curved brim logo cap",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "set-6",
    name: "Desert Tone Co-ord",
    type: "Co-ord Set",
    vibe: "Earth tones · Relaxed",
    price: 4199,
    originalPrice: 4898,
    rating: 4.8,
    badge: "LIMITED",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Warm beige co-ord costume with matching top and bottom plus accessories for a full look.",
    pieces: [
      "Washed oversized tee",
      "Relaxed straight-fit bottoms",
      "Monochrome snapback cap",
    ],
    sizes: ["S", "M", "L"],
  },
];

export const perks = [
  { icon: "📦", title: "Free shipping", detail: "On outfit sets above ₹3,000" },
  { icon: "↩️", title: "Easy returns", detail: "7-day hassle-free exchange" },
  { icon: "✨", title: "Bundle savings", detail: "Up to 18% off full looks" },
];

export const testimonials = [
  {
    name: "Aanya R.",
    text: "Quality feels premium and the fit is exactly what I wanted. DripKart is my go-to now.",
    rating: 5,
  },
  {
    name: "Rohan K.",
    text: "Clean UI, fast checkout flow, and the sneaker drop was fire. Highly recommend.",
    rating: 5,
  },
];
