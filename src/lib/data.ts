import { Product, Order } from './types';

export const PINCODE_DATABASE: Record<string, { city: string; state: string; days: number; cod: boolean }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2, cod: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2, cod: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 3, cod: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3, cod: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3, cod: true },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 3, cod: true },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 3, cod: true },
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 2, cod: true }
};

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "heva-1",
    "slug": "cotton-blend-rayon-kurti-1",
    "title": "Cotton blend rayon kurti – Rose Pink",
    "subtitle": "Kurti Suits • Cotton Blend Rayon",
    "price": 333,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend Rayon",
    "craft": "Printed",
    "origin": "India",
    "color": "Rose Pink",
    "colorHex": "#C98A94",
    "images": [
      "https://static.wixstatic.com/media/80e345_7ea8272062b64ccaa83b1adbc8bff6d4~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_377823489f504a9bb75f412d033fa361~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Cotton blend rayon kurti from Heva Elegance — comfortable, breathable cotton blend rayon styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend Rayon with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-2",
    "slug": "cotton-blend-rayon-kurti-2",
    "title": "Cotton blend rayon kurti – Olive Green",
    "subtitle": "Kurti Suits • Cotton Blend Rayon",
    "price": 333,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend Rayon",
    "craft": "Printed",
    "origin": "India",
    "color": "Olive Green",
    "colorHex": "#8A8B2C",
    "images": [
      "https://static.wixstatic.com/media/80e345_ab796e25c341405c848413ad951d787d~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_8f93049245b04821b29a4d0c8b4ef9c6~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Cotton blend rayon kurti from Heva Elegance — comfortable, breathable cotton blend rayon styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend Rayon with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-3",
    "slug": "cotton-blend-rayon-kurti-3",
    "title": "Cotton blend rayon kurti – Ash Grey",
    "subtitle": "Kurti Suits • Cotton Blend Rayon",
    "price": 333,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend Rayon",
    "craft": "Printed",
    "origin": "India",
    "color": "Ash Grey",
    "colorHex": "#8C8C86",
    "images": [
      "https://static.wixstatic.com/media/80e345_25519df340d64fe0b4693ea85a63d3a4~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_0944719ae3bc44e19e35b72fcf6dae0d~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Cotton blend rayon kurti from Heva Elegance — comfortable, breathable cotton blend rayon styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend Rayon with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-4",
    "slug": "cotton-blend-rayon-kurti-4",
    "title": "Cotton blend rayon kurti – Black",
    "subtitle": "Kurti Suits • Cotton Blend Rayon",
    "price": 333,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend Rayon",
    "craft": "Printed",
    "origin": "India",
    "color": "Black",
    "colorHex": "#222222",
    "images": [
      "https://static.wixstatic.com/media/80e345_8b18f8b54f344d45a5fe25b5899edaa1~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_ae04d5015a2e486b801ec3c7fe459334~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Cotton blend rayon kurti from Heva Elegance — comfortable, breathable cotton blend rayon styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend Rayon with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-5",
    "slug": "cotton-blend-rayon-kurti",
    "title": "Cotton blend rayon kurti – Indigo Blue",
    "subtitle": "Kurti Suits • Cotton Blend Rayon",
    "price": 333,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend Rayon",
    "craft": "Printed",
    "origin": "India",
    "color": "Indigo Blue",
    "colorHex": "#3E5F7E",
    "images": [
      "https://static.wixstatic.com/media/80e345_e4b3f106de594e7c86e95b378e1cb478~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_2c11f9cd30024bea90d795d002a84a6c~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Cotton blend rayon kurti from Heva Elegance — comfortable, breathable cotton blend rayon styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend Rayon with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-6",
    "slug": "cotton-kurta-set-with-pant-and-mul-cotton-dupatta",
    "title": "Cotton kurta set with pant and mul cotton dupatta",
    "subtitle": "Kurti Suits • Mul Cotton",
    "price": 1299,
    "compareAtPrice": 1799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Mul Cotton",
    "craft": "Printed",
    "origin": "India",
    "color": "Blue",
    "colorHex": "#2C4A7A",
    "images": [
      "https://static.wixstatic.com/media/80e345_403fd8c49cb54df0a8ddd34bf1e6bbe1~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_d21a61ba6f784995a6f8fe5ef01ba65a~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_cbc09071208942ee8006fc6bb3a6203c~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Cotton kurta set with pant and mul cotton dupatta from Heva Elegance — comfortable, breathable mul cotton styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Mul Cotton with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-7",
    "slug": "crepe-silk-saree-with-beautiful-mango-motifs-golden-zari-weaving",
    "title": "Crepe silk saree with beautiful mango motifs golden zari weaving",
    "subtitle": "Sarees • Crepe Silk",
    "price": 2199,
    "compareAtPrice": 2999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Blue",
    "colorHex": "#2C4A7A",
    "images": [
      "https://static.wixstatic.com/media/80e345_165f2910c6f244389a877090944cb551~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_f40e9cb087bb447d89014816289a8b34~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_b0b008923d94426080e4980e70f2d6e1~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_35a6bfed92dc49b5becd31e128f7c11f~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Crepe silk saree with beautiful mango motifs golden zari weaving from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-8",
    "slug": "designer-party-wear-saree-1",
    "title": "Designer party wear saree – Pista Cream",
    "subtitle": "Sarees • Cotton Blend",
    "price": 2499,
    "compareAtPrice": 3499,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Cotton Blend",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Pista Cream",
    "colorHex": "#E6E0B8",
    "images": [
      "https://static.wixstatic.com/media/80e345_63168a68459d44018a19814ac249869e~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_a70040283ead4cd99b56c0d83853f3c7~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_5d5b82aa39ae43cd8ecc8f0d3d7426a2~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Designer party wear saree from Heva Elegance — a graceful cotton blend drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Cotton Blend with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-9",
    "slug": "designer-party-wear-saree",
    "title": "Designer party wear saree – Ivory",
    "subtitle": "Sarees • Cotton Blend",
    "price": 2499,
    "compareAtPrice": 3599,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Cotton Blend",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Ivory",
    "colorHex": "#EDEAE2",
    "images": [
      "https://static.wixstatic.com/media/80e345_a7b4e88365ad4a2da69ee00d26ffa921~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_6b7537538e2d459d806735d5dc36fbe7~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_bd80f8caa5d74d69aa3c180e59c76580~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Designer party wear saree from Heva Elegance — a graceful cotton blend drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Cotton Blend with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-10",
    "slug": "digital-kalamkari-saree-with-banarasi-border",
    "title": "Digital kalamkari saree with Banarasi border",
    "subtitle": "Sarees • Banarasi Silk",
    "price": 1299,
    "compareAtPrice": 1699,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Banarasi Silk",
    "craft": "Digital Print",
    "origin": "India",
    "color": "Maroon",
    "colorHex": "#6E1F2B",
    "images": [
      "https://static.wixstatic.com/media/80e345_af837083b57b498db9c1810cb7ed8722~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_6737390b1446417a944221b798113480~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_8f0572240217424294bdfcdbc32c1546~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Soft crepe saree kalamkari digital prints with rich Banarasi border golden zari weaving",
    "craftsmanshipDetails": [
      "Banarasi Silk with digital print detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-11",
    "slug": "digital-semi-crape-silk-saree",
    "title": "Digital semi crepe silk saree",
    "subtitle": "Sarees • Crepe Silk",
    "price": 1299,
    "compareAtPrice": 1799,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Digital Print",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_822d4f91ea0d4d8da21b8a3644d21a58~mv2.webp/v1/fill/w_800,h_1067,al_c,q_85/file.webp",
      "https://static.wixstatic.com/media/80e345_bd98a46da3db48f8aac194b105159685~mv2.webp/v1/fill/w_800,h_1067,al_c,q_85/file.webp"
    ],
    "description": "Heva Elegance presents the Digital semi crape silk saree — an ode to timeless elegance. This saree seamlessly blends Semi crape silk, creating a masterpiece that celebrates both tradition and modern sophistication.",
    "craftsmanshipDetails": [
      "Drape yourself in luxury with its rich texture, natural sheen, and graceful fall, perfect for weddings, festive celebrations, or formal gatherings. Each piece showcases expert weaving, ensuring a soft, durable, and lustrous fabric that reflects enduring artistry and premium quality.",
      "Complement your look with traditional jewelry for a regal appeal or keep it minimal for a chic, modern twist — the Digital semi crape silk saree by Heva Elevnce adapts to every mood and occasion effortlessly.",
      "Fabric: Semi Crape Silk (Washable)\tDesign: Digital Border with Golden Zari Weaving\tWeaving Style: Traditional Brocade for a Royal Touch\tTexture: Lightweight, Soft, and Luxurious\tOccasion: Perfect for Bridal, Festive, Party, or Formal Wear\tIncludes: Unstitched Matching Blouse",
      "Elevate your ethnic wardrobe with Heva Elegnce — where heritage meets haute fashion."
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-12",
    "slug": "embroidery-kurta-bottle-green",
    "title": "Embroidery kurta bottle green",
    "subtitle": "Kurti Suits • Cotton Blend",
    "price": 399,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Green",
    "colorHex": "#2F6B3A",
    "images": [
      "https://static.wixstatic.com/media/80e345_1e29a1d5762d428c95965848c62dbf35~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_8395a58b2af94461acf4c90419051fc6~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Embroidery kurta bottle green from Heva Elegance — comfortable, breathable cotton blend styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "L",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-13",
    "slug": "embroidery-kurta-pastel-blue",
    "title": "Embroidery kurta pastel blue",
    "subtitle": "Kurti Suits • Cotton Blend",
    "price": 399,
    "compareAtPrice": 699,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Blue",
    "colorHex": "#2C4A7A",
    "images": [
      "https://static.wixstatic.com/media/80e345_da2b0de4cf374291896467987e5b6141~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_eedbcef8525247c1a46f062153229dd5~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Embroidery kurta pastel blue from Heva Elegance — comfortable, breathable cotton blend styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "L",
      "XL",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-14",
    "slug": "embroidery-kurta-rani-pink",
    "title": "Embroidery kurta Rani pink",
    "subtitle": "Kurti Suits • Cotton Blend",
    "price": 399,
    "compareAtPrice": 799,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Pink",
    "colorHex": "#D2477A",
    "images": [
      "https://static.wixstatic.com/media/80e345_b3428e3a73b2488a90093ab090f6cc6f~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_9d90173cdcf644d79d904c2a1750e99c~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Embroidery kurta Rani pink from Heva Elegance — comfortable, breathable cotton blend styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-15",
    "slug": "georgette-crepe-checks",
    "title": "Georgette crepe checks",
    "subtitle": "Sarees • Georgette Crepe",
    "price": 2199,
    "compareAtPrice": 2699,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Georgette Crepe",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Maroon",
    "colorHex": "#6E1F2B",
    "images": [
      "https://static.wixstatic.com/media/80e345_bf79e208e7644f9981a149ae703f7acd~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_56c64707c7a34bb5850c6dd78b19a273~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_78cfc9ac5ae14f209deaab212ad0dd4e~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_2bff9b2e09db48ef906554955e8b0212~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Beautiful Maroon with pista green border with golden zari , rich pallu with contrast butta blouse..",
    "craftsmanshipDetails": [
      "Georgette Crepe with zari weave detailing",
      "Curated by Heva Elegance",
      "Free shipping"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-16",
    "slug": "georgette-crêpe-checks",
    "title": "Georgette crêpe checks",
    "subtitle": "Sarees • Georgette Crepe",
    "price": 2199,
    "compareAtPrice": 2699,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Georgette Crepe",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Yellow",
    "colorHex": "#D9A21B",
    "images": [
      "https://static.wixstatic.com/media/80e345_50f28bf980524183aaff1cc592183624~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_1623ded53256463789f6269fe6d05dd9~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_986ba7e121cd491eb287758754667db8~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_7e17e6e8ca0845668ea0538040a15074~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Yellow with royal purple georgette crêpe checks, rich pallu with golden zari",
    "craftsmanshipDetails": [
      "Georgette Crepe with zari weave detailing",
      "Curated by Heva Elegance",
      "Free shipping"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-17",
    "slug": "habutai-banarasi-silk-saree",
    "title": "Habutai banarasi silk saree",
    "subtitle": "Sarees • Banarasi Silk",
    "price": 1399,
    "compareAtPrice": 2000,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Banarasi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Green",
    "colorHex": "#2F6B3A",
    "images": [
      "https://static.wixstatic.com/media/80e345_14dfea7e0ff34b06bdcb3d28cfe6dbd2~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_cf6f96983d09427e9e462f397b0b881f~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_d77ee70ed78b4e60a8f6993f1c9c214a~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Habutai banarasi silk saree from Heva Elegance — a graceful banarasi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Banarasi Silk with zari weave detailing",
      "Curated by Heva Elegance",
      "100% free shipping",
      "UPI, Debit/Credit Cards, Net Bnaking"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-18",
    "slug": "hevask0001-pure-cotton-short-kurti",
    "title": "HEVASK0001 - Pure cotton short kurti",
    "subtitle": "Kurti Suits • Cotton",
    "price": 449,
    "compareAtPrice": 899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton",
    "craft": "Printed",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_a6eac07cc80c45619515880da9cd1cae~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_42a0b528decd4e76b4f39336d7df12ed~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_bbb79b39902b47b99e0287a36d3be844~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_09dde258eafb4432a21c29a4aa6490e6~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_9e6704c186e045d990a08617622f9af1~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "HEVASK0001 - Pure cotton short kurti from Heva Elegance — comfortable, breathable cotton styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton with printed detailing",
      "Curated by Heva Elegance",
      "It’s pure 100% cotton original brand, very breathable and comfortable for summer."
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-19",
    "slug": "kanchi-semi-silk-saree",
    "title": "Kanchi semi silk saree",
    "subtitle": "Sarees • Semi Kanchi Silk",
    "price": 2000,
    "compareAtPrice": 4999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_859ad689316d4cb49c06f65f27d56cea~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_f02df286cea4488d86979117496ffb82~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_6f48a365d1d9494eaf25d205dec50d7e~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_40e18bcd20c04fa0a6f3416466154165~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Kanchi semi silk saree from Heva Elegance — a graceful semi kanchi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-20",
    "slug": "lavender-chanderi-silk-embroidered-anarkali-kurta-and-pan",
    "title": "Lavender Chanderi Silk Embroidered Anarkali Kurta and Pant",
    "subtitle": "Kurti Suits • Chanderi Silk",
    "price": 1299,
    "compareAtPrice": 1899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Chanderi Silk",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_db060c5246b345d49207b6108c613a19~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_6d7dc7e82b6a48659158e43c5b1a7ee6~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_715d7cd025ce4666b49a02af1b8ffd0e~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Lavender Chanderi Silk Embroidered Anarkali Kurta and Pant from Heva Elegance — comfortable, breathable chanderi silk styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Chanderi Silk with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL",
      "3XL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-21",
    "slug": "lime-green-and-black-soft-banarasi-saree-with-golden-zari-weav",
    "title": "Lime Green and Black Soft Banarasi Saree with Golden Zari Weave",
    "subtitle": "Sarees • Banarasi Silk",
    "price": 999,
    "compareAtPrice": 1599,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Banarasi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Yellow",
    "colorHex": "#D9A21B",
    "images": [
      "https://static.wixstatic.com/media/80e345_5e7cf32bee6d443ca65de306c586c607~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_06bb393e0bc04f9fac7ad148b07ee282~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_69c79c7ee36744a2b420182232b6bb06~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_f868f232e48c43a885d9bf9aff62157c~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Lime Green and Black Soft Banarasi Saree with Golden Zari Weavee",
    "craftsmanshipDetails": [
      "🌸 Fabric: Soft Banarasi Semi-Silk — slightly textured with a tissue-like sheen, elegant and easy to drape.",
      "🪡 Design Details:",
      "Vibrant lime green body adorned with subtle woven motifs.",
      "Contrasting rich black border and grand pallu with intricate golden zari detailing.",
      "Traditional Banarasi craftsmanship featuring floral and geometric zari designs that add a luxurious festive glow.",
      "🎉 Perfect For: Weddings, festive celebrations, and traditional occasions."
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-22",
    "slug": "marshmallow-3d-washable-crape-saree-1",
    "title": "Marshmallow 3d washable crepe saree – Magenta & Sky Blue",
    "subtitle": "Sarees • Crepe Silk",
    "price": 799,
    "compareAtPrice": 1199,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Magenta & Sky Blue",
    "colorHex": "#8E1F5C",
    "images": [
      "https://static.wixstatic.com/media/80e345_4f59c64c3b034d888663e01291088f73~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_7f9bc0e684e2474b93996d5b4e322aba~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Marshmallow 3d washable crepe saree from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-23",
    "slug": "marshmallow-3d-washable-crape-saree-2",
    "title": "Marshmallow 3d washable crepe saree – Sky Blue & Wine",
    "subtitle": "Sarees • Crepe Silk",
    "price": 799,
    "compareAtPrice": 1199,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Sky Blue & Wine",
    "colorHex": "#2E9AD6",
    "images": [
      "https://static.wixstatic.com/media/80e345_28f85a9cae6a4cd1b3b19762999ddf38~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_9cf57ad6f6894fe1ad4eaa348af567ac~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Marshmallow 3d washable crepe saree from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-24",
    "slug": "marshmallow-3d-washable-crape-saree",
    "title": "Marshmallow 3d washable crepe saree – Mustard & Teal",
    "subtitle": "Sarees • Crepe Silk",
    "price": 799,
    "compareAtPrice": 1199,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Mustard & Teal",
    "colorHex": "#E0B32A",
    "images": [
      "https://static.wixstatic.com/media/80e345_eb88a62481a747d78e06a37428263f2f~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_3671d5c51c8c430784779c45c439e926~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Marshmallow 3d washable crepe saree from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-25",
    "slug": "pearl-hand-embroidery-kurta-with-white-pant-and-dupatta",
    "title": "Pearl hand embroidery kurta with white pant and dupatta",
    "subtitle": "Kurti Suits • Cotton Blend",
    "price": 1299,
    "compareAtPrice": 1899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Pink",
    "colorHex": "#D2477A",
    "images": [
      "https://static.wixstatic.com/media/80e345_80e5465cd68347f389390ea66b40e278~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_d293b765f6b240f5a404390bea0ecc7a~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_a3e9234055974167be3c9af92e97c48a~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Pearl hand embroidery kurta with white pant and dupatta from Heva Elegance — comfortable, breathable cotton blend styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "L",
      "XL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-26",
    "slug": "primium-viscose-crepe",
    "title": "Premium viscose crepe",
    "subtitle": "Sarees • Viscose",
    "price": 1499,
    "compareAtPrice": 1999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Viscose",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Pink",
    "colorHex": "#D2477A",
    "images": [
      "https://static.wixstatic.com/media/80e345_72c61f568ab840cfb3961060500276a0~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_b758db39b53948bc8e24660308c81da1~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_09f3c5ae32634e8487e66438e044e6b0~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Premium Viscose Crepe — soft, lightweight, and gracefully draping.",
    "craftsmanshipDetails": [
      "🪡 Design Details:",
      "Rich zari weaving with intricate floral patterns on the pallu and border.",
      "Adorned with elegant golden elephant motifs on the body for a traditional touch.",
      "The contrast of vibrant pink and gold gives a regal and festive look.",
      "🎉 Perfect For: Weddings, festive occasions, and grand celebrations."
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-27",
    "slug": "pure-mix-kanchivaram-silk-saree-1",
    "title": "Pure mix kanchivaram silk saree – Red & Maroon",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 2650,
    "compareAtPrice": 4299,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Red & Maroon",
    "colorHex": "#C8202A",
    "images": [
      "https://static.wixstatic.com/media/80e345_fe5ae9d659f24175b211a5fadf0d57ab~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_93c72aa941fe4c3cb8763ae154e82e9d~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_7d0362b549a343f9858c18571ec2594b~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_69bf11ef64e743a0b3bef890401777c2~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Pure mix kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-28",
    "slug": "pure-mix-kanchivaram-silk-saree",
    "title": "Pure mix kanchivaram silk saree – Red & Baby Pink",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 2650,
    "compareAtPrice": 4299,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Red & Baby Pink",
    "colorHex": "#D8232E",
    "images": [
      "https://static.wixstatic.com/media/80e345_46e35a1437784b73a47a084c568c9883~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_ab5e4ced91284e97bf72a944e1f43532~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_45068c5005a8464f8f36b025373c3f67~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_8f555dc0e14a4e7486191cfccdf6e303~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Pure mix kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-29",
    "slug": "pure-mull-cotton-katdana-embroidery-kurti-set",
    "title": "Pure mull cotton katdana embroidery kurti set",
    "subtitle": "Kurti Suits • Mul Cotton",
    "price": 1250,
    "compareAtPrice": 1899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Mul Cotton",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_9d6b922d0626485b84ce6205f4ae4373~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_0a10f08e8ab14a77bf3ab3784e82f14a~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_7e36626b6d814c2f8d601ff31164f689~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Pure mull cotton katdana embroidery kurti set from Heva Elegance — comfortable, breathable mul cotton styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Mul Cotton with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-30",
    "slug": "pure-mull-cotton-kurti-set-1",
    "title": "Pure mull cotton kurti set – Olive Green",
    "subtitle": "Kurti Suits • Mul Cotton",
    "price": 1250,
    "compareAtPrice": 1999,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Mul Cotton",
    "craft": "Printed",
    "origin": "India",
    "color": "Olive Green",
    "colorHex": "#8A8A2A",
    "images": [
      "https://static.wixstatic.com/media/80e345_1077f3c7412f4a00854169a3416b64cc~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_00abf96a655e4876a3f13422d62fa2e9~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_e02d7a25c183419cba1e0ab16ff09a8f~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Pure mull cotton kurti set from Heva Elegance — comfortable, breathable mul cotton styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Mul Cotton with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-31",
    "slug": "pure-mull-cotton-kurti-set",
    "title": "Pure mull cotton kurti set – Wine",
    "subtitle": "Kurti Suits • Mul Cotton",
    "price": 1250,
    "compareAtPrice": 1899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Mul Cotton",
    "craft": "Printed",
    "origin": "India",
    "color": "Wine",
    "colorHex": "#6B2433",
    "images": [
      "https://static.wixstatic.com/media/80e345_96a9a5b054bc4f6d95ea4e2f17565dc5~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_15b2b0f6a8b54cd790099b227130bdff~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_55fff40aa9dd4d42b3477901991955a7~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_b89fe9ff997b40968353bda2c5f450ed~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Pure mull cotton kurti set from Heva Elegance — comfortable, breathable mul cotton styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Mul Cotton with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-32",
    "slug": "semi-crepe-silk-saree-1",
    "title": "Semi crepe silk saree – Royal Blue",
    "subtitle": "Sarees • Crepe Silk",
    "price": 999,
    "compareAtPrice": 1299,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Royal Blue",
    "colorHex": "#1530C8",
    "images": [
      "https://static.wixstatic.com/media/80e345_4e9bcb10f74a4ff494a84f4f738947c5~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_9c4f57b7dcc549a890f2cc1703a3082c~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi crepe silk saree from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-33",
    "slug": "semi-crepe-silk-saree-2",
    "title": "Semi crepe silk saree – Red",
    "subtitle": "Sarees • Crepe Silk",
    "price": 999,
    "compareAtPrice": 1299,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Red",
    "colorHex": "#E0182E",
    "images": [
      "https://static.wixstatic.com/media/80e345_b3a371f83e6e4dc49f2958ecf3e45cb2~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_a3ed5367851a46269a491e8342c2509e~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi crepe silk saree from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-34",
    "slug": "semi-crepe-silk-saree-black",
    "title": "Semi crepe silk saree black",
    "subtitle": "Sarees • Crepe Silk",
    "price": 999,
    "compareAtPrice": 1499,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Black",
    "colorHex": "#1C1C1C",
    "images": [
      "https://static.wixstatic.com/media/80e345_4abdfaf63d8f499da0b8b588911eff82~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_99f241b9d91344e8a3b4a2f69c31e69e~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_cde2b83144a441069a7b3cf0278fc412~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Semi crepe silk saree black from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance",
      "Free shipping"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-35",
    "slug": "semi-crepe-silk-saree-checks",
    "title": "Semi crepe silk saree checks",
    "subtitle": "Sarees • Crepe Silk",
    "price": 1199,
    "compareAtPrice": 1699,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Multicolour",
    "colorHex": "#B08D57",
    "images": [
      "https://static.wixstatic.com/media/80e345_9fe3a4b8f70544b5950a2b592907fe99~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_ca8478e4f5b847f1bdf07afd536a899b~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_8b9a8fa092c6429aa1f2d965598c2133~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_602ff52a940941c692bf96fe9cfc0516~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Semi crepe silk saree checks from Heva Elegance — a graceful crepe silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Crepe Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-36",
    "slug": "semi-crepe-silk-saree",
    "title": "Semi crepe silk saree – Orange & Violet",
    "subtitle": "Sarees • Crepe Silk",
    "price": 1699,
    "compareAtPrice": 1999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Crepe Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Orange & Violet",
    "colorHex": "#E8501E",
    "images": [
      "https://static.wixstatic.com/media/80e345_2449e70f10e544ea8ade5f0575fb3b67~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_aed86ba0c9e848c7b9c56deed9973936~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_407c9b3f610a4bab9522d80aa93878cc~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_7b714638d60d46e9ae87da73d7d0700b~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "This purple and orange crepe silk saree with gold zari stripes and a bold contrast border is the perfect pick for festive grace and timeless charm. 💜🧡",
    "craftsmanshipDetails": [
      "Details:",
      "Fabric: Crepe Silk",
      "Colors: Royal Purple & Bright Orange",
      "Border: gold Zari with traditional detailing",
      "Pallu: Contrast zari-striped finish",
      "Feel: Smooth, lightweight & elegant"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-37",
    "slug": "semi-kanchi-silk-saree-1",
    "title": "Semi kanchi silk saree – Mint Green & Pink",
    "subtitle": "Sarees • Semi Kanchi Silk",
    "price": 2000,
    "compareAtPrice": 4999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Mint Green & Pink",
    "colorHex": "#8FBFA4",
    "images": [
      "https://static.wixstatic.com/media/80e345_015b3ed65cb042309faa691fe8f3dd55~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_50a03cc8237f426392dba43e8cf568e2~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_417bfd82ed01434fba593798c0598fd9~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_a02eeeea68094b68b73e7ecd8cde9801~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Semi kanchi silk saree from Heva Elegance — a graceful semi kanchi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-38",
    "slug": "semi-kanchi-silk-saree-2",
    "title": "Semi kanchi silk saree – Silver & Lavender",
    "subtitle": "Sarees • Semi Kanchi Silk",
    "price": 2000,
    "compareAtPrice": 4999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Silver & Lavender",
    "colorHex": "#C9C3CF",
    "images": [
      "https://static.wixstatic.com/media/80e345_69e99bf180934f809786f97049d454b5~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_3fe47d3ec33d48bba14a9145360629f5~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_d2e25c781d8a41a1a9e43ab409a89937~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_ff2dc718fa30402c9a9b5c654a25880c~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Semi kanchi silk saree from Heva Elegance — a graceful semi kanchi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-39",
    "slug": "semi-kanchi-silk-saree",
    "title": "Semi kanchi silk saree – Peach & Purple",
    "subtitle": "Sarees • Semi Kanchi Silk",
    "price": 2000,
    "compareAtPrice": 4999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Peach & Purple",
    "colorHex": "#E3B2A0",
    "images": [
      "https://static.wixstatic.com/media/80e345_0d9b0934c84a4e6aaf4a98a9e7115f9f~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_6b6e901239904bb78b45ebb36894db2b~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Semi kanchi silk saree from Heva Elegance — a graceful semi kanchi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-40",
    "slug": "semi-kanchivaram-silk-saree-1",
    "title": "Semi kanchivaram silk saree – Red & Gold",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 1999,
    "compareAtPrice": 2599,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Red & Gold",
    "colorHex": "#B82130",
    "images": [
      "https://static.wixstatic.com/media/80e345_c9d7a2ad90b14c49845b5ffc6336ab08~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_14300c608a5d4d959d21690ba40fac3b~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_f3f9e88c6e034f8dba8f8995fe129787~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_d4a26290711144449ef153b7af54b90e~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-41",
    "slug": "semi-kanchivaram-silk-saree-2",
    "title": "Semi kanchivaram silk saree – Onion Pink",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 1999,
    "compareAtPrice": 2599,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Onion Pink",
    "colorHex": "#9C5A6A",
    "images": [
      "https://static.wixstatic.com/media/80e345_13ca9a80a13b468d875927909650266c~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_9e39fb11ed544a5f879dfbef4e0f4409~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_15202a16ca7d420d9cab2de2eecc46e2~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_6e2707c6b0fa45458cc8b7d9dfc1474a~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-42",
    "slug": "semi-kanchivaram-silk-saree-3",
    "title": "Semi kanchivaram silk saree – Royal Blue & Lavender",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 2350,
    "compareAtPrice": 2999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Royal Blue & Lavender",
    "colorHex": "#3A2FC0",
    "images": [
      "https://static.wixstatic.com/media/80e345_c2afa7e29a2c49638f7075cf1dfdc05e~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_fd052cc6eb134da382cacaae1accc47d~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_94e1c8430c964f1ab775c83d109b8213~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_0a61302e5be449a9bb355082c7872b58~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_5b36ed04d93f48f6a325b96d06278b26~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-43",
    "slug": "semi-kanchivaram-silk-saree-4",
    "title": "Semi kanchivaram silk saree – Purple & Silver",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 2350,
    "compareAtPrice": 2999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Purple & Silver",
    "colorHex": "#5B2B8A",
    "images": [
      "https://static.wixstatic.com/media/80e345_dd28a2ef48eb43e0871f33309ed3493f~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_d5ba18160359470cad9a5069db96e812~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_7a56dfba04874a88b0e437783c0e6cfc~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_9ba525900e6941e48fae65fa7d6da00f~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-44",
    "slug": "semi-kanchivaram-silk-saree-5",
    "title": "Semi kanchivaram silk saree – Purple & Pista",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 2350,
    "compareAtPrice": 2900,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Purple & Pista",
    "colorHex": "#5A2A9A",
    "images": [
      "https://static.wixstatic.com/media/80e345_35cc0d29a50f4350824d64ac6ad5e178~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_87a8ecf4319f40b7aaf517b783a3a27c~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_0a5ac54ef65d44bb8fcdd1bb07667a66~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg",
      "https://static.wixstatic.com/media/80e345_146ffecb909549f4b3c295c13489c8f8~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-45",
    "slug": "semi-kanchivaram-silk-saree",
    "title": "Semi kanchivaram silk saree – Black & Magenta",
    "subtitle": "Sarees • Semi Kanchivaram Silk",
    "price": 799,
    "compareAtPrice": 1499,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Kanchivaram Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Black & Magenta",
    "colorHex": "#222222",
    "images": [
      "https://static.wixstatic.com/media/80e345_fe5bb9b7e381407f918d1efc05e16488~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_9a552559ef144b4aa7330f3d904157ff~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_92b57cd9522846178c0c51fc0b3220da~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi kanchivaram silk saree from Heva Elegance — a graceful semi kanchivaram silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Kanchivaram Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-46",
    "slug": "semi-silk-saree-1",
    "title": "Semi silk saree – Silver Grey",
    "subtitle": "Sarees • Semi Silk",
    "price": 799,
    "compareAtPrice": 1199,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Silver Grey",
    "colorHex": "#D3D2D6",
    "images": [
      "https://static.wixstatic.com/media/80e345_56f49a21c7574a14b5471775aad32830~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_694033652d3d48779ae06b4cd97d15f6~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi silk saree from Heva Elegance — a graceful semi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-47",
    "slug": "semi-silk-saree-2",
    "title": "Semi silk saree – Baby Pink",
    "subtitle": "Sarees • Semi Silk",
    "price": 799,
    "compareAtPrice": 1199,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Baby Pink",
    "colorHex": "#F1BFD0",
    "images": [
      "https://static.wixstatic.com/media/80e345_9bb1689765ab49b4b0696899208c53a6~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_bd80481b6e4b40f791421a5eb4f699d9~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi silk saree from Heva Elegance — a graceful semi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-48",
    "slug": "semi-silk-saree",
    "title": "Semi silk saree – Purple",
    "subtitle": "Sarees • Semi Silk",
    "price": 2999,
    "compareAtPrice": 3499,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Semi Silk",
    "craft": "Zari Weave",
    "origin": "India",
    "color": "Purple",
    "colorHex": "#4B2470",
    "images": [
      "https://static.wixstatic.com/media/80e345_060b3422c2be49fdb32d44397c9199c2~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_0128136fa3c2477cb0e1f4c473b2d688~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_33082a490919478d99943fd0407c8bd5~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Semi silk saree from Heva Elegance — a graceful semi silk drape finished with zari weave detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Semi Silk with zari weave detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-49",
    "slug": "tussar-silk-saree-embroidered",
    "title": "Tussar silk saree embroidered",
    "subtitle": "Sarees • Tussar Silk",
    "price": 1399,
    "compareAtPrice": 1999,
    "category": "sarees",
    "categoryLabel": "Sarees",
    "fabric": "Tussar Silk",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Black",
    "colorHex": "#1C1C1C",
    "images": [
      "https://static.wixstatic.com/media/80e345_81b042d84db14f36bff345480e1b8e7b~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_07a4a9d7887f44219d1032c4532120d4~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_f75ec419fbb047a794aa073ba872a48d~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_24b703476a7b4e588b12dffccfcb4e68~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Tussar silk saree embroidered from Heva Elegance — a graceful tussar silk drape finished with hand embroidery detailing, made for festive celebrations and timeless occasions.",
    "craftsmanshipDetails": [
      "Tussar Silk with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Dry clean recommended",
      "Store folded in a muslin cloth",
      "Iron on low heat on the reverse side"
    ],
    "sizes": [
      "Free Size"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": true,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-50",
    "slug": "viscose-rayon-2-piece-kurti-set-1",
    "title": "Viscose rayon 2 piece kurti set – Brown",
    "subtitle": "Kurti Suits • Viscose",
    "price": 599,
    "compareAtPrice": 1299,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Viscose",
    "craft": "Printed",
    "origin": "India",
    "color": "Brown",
    "colorHex": "#5A4033",
    "images": [
      "https://static.wixstatic.com/media/80e345_1fb2ac2683a14faba10b0bc896bc70a4~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_95eeeac31f884376a0faf663d35d2172~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Viscose rayon 2 piece kurti set from Heva Elegance — comfortable, breathable viscose styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Viscose with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-51",
    "slug": "viscose-rayon-2-piece-kurti-set-2",
    "title": "Viscose rayon 2 piece kurti set – Ivory",
    "subtitle": "Kurti Suits • Viscose",
    "price": 599,
    "compareAtPrice": 1299,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Viscose",
    "craft": "Printed",
    "origin": "India",
    "color": "Ivory",
    "colorHex": "#EFEAE0",
    "images": [
      "https://static.wixstatic.com/media/80e345_970b13a5d6ce437d83a6e2fd3dd1bec4~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png",
      "https://static.wixstatic.com/media/80e345_be04bbccd2854e83b459589d23869a9f~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Viscose rayon 2 piece kurti set from Heva Elegance — comfortable, breathable viscose styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Viscose with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": true,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-52",
    "slug": "viscose-rayon-2-piece-kurti-set",
    "title": "Viscose rayon 2 piece kurti set – Plum",
    "subtitle": "Kurti Suits • Viscose",
    "price": 599,
    "compareAtPrice": 1299,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Viscose",
    "craft": "Printed",
    "origin": "India",
    "color": "Plum",
    "colorHex": "#5E2B4F",
    "images": [
      "https://static.wixstatic.com/media/80e345_a42cb8cdccb94d6b8b9ca2a042886ea3~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_61d78eddeead4963ab7a6e362e837ead~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg"
    ],
    "description": "Viscose rayon 2 piece kurti set from Heva Elegance — comfortable, breathable viscose styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Viscose with printed detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": false,
    "stockCount": 0,
    "isBestseller": false,
    "isNewArrival": false,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  },
  {
    "id": "heva-53",
    "slug": "women-kurta-set-with-pant-digital-printed-dupatta-hand-embroidery",
    "title": "Hand-embroidered kurta set with pant and digital printed dupatta",
    "subtitle": "Kurti Suits • Cotton Blend",
    "price": 1299,
    "compareAtPrice": 1899,
    "category": "kurti-suits",
    "categoryLabel": "Kurti Suits",
    "fabric": "Cotton Blend",
    "craft": "Hand Embroidery",
    "origin": "India",
    "color": "Green",
    "colorHex": "#2F6B3A",
    "images": [
      "https://static.wixstatic.com/media/80e345_bf2d87a686b44940b741cdf6f0b2c81c~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_d48c550313444c37ada8126cf97fbb57~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_e0c8b4841b964735b9972e9ad3a9e7e9~mv2.jpg/v1/fill/w_800,h_1067,al_c,q_85/file.jpg",
      "https://static.wixstatic.com/media/80e345_66c4ad3f88f343deb94ef94138c8d541~mv2.png/v1/fill/w_800,h_1067,al_c,q_85/file.png"
    ],
    "description": "Hand-embroidered kurta set with pant and digital printed dupatta from Heva Elegance — comfortable, breathable cotton blend styled for everyday ease and festive grace.",
    "craftsmanshipDetails": [
      "Cotton Blend with hand embroidery detailing",
      "Curated by Heva Elegance"
    ],
    "washCare": [
      "Hand wash cold separately with mild detergent",
      "Dry in shade",
      "Warm iron on reverse side"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockCount": 10,
    "isBestseller": false,
    "isNewArrival": true,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0
  }
];
