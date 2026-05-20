export const sizeCharts = {
  tops: {
    title: "Tops & Jackets Size Chart (inches)",
    headers: ["Size", "Chest", "Length", "Shoulder"],
    rows: [
      ["XS", "34–36", "26", "16"],
      ["S", "36–38", "27", "17"],
      ["M", "38–40", "28", "18"],
      ["L", "40–42", "29", "19"],
      ["XL", "42–44", "30", "20"],
      ["XXL", "44–46", "31", "21"],
    ],
  },
  bottoms: {
    title: "Bottoms Size Chart (inches)",
    headers: ["Size", "Waist", "Hip", "Inseam"],
    rows: [
      ["XS", "28–29", "34–35", "30"],
      ["S", "30–31", "36–37", "30"],
      ["M", "32–33", "38–39", "31"],
      ["L", "34–35", "40–41", "31"],
      ["XL", "36–37", "42–43", "32"],
      ["XXL", "38–39", "44–45", "32"],
    ],
  },
  footwear: {
    title: "Sneakers Size Chart (UK / US)",
    headers: ["UK", "US", "EU", "Foot (cm)"],
    rows: [
      ["6", "7", "39", "25"],
      ["7", "8", "40", "26"],
      ["8", "9", "41", "27"],
      ["9", "10", "42", "28"],
      ["10", "11", "43", "29"],
      ["11", "12", "44", "30"],
    ],
  },
  caps: {
    title: "Cap Size Chart",
    headers: ["Size", "Head Circumference"],
    rows: [
      ["S/M", "21.5–22.5 in"],
      ["L/XL", "22.5–24 in"],
      ["Adjustable", "Fits most"],
    ],
  },
  glasses: {
    title: "Glasses Fit Guide",
    headers: ["Frame", "Lens Width", "Bridge"],
    rows: [
      ["Standard", "52 mm", "18 mm"],
      ["Wide", "54 mm", "20 mm"],
    ],
  },
};

export const categorySizeChartMap = {
  "T-Shirts": "tops",
  Hoodies: "tops",
  Sweatshirts: "tops",
  Jackets: "tops",
  Bottoms: "bottoms",
  Sneakers: "footwear",
  Caps: "caps",
  Glasses: "glasses",
};

export function getSizesForCategory(category) {
  const map = {
    Sneakers: ["7", "8", "9", "10", "11"],
    Caps: ["S/M", "L/XL", "Adjustable"],
    Glasses: ["Standard", "Wide"],
  };
  return map[category] || ["XS", "S", "M", "L", "XL", "XXL"];
}
