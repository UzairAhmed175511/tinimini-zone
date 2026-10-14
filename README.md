# Tinimini ZONE — online store

Static e-commerce website for Tinimini ZONE (baby & kids clothing). No build step — upload to GitHub and deploy on Netlify.

## What's included

- Home, Shop (colour filter, sort, search), Product page (colour, size, quantity, size guide), Wishlist
- Cart drawer with automatic **2 for Rs. 1,900** bundle pricing
- Checkout with **cash on delivery**: the order is saved in Netlify (Forms tab) and opens WhatsApp with the full order message
- Contact form (Netlify Forms), About, Size guide, Delivery & exchange, Privacy, 404
- Floating WhatsApp button, mobile menu, SEO tags and product structured data

## Deploy

1. Create a new GitHub repository and upload everything in this folder (keep the folder structure).
2. On Netlify: **Add new site → Import an existing project → GitHub →** pick the repo.
3. Leave build command empty, publish directory `.` (already set in `netlify.toml`). Deploy.
4. In Netlify → **Forms**, enable form detection if asked, then redeploy once. Orders appear under the `order` form, messages under `contact`.
5. Optional: Netlify → Forms → Form notifications → add your email so every order is emailed to you.

## Edit your store

Everything you'll want to change is in **`assets/js/config.js`**:

- WhatsApp number, email, Facebook / Instagram links
- `deliveryFee` — set a number (e.g. `200`) to show delivery charges, or `null` to show "Confirmed on WhatsApp"
- Products: name, colour, price, bundle deal, sizes, description, image
- To add a new product, copy one product block, give it a new `id` and image

Size chart numbers are in `size-guide.html` and `product.html` — update them to match your actual sizes.

## Images

Put images in the `images/` folder with these names (WebP or change the paths in `config.js`):

| File | Used for |
| --- | --- |
| `logo.webp` | Logo, favicon |
| `dungaree-peach.webp`, `dungaree-blue.webp`, `dungaree-cream.webp`, `dungaree-mint.webp` | Product photos (portrait, about 4:5) |
| `lifestyle-boy.webp`, `lifestyle-girl.webp` | Home and About page photos |

Missing images show a soft teddy placeholder, so the site never looks broken.

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000 (forms only save on Netlify; WhatsApp ordering works everywhere).
