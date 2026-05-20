export const productDetailsById = {
  1: {
    details:
      "Our Core Cotton Tee is spun from breathable mid-weight cotton for all-day comfort. Designed with a relaxed street silhouette, dropped shoulders, and a soft hand-feel that improves after every wash.",
    material: "100% premium cotton",
    fit: "Relaxed fit",
    care: "Machine wash cold · Tumble dry low",
    features: [
      "Pre-shrunk fabric",
      "Reinforced neckline",
      "Minimal branding",
      "Ideal for layering",
    ],
  },
  2: {
    details:
      "A statement oversized tee with bold front graphic and heavyweight construction. Built for streetwear layering with extra length in the body and sleeve.",
    material: "Heavyweight cotton jersey",
    fit: "Oversized fit",
    care: "Wash inside out · Cold wash only",
    features: ["Graphic front print", "Dropped shoulder", "Thick collar rib", "Unisex sizing"],
  },
  3: {
    details:
      "Shadow Pullover delivers premium fleece warmth with a clean minimal exterior. Brushed interior, structured hood, and ribbed cuffs for a polished street look.",
    material: "Cotton-poly fleece blend",
    fit: "Relaxed / slightly oversized",
    care: "Cold wash · Do not bleach",
    features: ["Brushed inner fleece", "Kangaroo pocket", "Double-layer hood", "Rib hem & cuffs"],
  },
  4: {
    details:
      "Utility zip hoodie with matte hardware, panelled construction, and a modern street profile. Full zip for versatile styling across seasons.",
    material: "Tech fleece blend",
    fit: "Regular street fit",
    care: "Cold gentle cycle",
    features: ["Full front zip", "Utility chest pocket", "Structured panels", "Matte finish"],
  },
  5: {
    details:
      "Classic crew sweatshirt with elevated minimal styling. Soft loopback fleece interior and clean chest area for everyday rotation.",
    material: "Loopback cotton fleece",
    fit: "Classic crew fit",
    care: "Wash with similar colours",
    features: ["Crew neckline", "Soft interior", "Ribbed cuffs", "Minimal aesthetic"],
  },
  6: {
    details:
      "Neo Cargo bottoms combine utility pocketing with a tapered leg for a sharp street silhouette. Stretch waistband for comfort and movement.",
    material: "Cotton twill with stretch",
    fit: "Tapered cargo fit",
    care: "Cold wash · Iron low heat",
    features: ["Multi utility pockets", "Stretch waist", "Tapered ankle", "Durable stitching"],
  },
  7: {
    details:
      "Structured six-panel cap with curved brim and embroidered DripKart branding. Adjustable strap for a secure custom fit.",
    material: "Cotton twill crown",
    fit: "Adjustable strapback",
    care: "Spot clean only",
    features: ["Embroidered logo", "Curved brim", "Breathable panels", "Unisex"],
  },
  8: {
    details:
      "Urban Shield is a lightweight weather-resistant jacket with matte shell finish. Ideal for transitional weather and street layering.",
    material: "Poly shell with light insulation",
    fit: "Regular fit · room for layers",
    care: "Wipe clean · Professional wash recommended",
    features: ["Wind resistant", "Light insulation", "Zip pockets", "Matte finish"],
  },
  9: {
    details:
      "Street Runner features a cushioned EVA midsole, breathable upper, and durable outsole grip for all-day urban movement.",
    material: "Mesh & synthetic upper",
    fit: "True to size (UK sizing)",
    care: "Air dry · Avoid machine wash",
    features: ["Cushioned midsole", "Breathable upper", "Street grip outsole", "Padded collar"],
  },
  10: {
    details:
      "Tinted Urban Glasses offer UV400 protection with a lightweight metal frame and tinted lenses for a bold street accessory look.",
    material: "Metal frame · Polycarbonate lenses",
    fit: "Standard face width",
    care: "Microfiber cloth only",
    features: ["UV400 protection", "Lightweight frame", "Tinted lenses", "Includes soft pouch"],
  },
};

export function getProductDetails(product) {
  const extra = productDetailsById[product.id] || {};
  return {
    details: extra.details || product.description,
    material: extra.material || "Premium streetwear fabric",
    fit: extra.fit || "Standard fit",
    care: extra.care || "Follow care label instructions",
    features: extra.features || [
      "Premium quality",
      "Streetwear design",
      "Comfort focused",
      "DripKart assured",
    ],
  };
}
