import { catalogImages } from "./catalogImages.js";
import {
  bottomsCatalog,
  capsCatalog,
  glassesCatalog,
  hoodieCatalog,
  jacketsCatalog,
  sneakersCatalog,
  sweatshirtCatalog,
  tshirtCatalog,
} from "./catalogData.js";

function buildCategoryProducts(catalog, category, images, startId) {
  return catalog.map((item, index) => {
    const product = {
      legacyId: startId + index,
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

export function buildAllProducts() {
  let nextId = 1;
  const chunks = [];

  const add = (catalog, category) => {
    const images = catalogImages[category];
    const batch = buildCategoryProducts(catalog, category, images, nextId);
    chunks.push(...batch);
    nextId += batch.length;
  };

  add(tshirtCatalog, "T-Shirts");
  add(hoodieCatalog, "Hoodies");
  add(sweatshirtCatalog, "Sweatshirts");
  add(bottomsCatalog, "Bottoms");
  add(capsCatalog, "Caps");
  add(jacketsCatalog, "Jackets");
  add(sneakersCatalog, "Sneakers");
  add(glassesCatalog, "Glasses");

  return chunks;
}
