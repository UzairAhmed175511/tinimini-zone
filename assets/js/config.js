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
  pinterest: "https://www.pinterest.com/08tiniminizone/",
  // Meta (Facebook/Instagram) Pixel ID from Events Manager, e.g. "123456789012345".
  // Leave empty to turn tracking off.
  metaPixelId: "3036047803407996",
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

const BABY_SIZES = ["Small (1 year)", "Medium (2 years)", "Large (3 years)"];
const DUNGAREE_SIZES = ["1–2 Years"]; // owner 24 Oct: denim dungaree sets come in 1–2 years only
const KIDS_SIZES = BABY_SIZES; // owner: S/M/L = 6 months–3 years for all products

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
  sizes: DUNGAREE_SIZES,
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
  sizes: DUNGAREE_SIZES,
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

const FLEECE_DUNGAREE_DEAL = { qty: 2, price: 2300, key: "fleece-dungaree", label: "fleece dungaree set" };
const TRACKSUIT_DEAL = { qty: 2, price: 2300, key: "tracksuit", label: "fleece tracksuit" };
const DENIM_VEST_DEAL = { qty: 2, price: 2500, key: "denim-vest", label: "denim vest set" };

const FLEECE_DUNGAREE = {
  group: "happy-bear-fleece-dungaree",
  name: "Happy Bear Fleece Dungaree Set",
  category: "Winter dungarees",
  price: 1199,
  compareAt: null,
  bundle: FLEECE_DUNGAREE_DEAL,
  sizes: BABY_SIZES,
  description:
    "A warm baby winter dungaree in soft fleece with a cute 3D bear face on the bib, paired with a bear-print fleece sweatshirt. Cosy for cold mornings, easy to put on, and adorable in every photo — for baby boys and baby girls, 6 months to 3 years.",
  features: [
    "Two-piece set: bear-print fleece sweatshirt + fleece dungaree",
    "Plush 3D bear face on the front bib",
    "Soft, warm fleece that's gentle on baby skin",
    "Unisex — baby boy and baby girl winter dress",
  ],
  care: ["Machine wash cold, inside out", "Wash with similar colours", "Do not bleach", "Dry in shade"],
};

const TRACKSUIT = {
  group: "kids-fleece-tracksuit",
  name: "Kids Fleece Tracksuit",
  category: "Fleece tracksuits",
  price: 1199,
  compareAt: null,
  bundle: TRACKSUIT_DEAL,
  sizes: KIDS_SIZES,
  description:
    "A cosy kids winter tracksuit: a soft fleece cartoon-print sweatshirt with a matching jogger trouser. Warm inside, comfy all day, with ribbed cuffs and an elastic waist — perfect for school runs, play and family outings.",
  features: [
    "Two-piece set: printed fleece sweatshirt + jogger trouser",
    "Soft brushed fleece inside for warmth",
    "Elastic waist and ribbed cuffs",
    "Jogger colours: Orange or Blue",
  ],
  care: ["Machine wash cold, inside out", "Wash darks separately", "Do not bleach", "Dry in shade"],
};

const DENIM_VEST = {
  group: "kids-denim-vest-set",
  name: "Kids Denim Vest Set",
  category: "Denim sets",
  price: 1299,
  compareAt: null,
  bundle: DENIM_VEST_DEAL,
  sizes: KIDS_SIZES,
  description:
    "A smart boys outfit: a full-sleeve shirt with a built-in denim vest look, paired with soft stretch denim jeans. Ready for birthdays, weddings, family visits and winter outings — stylish without being stiff.",
  features: [
    "Two-piece set: denim vest-look full-sleeve shirt + denim jeans",
    "Stretch denim for easy movement",
    "Party-ready look for boys",
    "Available in White and Black",
  ],
  care: ["Machine wash cold, inside out", "Wash denim separately", "Do not bleach", "Dry in shade"],
};

