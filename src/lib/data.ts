import { Product, Order } from './types';

export const PINCODE_DATABASE: Record<string, { city: string; state: string; days: number }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', days: 2 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 2 },
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 3 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 3 },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 3 },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 3 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 3 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 2 }
};

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "price": 1299,
    "category": "rogg",
    "categoryLabel": "Rogg",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-1",
    "slug": "anti-nazar-jet-lighter",
    "title": "Anti Nazar Jet Lighter",
    "subtitle": "Matchbox Label Series • Jet Flame",
    "fabric": "Matte printed metal case, jet-flame insert",
    "craft": "Matchbox Label Print",
    "color": "Nazar Red & Black",
    "colorHex": "#D7322B",
    "images": [
      "/images/products/anti-nazar-jet-lighter-1.jpg",
      "/images/products/anti-nazar-jet-lighter-2.jpg",
      "/images/products/anti-nazar-jet-lighter-3.jpg"
    ],
    "description": "Remember the nimbu-mirchi on every shop door and the scary face painted on the back of every truck? The Anti Nazar lighter wears that \"double protection\" with pride: a wide-eyed blue face on a bold red label, framed like a matchbox you would have found at the corner kirana in the 90s.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with textured honeycomb side panels",
      "Windproof jet-flame insert with a flip-top lid",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": true,
    "isNewArrival": false
  },
  {
    "price": 1299,
    "category": "90s-nostalgia",
    "categoryLabel": "90's Nostalgia",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-2",
    "slug": "husn-ki-teeli-jet-lighter",
    "title": "Husn Ki Teeli Jet Lighter",
    "subtitle": "Matchbox Label Series • Jet Flame",
    "fabric": "Matte printed metal case, jet-flame insert",
    "craft": "Matchbox Label Print",
    "color": "Sunset Orange",
    "colorHex": "#F08A24",
    "images": [
      "/images/products/husn-ki-teeli-jet-lighter-1.jpg",
      "/images/products/husn-ki-teeli-jet-lighter-2.jpg",
      "/images/products/husn-ki-teeli-jet-lighter-3.jpg"
    ],
    "description": "Straight out of a filmy poster: glossy lips holding a matchstick, a burst of orange sunrays and \"Husn ki Teeli\" in bold Devanagari. A cheeky nod to the safety-match boxes that once sat on every 90s kitchen shelf, now with a jet flame that lights first time.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with textured honeycomb side panels",
      "Windproof jet-flame insert with a flip-top lid",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": true,
    "isNewArrival": true
  },
  {
    "price": 1299,
    "category": "rogg",
    "categoryLabel": "Rogg",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-3",
    "slug": "quality-eyes-jet-lighter",
    "title": "Quality Eyes Jet Lighter",
    "subtitle": "Matchbox Label Series • Jet Flame",
    "fabric": "Matte printed metal case, jet-flame insert",
    "craft": "Matchbox Label Print",
    "color": "Matchbox Yellow",
    "colorHex": "#F2C230",
    "images": [
      "/images/products/quality-eyes-jet-lighter-1.jpg",
      "/images/products/quality-eyes-jet-lighter-2.jpg",
      "/images/products/quality-eyes-jet-lighter-3.jpg"
    ],
    "description": "Two kohl-lined eyes, a \"50s price 0-15 ps.\" stamp and \"Special Quality Safety Match\" wrapped all the way around. This one is for anyone who used to collect matchbox labels and swap them at school, back when 15 paise felt like a fortune.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with textured honeycomb side panels",
      "Windproof jet-flame insert with a flip-top lid",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": false,
    "isNewArrival": true
  },
  {
    "price": 1299,
    "category": "rogg",
    "categoryLabel": "Rogg",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-4",
    "slug": "king-deluxe-jet-lighter",
    "title": "King Deluxe Jet Lighter",
    "subtitle": "Matchbox Label Series • Jet Flame",
    "fabric": "Matte printed metal case, jet-flame insert",
    "craft": "Matchbox Label Print",
    "color": "Royal Blue & Red",
    "colorHex": "#2BA7C9",
    "images": [
      "/images/products/king-deluxe-jet-lighter-1.jpg",
      "/images/products/king-deluxe-jet-lighter-2.jpg",
      "/images/products/king-deluxe-jet-lighter-3.jpg"
    ],
    "description": "A turbaned king with a curled moustache, \"Delux Quality Match\" in chunky letters and a printed price of 15 paise. The King Deluxe brings back the grand, hand-painted look of old South Indian matchbox art for a lighter that rules every table it sits on.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with textured honeycomb side panels",
      "Windproof jet-flame insert with a flip-top lid",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": true,
    "isNewArrival": false
  },
  {
    "price": 1299,
    "category": "rogg",
    "categoryLabel": "Rogg",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-5",
    "slug": "tiger-jet-lighter",
    "title": "Tiger Jet Lighter",
    "subtitle": "Matchbox Label Series • Jet Flame",
    "fabric": "Matte printed metal case, jet-flame insert",
    "craft": "Matchbox Label Print",
    "color": "Tiger Yellow",
    "colorHex": "#F2B630",
    "images": [
      "/images/products/tiger-jet-lighter-1.jpg",
      "/images/products/tiger-jet-lighter-2.jpg",
      "/images/products/tiger-jet-lighter-3.jpg"
    ],
    "description": "A roaring tiger leaping through swirling clouds under a red rising sun, styled like an old import-tea trade label. Bold, loud and a little wild, just like the stickers we used to slap on our school geometry boxes.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with textured honeycomb side panels",
      "Windproof jet-flame insert with a flip-top lid",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": false,
    "isNewArrival": true
  },
  {
    "price": 1299,
    "category": "rogg",
    "categoryLabel": "Rogg",
    "origin": "India",
    "sizes": [
      "One Size"
    ],
    "inStock": true,
    "stockCount": 25,
    "isHandwoven": false,
    "reviews": [],
    "rating": 0,
    "reviewCount": 0,
    "washCare": [
      "Refill only with the fuel recommended on the box",
      "Never leave a lit flame unattended; close the lid to put it out",
      "Keep away from heat, direct sunlight and flammable materials",
      "Keep out of reach of children. Sold only to adults aged 18+"
    ],
    "id": "ck-6",
    "slug": "kolhapuri-flip-top-lighter",
    "title": "Kolhapuri Flip-Top Lighter",
    "subtitle": "Matchbox Label Series • Flip-Top",
    "fabric": "Matte printed metal case, flip-top lid",
    "craft": "Matchbox Label Print",
    "color": "Rani Pink",
    "colorHex": "#E0338A",
    "images": [
      "/images/products/kolhapuri-flip-top-lighter-1.jpg",
      "/images/products/kolhapuri-flip-top-lighter-2.jpg"
    ],
    "description": "Rani pink, lotus borders and a hand-drawn Kolhapuri chappal at the centre, with \"Handcrafted with love\" and \"Made in India\" in proud bazaar lettering. It looks like the label on a wedding-season gift box from the 90s, and makes just as good a present.",
    "craftsmanshipDetails": [
      "Full-wrap print inspired by vintage Indian matchbox labels",
      "Matte metal case with printed side panels",
      "Classic flip-top lid with a metal hinge",
      "Arrives in a gift-ready box"
    ],
    "isBestseller": false,
    "isNewArrival": true
  }
];
