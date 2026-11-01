#!/usr/bin/env node
/*
  Builds one static, indexable page per product: <slug>.html
  Run from the repo root after changing products in assets/js/config.js:

      node tools/build_product_pages.js

  Each page is product.html with its own <title>, meta description,
  canonical URL, Open Graph tags, Product + Breadcrumb structured data and
  pre-rendered product content (so Google sees real content without JS).
  The normal product script still runs on top and makes the page interactive.
  It also rewrites the product URLs in sitemap.xml and the product.html?id=…
  redirects in _redirects.
*/
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "https://tinimini-zone.netlify.app/";
const TODAY = new Date().toISOString().slice(0, 10);

// Load config.js the same way the browser does.
const window = {};
new Function("window", fs.readFileSync(path.join(ROOT, "assets/js/config.js"), "utf8"))(window);
const S = window.STORE;
const P = window.PRODUCTS;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `Rs. ${Number(n).toLocaleString("en-US")}`;

const template = fs.readFileSync(path.join(ROOT, "product.html"), "utf8");

function replaceOnce(html, re, value, label) {
  if (!re.test(html)) throw new Error(`product.html: could not find ${label}`);
  return html.replace(re, value);
}

function pageFor(p) {
  const url = BASE + p.slug + ".html";
  const sizes = p.sizes.join(", ");
  const deal = p.bundle ? ` | ${p.bundle.qty} for ${money(p.bundle.price)}` : "";
  const title = `${p.name} – ${p.color} | ${money(p.price)} | ${S.name}`;
  const desc =
    `${p.name} in ${p.color} for ${money(p.price)}${p.bundle ? ` (any ${p.bundle.qty} for ${money(p.bundle.price)})` : ""}. ` +
    `Sizes: ${sizes}. Cash on delivery all over Pakistan, order on WhatsApp ${S.phoneDisplay}.`;
  const images = [p.image, ...(p.images || [])].map((i) => BASE + i);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: `${p.name} – ${p.color}`,
        sku: p.id,
        url,
        image: images,
        description: p.description,
        color: p.color,
        size: sizes,
        category: p.category,
        brand: { "@type": "Brand", name: S.name },
        offers: {
          "@type": "Offer",
          url,
          price: String(p.price),
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: S.name },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Shop", item: BASE + "shop.html" },
          { "@type": "ListItem", position: 3, name: `${p.name} – ${p.color}`, item: url },
        ],
      },
    ],
  };

  // Plain content for crawlers; app.js replaces it with the full interactive view.
  const prerender = `
      <div class="gallery">
        <div class="gallery-main" id="gallery-main"><img src="${esc(p.image)}" alt="${esc(`${p.name} in ${p.color}`)}" loading="eager" width="800" height="1000"></div>
      </div>
      <div class="pdp-info">
        <h1>${esc(p.name)} – ${esc(p.color)}</h1>
        <div class="pdp-price"><span>${money(p.price)}</span>${p.bundle ? `<span class="deal">Any ${p.bundle.qty} for ${money(p.bundle.price)}</span>` : ""}</div>
        <p class="lede">${esc(p.description)}</p>
        <p><strong>Sizes:</strong> ${esc(sizes)}</p>
        <ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <p>Cash on delivery all over Pakistan. Order on WhatsApp ${esc(S.phoneDisplay)}.</p>
      </div>
    `;

  let html = template;
  html = replaceOnce(html, /\s*<meta name="robots"[^>]*>/, "", "robots meta");
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, "<title>");
  html = replaceOnce(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`, "meta description");
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`, "og:title");
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`, "og:description");
  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${url}">\n  <meta property="og:url" content="${url}">\n  <meta property="og:type" content="product">`,
    "canonical"
  );
  html = replaceOnce(html, /<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${BASE + p.image}">`, "og:image");
  html = replaceOnce(
    html,
    /<\/head>/,
    `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`,
    "</head>"
  );
  html = replaceOnce(html, /<body data-page="product">/, `<body data-page="product" data-product-id="${esc(p.id)}">`, "<body>");
  html = replaceOnce(html, /(<li aria-current="page" id="crumb-name">)[^<]*(<\/li>)/, `$1${esc(`${p.name} · ${p.color}`)}$2`, "breadcrumb");
  html = replaceOnce(html, /<section class="wrap pdp" id="pdp"><\/section>/, `<section class="wrap pdp" id="pdp">${prerender}</section>`, "#pdp");
  return html;
}

// 1) Pages
for (const p of P) {
  if (!p.slug) throw new Error(`Product ${p.id} has no slug in config.js`);
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), pageFor(p));
}

// 2) Sitemap: drop old product.html?id= entries and any previous slug entries, add current ones
const smPath = path.join(ROOT, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8");
const slugSet = new Set(P.map((p) => p.slug));
sm = sm
  .split("\n")
  .filter((line) => {
    const m = line.match(/<loc>https:\/\/tinimini-zone\.netlify\.app\/([^<]*)<\/loc>/);
    if (!m) return true;
    if (m[1].startsWith("product.html")) return false;
    return !slugSet.has(m[1].replace(/\.html$/, ""));
  })
  .join("\n");
const entries = P.map((p) => `  <url><loc>${BASE}${p.slug}.html</loc><lastmod>${TODAY}</lastmod></url>`).join("\n");
sm = sm.replace("</urlset>", `${entries}\n</urlset>`);
fs.writeFileSync(smPath, sm);

// 3) Permanent redirects from the old URLs (Netlify query-parameter matching)
const rdPath = path.join(ROOT, "_redirects");
const MARK_START = "# --- product pages (generated by tools/build_product_pages.js) ---";
const MARK_END = "# --- end product pages ---";
let rd = fs.existsSync(rdPath) ? fs.readFileSync(rdPath, "utf8") : "";
rd = rd.replace(new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}\\n?`), "");
const rules = P.map((p) => `/product.html  id=${p.id}  /${p.slug}.html  301!`).join("\n");
rd = `${rd.trim() ? rd.trimEnd() + "\n\n" : ""}${MARK_START}\n${rules}\n${MARK_END}\n`;
fs.writeFileSync(rdPath, rd);

console.log(`Built ${P.length} product pages, updated sitemap.xml and _redirects.`);