window.PRODUCTS = [
  { ...TEDDY, lastPiece: true, id: "dungaree-peach", color: "Peach / Pink", colorHex: "#F1B3A5", image: "images/dungaree-peach.webp", images: ["images/dungaree-peach-real.webp", "images/dungaree-peach-real-back.webp", "images/dungaree-peach-2.webp", "images/dungaree-peach-flat.webp"], video: "videos/teddy-dungaree-peach.mp4", videoPoster: "images/teddy-dungaree-peach-video.webp", badge: "Last Piece" },
  { ...TEDDY, id: "dungaree-blue", color: "Light Blue", colorHex: "#A7C8E8", image: "images/dungaree-blue.webp", images: ["images/dungaree-blue-flat.webp"], badge: null },
  { ...TEDDY, id: "dungaree-cream", color: "Cream / Beige", colorHex: "#E9DCC6", image: "images/dungaree-cream.webp", images: [], badge: null },
  { ...TEDDY, lastPiece: true, id: "dungaree-mint", color: "Mint Green", colorHex: "#A6DBB8", image: "images/dungaree-mint.webp", images: ["images/dungaree-mint-real.webp", "images/dungaree-mint-2.webp"], badge: "Last Piece" },
  { ...BEAR, lastPiece: true, id: "bear-dungaree", color: "Denim Blue", colorHex: "#6E8FB8", image: "images/bear-dungaree.webp", images: ["images/bear-dungaree-real.webp", "images/bear-dungaree-close.webp", "images/bear-dungaree-back.webp", "images/bear-dungaree-pair.webp"], badge: "Last Piece" },
  { ...HAPPY, id: "happy-set-light", color: "Light (Beige)", colorHex: "#C9A27E", image: "images/happy-set-light.webp", images: ["images/happy-set-light-side.webp", "images/happy-set-light-back.webp"], video: "videos/happy-set-light.mp4", videoPoster: "images/happy-set-light-video.webp", badge: "New Video" },
  { ...HAPPY, id: "happy-set-dark", color: "Dark (Brown)", colorHex: "#6B4330", image: "images/happy-set-dark.webp", images: ["images/happy-set-dark-side.webp", "images/happy-set-dark-back.webp"], video: "videos/happy-set-dark.mp4", videoPoster: "images/happy-set-dark-video.webp", badge: "New Video" },
  { ...SUIT, id: "winter-suit-olive", color: "Olive Green", colorHex: "#7D8B62", image: "images/winter-suit-olive.webp", images: ["images/winter-suit-olive-hood.webp", "images/winter-suit-olive-back.webp", "images/winter-suit-olive-sitting.webp"], badge: "Winter" },
  { ...SUIT, id: "winter-suit-beige", color: "Beige", colorHex: "#CDB79A", image: "images/winter-suit-beige.webp", images: ["images/winter-suit-beige-hood.webp", "images/winter-suit-beige-back.webp", "images/winter-suit-beige-sitting.webp"], badge: "Winter" },
  { ...FLEECE_DUNGAREE, id: "fleece-dungaree-blue", color: "Sky Blue", colorHex: "#9EC6E6", image: "images/fleece-dungaree-blue.webp", images: ["images/fleece-dungaree-blue-back.webp", "images/fleece-dungaree-blue-poster.webp"], video: "videos/fleece-dungaree-blue.mp4", videoPoster: "images/fleece-dungaree-blue-video.webp", badge: "New Video" },
  { ...FLEECE_DUNGAREE, id: "fleece-dungaree-beige", color: "Beige", colorHex: "#D8C3A5", image: "images/fleece-dungaree-beige.webp", images: ["images/fleece-dungaree-beige-back.webp", "images/fleece-dungaree-beige-poster.webp"], badge: "New" },
  { ...TRACKSUIT, id: "tracksuit-blue", color: "Blue Jogger", colorHex: "#3F6FB5", image: "images/fleece-tracksuit-blue.webp", images: ["images/fleece-tracksuit-sweatshirt.webp", "images/fleece-tracksuit-blue-jogger.webp", "images/fleece-tracksuit-blue-poster.webp"], video: "videos/fleece-tracksuit-handheld.mp4", videoPoster: "images/fleece-tracksuit-handheld-video.webp", badge: "New Video" },
  { ...TRACKSUIT, id: "tracksuit-orange", color: "Orange Jogger", colorHex: "#E9813A", image: "images/fleece-tracksuit-orange.webp", images: ["images/fleece-tracksuit-sweatshirt.webp", "images/fleece-tracksuit-orange-jogger.webp", "images/fleece-tracksuit-orange-poster.webp"], badge: "New" },
  { ...DENIM_VEST, id: "denim-vest-white", color: "White", colorHex: "#F2F2F2", image: "images/denim-vest-white-real.webp", images: ["images/denim-vest-jeans-real.webp", "images/denim-vest-poster.webp"], video: "videos/denim-vest-white.mp4", videoPoster: "images/denim-vest-white-video.webp", badge: "New Video" },
  { ...DENIM_VEST, id: "denim-vest-black", color: "Black", colorHex: "#222222", image: "images/denim-vest-black-real.webp", images: ["images/denim-vest-jeans-real.webp", "images/denim-vest-poster.webp"], video: "videos/denim-vest-black.mp4", videoPoster: "images/denim-vest-black-video.webp", badge: "New Video" },
];
