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
  facebook: "https://www.facebook.com/profile.php?id=61595466806658",
  instagram: "",                      // add your Instagram link here, e.g. https://instagram.com/yourhandle
  currency: "Rs.",
  // Delivery fee in rupees. Set to null to show "Confirmed on WhatsApp".
  deliveryFee: null,
  freeDeliveryNote: "Cash on delivery all over Pakistan",
};

/* Products ---------------------------------------------------------
   Each colour of the dungaree set is its own listing so customers can
   browse by colour. "group" ties them together on the product page.
   bundle: buy `qty` pieces from the same group for `price` total.
   ------------------------------------------------------------------ */

const DUNGAREE_SIZES = ["6–12 months", "12–18 months", "18–24 months", "2–3 years"];

const DUNGAREE_DETAILS = {
  description:
    "A soft denim dungaree with a plush teddy on the bib, paired with a printed long-sleeve top. Easy snaps, a relaxed fit for crawling and toddling, and a look that's ready for photos, family visits and everyday play.",
  features: [
    "Two-piece set: printed top + denim dungaree",
    "Plush 3D teddy on the front bib",
    "Soft, breathable fabric that's gentle on baby skin",
    "Adjustable shoulder straps for a comfortable fit",
  ],
  care: [
    "Machine wash cold, inside out",
    "Wash with similar colours",
    "Do not bleach",
    "Dry in shade to keep colours bright",
  ],
};

window.PRODUCTS = [
  {
    id: "dungaree-peach",
    group: "baby-dungaree-set",
    name: "Baby Dungaree Set",
    color: "Peach / Pink",
    colorHex: "#F1B3A5",
    price: 999,
    compareAt: null,
    bundle: { qty: 2, price: 1900 },
    image: "images/dungaree-peach.webp",
    category: "Sets",
    badge: "Bestseller",
    sizes: DUNGAREE_SIZES,
    ...DUNGAREE_DETAILS,
  },
  {
    id: "dungaree-blue",
    group: "baby-dungaree-set",
    name: "Baby Dungaree Set",
    color: "Light Blue",
    colorHex: "#A7C8E8",
    price: 999,
    compareAt: null,
    bundle: { qty: 2, price: 1900 },
    image: "images/dungaree-blue.webp",
    category: "Sets",
    badge: null,
    sizes: DUNGAREE_SIZES,
    ...DUNGAREE_DETAILS,
  },
  {
    id: "dungaree-cream",
    group: "baby-dungaree-set",
    name: "Baby Dungaree Set",
    color: "Cream / Beige",
    colorHex: "#E9DCC6",
    price: 999,
    compareAt: null,
    bundle: { qty: 2, price: 1900 },
    image: "images/dungaree-cream.webp",
    category: "Sets",
    badge: null,
    sizes: DUNGAREE_SIZES,
    ...DUNGAREE_DETAILS,
  },
  {
    id: "dungaree-mint",
    group: "baby-dungaree-set",
    name: "Baby Dungaree Set",
    color: "Mint Green",
    colorHex: "#A6DBB8",
    price: 999,
    compareAt: null,
    bundle: { qty: 2, price: 1900 },
    image: "images/dungaree-mint.webp",
    category: "Sets",
    badge: "New",
    sizes: DUNGAREE_SIZES,
    ...DUNGAREE_DETAILS,
  },
];
