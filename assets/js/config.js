/* ------------------------------------------------------------------
   Tinimini ZONE — store settings
   Edit this file to change contact details, delivery text and products.
   ------------------------------------------------------------------ */

window.STORE = {
  name: "Tinimini ZONE",
  tagline: "Baby & kids clothing",
  whatsapp: "923101310199",          // international format, no + or spaces
  phoneDisplay: "0310 1310199",
  email: "08tiniminizone@gmail.com",
  facebook: "https://www.facebook.com/tiniminizone",
  instagram: "https://www.instagram.com/08tiniminizone/",
  tiktok: "https://www.tiktok.com/@08tiniminizone",
  youtube: "https://www.youtube.com/@08tiniminizone",
  currency: "Rs.",
  // Delivery fee in rupees. Set to null to show "Confirmed on WhatsApp".
  deliveryFee: null,
  freeDeliveryNote: "Cash on delivery all over Pakistan",
};

/* Products ---------------------------------------------------------
   Each colour is its own listing so customers can browse by colour.
   group   : ties colours of the same style together on the product page
   bundle  : buy `qty` pieces sharing the same bundle `key` for `price`
   images  : extra gallery photos for that colour
   ------------------------------------------------------------------ */

const BABY_SIZES = ["Small (6–12 months)", "Medium (12–18 months)", "Large (18–24 months)"];
const KIDS_SIZES = ["Small", "Medium", "Large"];

const DUNGAREE_DEAL = { qty: 2, price: 1900, key: "dungaree", label: "dungaree set" };
const HAPPY_DEAL = { qty: 2, price: 2100, key: "happy-set", label: "2-piece set" };
const SUIT_DEAL = { qty: 2, price: 3000, key: "winter-suit", label: "winter suit" };

const TEDDY = {
  group: "teddy-dungaree",
  name: "Teddy Dungaree Set",
  category: "Dungaree sets",
  price: 999,
  compareAt: null,
  bundle: DUNGAREE_DEAL,
  sizes: BABY_SIZES,
  description:
    "A soft denim dungaree with a plush 3D teddy on the bib, paired with a printed long-sleeve top. Easy snaps, a relaxed fit for crawling and toddling, and a look that's ready for photos, family visits and everyday play.",
  features: [
    "Two-piece set: printed long-sleeve top + denim dungaree",
    "Plush 3D teddy on the front bib",
    "Soft, breathable fabric that's gentle on baby skin",
    "Adjustable shoulder straps for a comfortable fit",
  ],
  care: ["Machine wash cold, inside out", "Wash with similar colours", "Do not bleach", "Dry in shade to keep colours bright"],
};

const BEAR = {
  group: "bear-happy-dungaree",
  name: "Bear Happy Dungaree Set",
  category: "Dungaree sets",
  price: 999,
  compareAt: null,
  bundle: DUNGAREE_DEAL,
  sizes: BABY_SIZES,
  description:
    "Our cream teddy-print top with a classic blue denim dungaree. A fluffy bear on the bib, “Bear Happy” embroidery on the leg and roomy back pockets — comfy enough for all day, cute enough for every photo.",
  features: [
    "Two-piece set: teddy-print long-sleeve top + denim dungaree",
    "Fluffy bear bib with “Bear Happy” embroidery",
    "Soft, skin-friendly and breathable fabric",
    "Durable stitching, easy to wash",
  ],
  care: ["Machine wash cold, inside out", "Wash with similar colours", "Do not bleach", "Dry in shade"],
};

const HAPPY = {
  group: "happy-two-piece",
  name: "Happy Bear 2-Piece Set",
  category: "Two-piece sets",
  price: 1099,
  compareAt: null,
  bundle: HAPPY_DEAL,
  sizes: BABY_SIZES,
  description:
    "A cosy sweatshirt and jogger set with a “HAPPY” teddy print, contrast raglan sleeves and striped cuffs. Soft, warm and easy to move in — made for playtime, family visits and cooler days.",
  features: [
    "Two-piece set: printed sweatshirt + drawstring joggers",
    "“HAPPY” teddy print with striped ribbed cuffs and hem",
    "Soft, comfortable fabric with a relaxed fit",
    "Durable stitching for everyday wear",
  ],
  care: ["Machine wash cold, inside out", "Wash darks separately", "Do not bleach", "Dry in shade"],
};

const SUIT = {
  group: "boys-winter-suit",
  name: "Boys 3-Piece Winter Suit",
  category: "Winter suits",
  price: 1599,
  compareAt: null,
  bundle: SUIT_DEAL,
  sizes: KIDS_SIZES,
  description:
    "A warm three-piece winter set for little champions: a fleece-lined hooded jacket with dino patches, a printed inner shirt and cargo joggers. Soft inside, tough outside, and ready for cold mornings.",
  features: [
    "3 pieces: hooded jacket + inner shirt + lower trouser",
    "Soft fleece-lined hood and dino patch details",
    "Premium cotton-blend fabric",
    "Cargo pockets and ribbed cuffs",
  ],
  care: ["Machine wash cold, inside out", "Wash with similar colours", "Do not tumble dry", "Dry in shade"],
};

window.PRODUCTS = [
  { ...TEDDY, id: "dungaree-peach", color: "Peach / Pink", colorHex: "#F1B3A5", image: "images/dungaree-peach.webp", images: ["images/dungaree-peach-2.webp", "images/dungaree-peach-flat.webp"], badge: "Bestseller" },
  { ...TEDDY, id: "dungaree-blue", color: "Light Blue", colorHex: "#A7C8E8", image: "images/dungaree-blue.webp", images: ["images/dungaree-blue-flat.webp"], badge: null },
  { ...TEDDY, id: "dungaree-cream", color: "Cream / Beige", colorHex: "#E9DCC6", image: "images/dungaree-cream.webp", images: [], badge: null },
  { ...TEDDY, id: "dungaree-mint", color: "Mint Green", colorHex: "#A6DBB8", image: "images/dungaree-mint.webp", images: ["images/dungaree-mint-2.webp"], badge: null },
  { ...BEAR, id: "bear-dungaree", color: "Denim Blue", colorHex: "#6E8FB8", image: "images/bear-dungaree.webp", images: ["images/bear-dungaree-close.webp", "images/bear-dungaree-back.webp", "images/bear-dungaree-pair.webp"], badge: "New" },
  { ...HAPPY, id: "happy-set-light", color: "Light (Beige)", colorHex: "#C9A27E", image: "images/happy-set-light.webp", images: ["images/happy-set-light-side.webp", "images/happy-set-light-back.webp"], badge: "New" },
  { ...HAPPY, id: "happy-set-dark", color: "Dark (Brown)", colorHex: "#6B4330", image: "images/happy-set-dark.webp", images: ["images/happy-set-dark-side.webp", "images/happy-set-dark-back.webp"], badge: null },
  { ...SUIT, id: "winter-suit-olive", color: "Olive Green", colorHex: "#7D8B62", image: "images/winter-suit-olive.webp", images: ["images/winter-suit-olive-hood.webp", "images/winter-suit-olive-back.webp", "images/winter-suit-olive-sitting.webp"], badge: "Winter" },
  { ...SUIT, id: "winter-suit-beige", color: "Beige", colorHex: "#CDB79A", image: "images/winter-suit-beige.webp", images: ["images/winter-suit-beige-hood.webp", "images/winter-suit-beige-back.webp", "images/winter-suit-beige-sitting.webp"], badge: "Winter" },
];
