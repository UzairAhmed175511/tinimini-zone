/* Tinimini ZONE — storefront logic (no build step, no dependencies) */
(function () {
  "use strict";

  const S = window.STORE;
  const P = window.PRODUCTS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- helpers ---------- */

  const money = (n) => `${S.currency} ${Math.round(n).toLocaleString("en-PK")}`;
  const byId = (id) => P.find((p) => p.id === id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (text) => `https://wa.me/${S.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  /* ---------- Meta Pixel (Facebook + Instagram ads) ---------- */
  (function initPixel() {
    const id = (S.metaPixelId || "").trim();
    if (!/^\d{6,20}$/.test(id) || window.fbq) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", id);
    window.fbq("track", "PageView");
  })();
  const track = (event, params, opts) => {
    try {
      if (window.fbq) window.fbq("track", event, params || {}, opts || {});
    } catch (e) {
      /* tracking must never break the shop */
    }
  };

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage unavailable — cart lives for this page only */
      }
    },
  };

  const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#f4eee4"/><g fill="#c9d3bd"><circle cx="160" cy="190" r="34"/><circle cx="240" cy="190" r="34"/><circle cx="200" cy="250" r="78"/></g><g fill="#fffdf8"><circle cx="175" cy="240" r="9"/><circle cx="225" cy="240" r="9"/><ellipse cx="200" cy="275" rx="22" ry="16"/></g></svg>`
    );
  window.__imgFallback = (img) => {
    img.onerror = null;
    img.src = PLACEHOLDER;
  };
  const img = (src, alt, extra = "") =>
    `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="__imgFallback(this)" ${extra}>`;

  /* ---------- icons ---------- */

  const I = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
    cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></svg>',
    cotton: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-6"/><path d="M8.5 13.5a3.5 3.5 0 1 1 1.4-6.7 3.5 3.5 0 0 1 4.2 0 3.5 3.5 0 1 1 1.4 6.7 3.5 3.5 0 0 1-7 0z"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z"/></svg>',
  };
  window.TZ_ICONS = I;

  /* ---------- cart & pricing ---------- */

  let cart = store.get("tz_cart", []);
  let wish = store.get("tz_wish", []);

  const saveCart = () => {
    store.set("tz_cart", cart);
    renderCartCount();
    renderDrawer();
  };

  function priceCart(lines) {
    const groups = {};
    let subtotal = 0;
    lines.forEach((l) => {
      const p = byId(l.id);
      if (!p) return;
      subtotal += p.price * l.qty;
      const key = (p.bundle && p.bundle.key) || p.group || p.id;
      groups[key] = groups[key] || { qty: 0, product: p };
      groups[key].qty += l.qty;
    });
    let total = 0;
    let nudge = null;
    Object.values(groups).forEach(({ qty, product: p }) => {
      if (p.bundle && p.bundle.qty > 1) {
        const sets = Math.floor(qty / p.bundle.qty);
        const rest = qty % p.bundle.qty;
        total += sets * p.bundle.price + rest * p.price;
        if (rest > 0 && !nudge) {
          const need = p.bundle.qty - rest;
          const saving = p.bundle.qty * p.price - p.bundle.price;
          nudge = `Add ${need} more ${(p.bundle.label || p.name).toLowerCase()} and save ${money(saving)}.`;
        }
      } else {
        total += qty * p.price;
      }
    });
    const delivery = S.deliveryFee == null ? null : lines.length ? S.deliveryFee : 0;
    return {
      subtotal,
      saving: subtotal - total,
      total,
      delivery,
      grand: total + (delivery || 0),
      count: lines.reduce((a, l) => a + l.qty, 0),
      nudge,
    };
  }

  function addToCart(id, size, qty = 1) {
    const line = cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty = Math.min(line.qty + qty, 20);
    else cart.push({ id, size, qty });
    saveCart();
    const p = byId(id);
    if (p) track("AddToCart", { content_ids: [p.id], content_name: `${p.name} - ${p.color}`, content_type: "product", value: p.price * qty, currency: "PKR" });
  }

  function setQty(index, qty) {
    if (!cart[index]) return;
    if (qty <= 0) cart.splice(index, 1);
    else cart[index].qty = Math.min(qty, 20);
    saveCart();
  }

  /* ---------- layout: header, footer, drawer ---------- */

  const NAV = [
    ["index.html", "Home"],
    ["shop.html", "Shop"],
    ["size-guide.html", "Size guide"],
    ["about.html", "Our story"],
    ["contact.html", "Contact"],
  ];

  function currentPage() {
    const f = location.pathname.split("/").pop() || "index.html";
    return f.includes(".") ? f : `${f}.html`;
  }

  function renderLayout() {
    const here = currentPage();
    const header = $("#site-header");
    if (header) {
      header.outerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="offer-bar"><strong>Buy 2, save more: dungaree sets 2 for ${money(1900)}</strong> &nbsp;·&nbsp; ${esc(S.freeDeliveryNote)}</div>
      <header class="site-header">
        <div class="wrap header-inner">
          <a class="brand" href="index.html" aria-label="${esc(S.name)} home">
            ${img("images/logo.webp", "", 'width="52" height="52"')}
            <span class="brand-name">${esc(S.name)}<small>${esc(S.tagline)}</small></span>
          </a>
          <nav class="main-nav" id="main-nav" aria-label="Main">
            <ul>${NAV.map(
              ([href, label]) => `<li><a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a></li>`
            ).join("")}</ul>
          </nav>
          <div class="header-actions">
            <button class="icon-btn" type="button" id="search-toggle" aria-expanded="false" aria-controls="search-panel">${I.search}<span class="sr-only">Search</span></button>
            <a class="icon-btn hide-sm" href="wishlist.html">${I.heart}<span class="sr-only">Wishlist</span><span class="count-badge" id="wish-count" hidden></span></a>
            <button class="icon-btn" type="button" id="cart-toggle" aria-controls="cart-drawer">${I.bag}<span class="sr-only">Open cart</span><span class="count-badge" id="cart-count" hidden></span></button>
            <button class="icon-btn menu-toggle" type="button" id="menu-toggle" aria-expanded="false" aria-controls="main-nav">${I.menu}<span class="sr-only">Menu</span></button>
          </div>
        </div>
        <div class="search-panel" id="search-panel" hidden>
          <form class="wrap" action="shop.html" role="search">
            <label class="sr-only" for="q">Search products</label>
            <input id="q" name="q" type="search" placeholder="Search by name or colour, e.g. mint" autocomplete="off">
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </header>`;
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.outerHTML = `
      <footer class="site-footer">
        <div class="wrap">
          <div class="footer-grid">
            <div>
              <div class="footer-brand">${img("images/logo.webp", "")}<span>${esc(S.name)}</span></div>
              <p>Cute styles, everyday comfort and little outfits made with love — delivered to your door anywhere in Pakistan.</p>
            </div>
            <div>
              <h3>Shop</h3>
              <ul>
                <li><a href="shop.html">All products</a></li>
                <li><a href="baby-dungaree.html">Baby dungaree sets</a></li>
                <li><a href="baby-winter-dress.html">Baby winter dresses</a></li>
                <li><a href="kids-tracksuit.html">Kids tracksuits</a></li>
                <li><a href="boys-denim-suit.html">Boys denim suits</a></li>
                <li><a href="wishlist.html">Wishlist</a></li>
                <li><a href="size-guide.html">Size guide</a></li>
                <li><a href="guides.html">Parenting guides</a></li>
              </ul>
            </div>
            <div>
              <h3>Help</h3>
              <ul>
                <li><a href="shipping-returns.html">Delivery &amp; exchange</a></li>
                <li><a href="about.html">Our story</a></li>
                <li><a href="contact.html">Contact us</a></li>
                <li><a href="privacy.html">Privacy policy</a></li>
              </ul>
            </div>
            <div>
              <h3>Order &amp; support</h3>
              <ul>
                <li><a href="${waLink("Hi Tinimini ZONE!")}" target="_blank" rel="noopener">WhatsApp ${esc(S.phoneDisplay)}</a></li>
                <li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
                <li><a href="${esc(S.facebook)}" target="_blank" rel="noopener">Facebook</a></li>
                ${S.instagram ? `<li><a href="${esc(S.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ""}
                ${S.tiktok ? `<li><a href="${esc(S.tiktok)}" target="_blank" rel="noopener">TikTok</a></li>` : ""}
                ${S.youtube ? `<li><a href="${esc(S.youtube)}" target="_blank" rel="noopener">YouTube</a></li>` : ""}
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${esc(S.name)}. All rights reserved.</span>
            <span>Cash on delivery · Easy size exchange</span>
          </div>
        </div>
      </footer>
      <a class="wa-float" href="${waLink("Hi Tinimini ZONE! I'd like to place an order.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.whatsapp}</a>
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <aside class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" hidden>
        <div class="drawer-head">
          <h2 id="drawer-title">Your bag</h2>
          <button class="icon-btn" type="button" id="drawer-close">${I.close}<span class="sr-only">Close cart</span></button>
        </div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot"></div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
    }
  }

  function renderCartCount() {
    const c = $("#cart-count");
    const n = cart.reduce((a, l) => a + l.qty, 0);
    if (c) {
      c.textContent = n;
      c.hidden = n === 0;
    }
    const w = $("#wish-count");
    if (w) {
      w.textContent = wish.length;
      w.hidden = wish.length === 0;
    }
  }

  function lineHTML(l, i, compact) {
    const p = byId(l.id);
    if (!p) return "";
    return `
      <div class="line-item">
        <a href="product.html?id=${p.id}">${img(p.image, `${p.name} in ${p.color}`)}</a>
        <div>
          <h3>${esc(p.name)}</h3>
          <p class="meta">${esc(p.color)} · ${esc(l.size)}${compact ? ` · Qty ${l.qty}` : ""}</p>
          ${
            compact
              ? ""
              : `<div class="qty" aria-label="Quantity">
                  <button type="button" data-dec="${i}" aria-label="Decrease quantity">−</button>
                  <output aria-live="polite">${l.qty}</output>
                  <button type="button" data-inc="${i}" aria-label="Increase quantity">+</button>
                </div>
                <div><button class="remove" type="button" data-remove="${i}">Remove</button></div>`
          }
        </div>
        <div class="line-price">${money(p.price * l.qty)}</div>
      </div>`;
  }

  function totalsHTML(t) {
    return `
      <div class="totals">
        <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        ${t.saving > 0 ? `<div class="saving"><span>Bundle saving</span><span>− ${money(t.saving)}</span></div>` : ""}
        <div><span>Delivery</span><span>${t.delivery == null ? "Confirmed on WhatsApp" : t.delivery === 0 ? "Free" : money(t.delivery)}</span></div>
        <div class="grand"><span>Total</span><span>${money(t.grand)}</span></div>
      </div>`;
  }

  function renderDrawer() {
    const body = $("#drawer-body");
    const foot = $("#drawer-foot");
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = `
        <div class="empty-state">
          ${I.bag}
          <h3>Your bag is empty</h3>
          <p class="muted">Pick a colour you love and it'll show up here.</p>
          <a class="btn btn-primary" href="shop.html">Shop the collection</a>
        </div>`;
      foot.innerHTML = "";
      return;
    }
    const t = priceCart(cart);
    body.innerHTML = cart.map((l, i) => lineHTML(l, i)).join("");
    foot.innerHTML = `
      ${t.nudge ? `<div class="bundle-hint">${esc(t.nudge)}</div>` : ""}
      ${totalsHTML(t)}
      <a class="btn btn-primary btn-block" href="checkout.html">Checkout · Cash on delivery</a>
      <a class="btn btn-whatsapp btn-block" href="${waLink(orderText(cart, t))}" target="_blank" rel="noopener">${I.whatsapp} Order on WhatsApp</a>`;
  }

  let lastFocus = null;
  function openDrawer() {
    const d = $("#cart-drawer");
    if (!d) return;
    lastFocus = document.activeElement;
    d.hidden = false;
    requestAnimationFrame(() => document.body.classList.add("drawer-open"));
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#drawer-close")?.focus(), 50);
  }
  function closeDrawer() {
    const d = $("#cart-drawer");
    if (!d) return;
    document.body.classList.remove("drawer-open");
    document.body.style.overflow = "";
    setTimeout(() => (d.hidden = true), 320);
    lastFocus?.focus?.();
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function orderText(lines, t, customer, orderId) {
    const rows = lines
      .map((l) => {
        const p = byId(l.id);
        return p ? `• ${p.name} — ${p.color}, ${l.size} × ${l.qty}` : "";
      })
      .filter(Boolean)
      .join("\n");
    let msg = `Assalam o Alaikum ${S.name}! I'd like to order:\n\n${rows}\n\nTotal: ${money(t.grand)}${
      t.saving > 0 ? ` (bundle saving ${money(t.saving)})` : ""
    }\nPayment: Cash on delivery`;
    if (customer) {
      msg =
        `New order ${orderId}\n\n${rows}\n\nTotal: ${money(t.grand)}${t.saving > 0 ? ` (saved ${money(t.saving)})` : ""}\nPayment: Cash on delivery\n\n` +
        `Name: ${customer.name}\nPhone: ${customer.phone}\nCity: ${customer.city}\nAddress: ${customer.address}` +
        (customer.notes ? `\nNotes: ${customer.notes}` : "");
    }
    return msg;
  }

  /* ---------- wishlist ---------- */

  function toggleWish(id) {
    const i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1);
    else wish.push(id);
    store.set("tz_wish", wish);
    renderCartCount();
    $$(`[data-wish="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", String(wish.includes(id))));
    toast(i > -1 ? "Removed from wishlist" : "Saved to wishlist");
    if (document.body.dataset.page === "wishlist") initWishlist();
  }

  /* ---------- product card ---------- */

  function cardHTML(p) {
    return `
      <article class="card" style="--c:${p.colorHex}33">
        <div class="card-media">
          ${p.badge ? `<span class="card-badge">${esc(p.badge)}</span>` : ""}
          ${img(p.image, `${p.name} in ${p.color}`)}
          <button class="wish-btn" type="button" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Save ${esc(p.color)} to wishlist">${I.heart}</button>
          <button class="card-quick" type="button" data-quick="${p.id}">Quick add</button>
        </div>
        <div class="card-body">
          <h3 class="card-title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
          <p class="card-color"><i style="--c:${p.colorHex}"></i>${esc(p.color)}</p>
          <p class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</p>
        </div>
      </article>`;
  }

  /* ---------- quick add (size picker dialog) ---------- */

  function quickAdd(id) {
    const p = byId(id);
    if (!p) return;
    let dlg = $("#quick-dialog");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.className = "modal";
      dlg.id = "quick-dialog";
      document.body.appendChild(dlg);
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg) dlg.close();
      });
    }
    dlg.innerHTML = `
      <div class="modal-head"><h2>Choose a size</h2>
        <button class="icon-btn" type="button" data-close>${I.close}<span class="sr-only">Close</span></button></div>
      <form class="modal-body" method="dialog">
        <p class="muted">${esc(p.name)} · ${esc(p.color)} · ${money(p.price)}</p>
        <fieldset class="option"><legend>Size</legend>
          <div class="size-grid">${p.sizes
            .map(
              (s, i) =>
                `<input type="radio" name="size" id="qs-${i}" value="${esc(s)}"${i === 0 ? " required" : ""}><label for="qs-${i}">${esc(s)}</label>`
            )
            .join("")}</div>
        </fieldset>
        <button class="btn btn-primary btn-block" type="submit">Add to bag</button>
      </form>`;
    $("[data-close]", dlg).onclick = () => dlg.close();
    $("form", dlg).onsubmit = (e) => {
      e.preventDefault();
      const size = new FormData(e.target).get("size");
      if (!size) return;
      addToCart(p.id, size, 1);
      dlg.close();
      openDrawer();
    };
    dlg.showModal();
  }

  /* ---------- global events ---------- */

  function bindGlobal() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, a");
      if (!t) return;
      if (t.tagName === "A" && /wa\.me\//.test(t.href || "")) track("Contact", { method: "WhatsApp" });
      if (t.id === "cart-toggle") return openDrawer();
      if (t.id === "drawer-close") return closeDrawer();
      if (t.id === "menu-toggle") {
        const nav = $("#main-nav");
        const open = nav.classList.toggle("open");
        t.setAttribute("aria-expanded", String(open));
        return;
      }
      if (t.id === "search-toggle") {
        const panel = $("#search-panel");
        panel.hidden = !panel.hidden;
        t.setAttribute("aria-expanded", String(!panel.hidden));
        if (!panel.hidden) $("#q").focus();
        return;
      }
      if (t.dataset.wish) {
        e.preventDefault();
        return toggleWish(t.dataset.wish);
      }
      if (t.dataset.quick) {
        e.preventDefault();
        return quickAdd(t.dataset.quick);
      }
      if (t.dataset.inc) return setQty(+t.dataset.inc, cart[+t.dataset.inc].qty + 1);
      if (t.dataset.dec) return setQty(+t.dataset.dec, cart[+t.dataset.dec].qty - 1);
      if (t.dataset.remove) {
        setQty(+t.dataset.remove, 0);
        toast("Removed from bag");
      }
    });
    $("#drawer-backdrop")?.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("drawer-open")) closeDrawer();
    });
    window.addEventListener("storage", (e) => {
      if (e.key === "tz_cart") {
        cart = store.get("tz_cart", []);
        renderCartCount();
        renderDrawer();
      }
    });
  }

  /* ---------- pages ---------- */

  function initHome() {
    const grid = $("#featured-grid");
    if (grid) grid.innerHTML = P.map(cardHTML).join("");
    $$("[data-cat-count]").forEach((el) => (el.textContent = P.filter((p) => p.category === el.dataset.catCount).length));

    // hero colour switcher
    const hero = $("#hero-img");
    const tag = $("#hero-tag");
    const label = $("#hero-color-name");
    const shopBtn = $("#hero-shop");
    const row = $("#hero-swatches");
    if (!hero || !row) return;
    const HERO = P.filter((p) => p.group === P[0].group);
    row.innerHTML = HERO.map(
      (p, i) =>
        `<button type="button" class="swatch" role="radio" aria-checked="${i === 0}" aria-label="${esc(p.color)}" data-id="${p.id}" style="--c:${p.colorHex}" tabindex="${i === 0 ? 0 : -1}"></button>`
    ).join("");
    const pick = (id, focus) => {
      const p = byId(id);
      $$(".swatch", row).forEach((s) => {
        const on = s.dataset.id === id;
        s.setAttribute("aria-checked", String(on));
        s.tabIndex = on ? 0 : -1;
        if (on && focus) s.focus();
      });
      label.textContent = p.color;
      tag.style.setProperty("--c", p.colorHex);
      $("strong", tag).textContent = p.color;
      shopBtn.href = `product.html?id=${p.id}`;
      hero.classList.add("is-leaving");
      setTimeout(() => {
        hero.src = p.image;
        hero.alt = `Baby wearing the ${p.color} ${p.name.toLowerCase()}`;
        hero.onload = () => hero.classList.remove("is-leaving");
        hero.onerror = () => {
          __imgFallback(hero);
          hero.classList.remove("is-leaving");
        };
      }, 220);
    };
    row.addEventListener("click", (e) => {
      const s = e.target.closest(".swatch");
      if (s) pick(s.dataset.id);
    });
    row.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault();
      const ids = HERO.map((p) => p.id);
      const cur = ids.indexOf($('.swatch[aria-checked="true"]', row).dataset.id);
      const next = (cur + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + ids.length) % ids.length;
      pick(ids[next], true);
    });
  }

  function initShop() {
    const grid = $("#shop-grid");
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    let q = (params.get("q") || "").trim().toLowerCase();
    if (q) track("Search", { search_string: q });
    let cat = "all";
    let sort = "featured";
    const chips = $("#color-chips");
    chips.innerHTML =
      `<button class="chip" type="button" data-cat="all" aria-pressed="true">All</button>` +
      [...new Set(P.map((p) => p.category))]
        .map((c) => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`)
        .join("");
    const urlCat = params.get("cat");
    if (urlCat && P.some((p) => p.category === urlCat)) {
      cat = urlCat;
      $$(".chip", chips).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.cat === cat)));
    }
    const qInfo = $("#search-info");
    const draw = () => {
      let list = P.filter((p) => cat === "all" || p.category === cat);
      if (q) list = list.filter((p) => `${p.name} ${p.color} ${p.category}`.toLowerCase().includes(q));
      if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      grid.innerHTML = list.length
        ? list.map(cardHTML).join("")
        : `<div class="empty-state" style="grid-column:1/-1"><h3>No products match “${esc(q)}”</h3><p class="muted">Try “dungaree”, “winter suit”, or a colour like mint or beige.</p><a class="btn btn-ghost" href="shop.html">Show all products</a></div>`;
      $("#result-count").textContent = `${list.length} ${list.length === 1 ? "product" : "products"}`;
      if (qInfo) {
        qInfo.hidden = !q;
        qInfo.innerHTML = q ? `Results for “${esc(q)}” · <a class="link" href="shop.html">Clear search</a>` : "";
      }
    };
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      cat = c.dataset.cat;
      $$(".chip", chips).forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      draw();
    });
    $("#sort").addEventListener("change", (e) => {
      sort = e.target.value;
      draw();
    });
    const qInput = $("#q");
    if (qInput && q) qInput.value = q;
    draw();
  }

  function initProduct() {
    const root = $("#pdp");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    let p = byId(params.get("id")) || P[0];
    const siblings = P.filter((x) => x.group && x.group === p.group);

    const mainMedia = (g) =>
      g.video
        ? `<video id="main-img" src="${g.video}" poster="${g.image}" autoplay muted loop playsinline controls preload="metadata" aria-label="${esc(g.alt)}"></video>`
        : img(g.image, g.alt, 'id="main-img" loading="eager"');

    const render = () => {
      document.title = `${p.name} — ${p.color} | ${S.name}`;
      const base = "https://tinimini-zone.netlify.app/";
      const descTxt = `${p.name} (${p.color}) — Rs. ${p.price}${p.bundle ? `, 2 for Rs. ${p.bundle.price}` : ""}. Sizes ${p.sizes.join(", ")}. Cash on delivery all over Pakistan.`;
      const setMeta = (sel, attr, val) => { const m = document.querySelector(sel); if (m) m.setAttribute(attr, val); };
      setMeta('meta[name="description"]', "content", descTxt);
      setMeta('meta[property="og:title"]', "content", document.title);
      setMeta('meta[property="og:description"]', "content", descTxt);
      setMeta('meta[property="og:image"]', "content", base + p.image);
      setMeta('link[rel="canonical"]', "href", `${base}product.html?id=${p.id}`);
      track("ViewContent", { content_ids: [p.id], content_name: `${p.name} - ${p.color}`, content_category: p.category, content_type: "product", value: p.price, currency: "PKR" });
      $("#crumb-name").textContent = `${p.name} · ${p.color}`;
      const others = siblings.filter((s) => s.id !== p.id);
      const gallery = [
        ...(p.video ? [{ video: p.video, image: p.videoPoster || p.image, alt: `${p.name} in ${p.color} — video` }] : []),
        { image: p.image, alt: `${p.name} in ${p.color}` },
        ...(p.images || []).map((src) => ({ image: src, alt: `${p.name} in ${p.color}` })),
        ...others.map((o) => ({ image: o.image, alt: `${o.name} in ${o.color}` })),
      ];
      const deal = p.bundle ? `Any ${p.bundle.qty} for ${money(p.bundle.price)}` : "";
      root.innerHTML = `
        <div class="gallery">
          <div class="thumbs" role="list">
            ${gallery
              .map(
                (g, i) =>
                  `<button type="button" role="listitem" data-thumb="${i}" aria-current="${i === 0}" aria-label="${g.video ? "Play video" : `View photo ${i + 1}`}"${g.video ? ' class="thumb-video"' : ""}>${img(g.image, "")}</button>`
              )
              .join("")}
          </div>
          <div class="gallery-main" id="gallery-main">${mainMedia(gallery[0])}</div>
        </div>
        <div class="pdp-info">
          <h1>${esc(p.name)}</h1>
          <div class="pdp-price"><span>${money(p.price)}</span>${p.compareAt ? `<s class="muted">${money(p.compareAt)}</s>` : ""}${deal ? `<span class="deal">${deal}</span>` : ""}</div>
          <p class="lede">${esc(p.description)}</p>
          <form id="buy-form" novalidate>
            <fieldset class="option">
              <legend>Colour <span>${esc(p.color)}</span></legend>
              <div class="swatch-row" style="margin:0">
                ${siblings
                  .map(
                    (s) =>
                      `<a class="swatch" href="product.html?id=${s.id}" data-sib="${s.id}" style="--c:${s.colorHex}" aria-label="${esc(s.color)}" aria-current="${s.id === p.id}"></a>`
                  )
                  .join("")}
              </div>
            </fieldset>
            <fieldset class="option">
              <legend>Size <button type="button" class="link" id="size-guide-btn">Size guide</button></legend>
              <div class="size-grid">
                ${p.sizes
                  .map(
                    (s, i) => `<input type="radio" name="size" id="size-${i}" value="${esc(s)}"><label for="size-${i}">${esc(s)}</label>`
                  )
                  .join("")}
              </div>
              <p class="option-error" id="size-error" role="alert" hidden>Choose a size to continue.</p>
            </fieldset>
            <div class="buy-row">
              <div class="qty qty-lg">
                <button type="button" id="q-dec" aria-label="Decrease quantity">−</button>
                <input id="qty" type="number" min="1" max="20" value="1" aria-label="Quantity" inputmode="numeric">
                <button type="button" id="q-inc" aria-label="Increase quantity">+</button>
              </div>
              <button class="btn btn-primary" type="submit">Add to bag</button>
            </div>
            <a class="btn btn-whatsapp btn-block" id="wa-buy" href="#" target="_blank" rel="noopener">${I.whatsapp} Order this on WhatsApp</a>
          </form>
          <ul class="pdp-assure">
            <li>${I.cash} Cash on delivery all over Pakistan</li>
            <li>${I.swap} Size doesn't fit? We'll help you exchange it</li>
            <li>${I.whatsapp} Questions? WhatsApp ${esc(S.phoneDisplay)}</li>
          </ul>
          <div class="accordion">
            <details open><summary>Details</summary><div class="content"><ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div></details>
            <details><summary>Care</summary><div class="content"><ul>${p.care.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div></details>
            <details><summary>Delivery &amp; exchange</summary><div class="content"><p>We deliver across Pakistan with cash on delivery. After you order, we confirm your size, address and delivery charges on WhatsApp. Need a different size? Message us within 3 days of delivery. <a class="link" href="shipping-returns.html">Read the full policy</a></p></div></details>
          </div>
        </div>`;

      // gallery thumbs
      $$("[data-thumb]", root).forEach((b) =>
        b.addEventListener("click", () => {
          const g = gallery[+b.dataset.thumb];
          $("#gallery-main").innerHTML = mainMedia(g);
          $$("[data-thumb]", root).forEach((x) => x.setAttribute("aria-current", String(x === b)));
        })
      );
      // colour switch without reload
      $$("[data-sib]", root).forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          p = byId(a.dataset.sib);
          history.replaceState(null, "", `product.html?id=${p.id}`);
          render();
        })
      );
      const qty = $("#qty");
      const clampQty = () => (qty.value = Math.max(1, Math.min(20, parseInt(qty.value, 10) || 1)));
      $("#q-dec").onclick = () => {
        qty.value = Math.max(1, (+qty.value || 1) - 1);
        updateWa();
      };
      $("#q-inc").onclick = () => {
        qty.value = Math.min(20, (+qty.value || 1) + 1);
        updateWa();
      };
      qty.addEventListener("change", () => {
        clampQty();
        updateWa();
      });
      const selectedSize = () => $('input[name="size"]:checked', root)?.value;
      const updateWa = () => {
        const size = selectedSize() || "size to confirm";
        const lines = [{ id: p.id, size, qty: +qty.value || 1 }];
        $("#wa-buy").href = waLink(orderText(lines, priceCart(lines)));
      };
      $$('input[name="size"]', root).forEach((r) =>
        r.addEventListener("change", () => {
          $("#size-error").hidden = true;
          updateWa();
        })
      );
      updateWa();
      $("#buy-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const size = selectedSize();
        if (!size) {
          $("#size-error").hidden = false;
          $(".size-grid input", root).focus();
          return;
        }
        clampQty();
        addToCart(p.id, size, +qty.value);
        openDrawer();
      });
      $("#size-guide-btn").onclick = () => $("#size-dialog").showModal();

      // structured data for Google
      let ld = $("#ld-product");
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        ld.id = "ld-product";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${p.name} — ${p.color}`,
        image: new URL(p.image, location.href).href,
        description: p.description,
        brand: { "@type": "Brand", name: S.name },
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: p.price,
          availability: "https://schema.org/InStock",
          url: location.href,
        },
      });
    };
    render();

    const dlg = $("#size-dialog");
    if (dlg) {
      $("[data-close]", dlg).onclick = () => dlg.close();
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg) dlg.close();
      });
    }

    const more = $("#more-grid");
    if (more) {
      const rest = P.filter((x) => x.group !== p.group);
      const related = [...rest.filter((x) => x.category === p.category), ...rest.filter((x) => x.category !== p.category)];
      more.innerHTML = related.slice(0, 4).map(cardHTML).join("");
    }
  }

  function initCheckout() {
    const form = $("#checkout-form");
    if (!form) return;
    const summary = $("#summary-body");
    const drawSummary = () => {
      if (!cart.length) {
        $("#checkout-main").innerHTML = `
          <div class="empty-state panel" style="grid-column:1/-1">
            ${I.bag}<h2>Your bag is empty</h2>
            <p class="muted" style="margin-inline:auto">Add a little something before checking out.</p>
            <a class="btn btn-primary" href="shop.html">Shop the collection</a>
          </div>`;
        return false;
      }
      const t = priceCart(cart);
      summary.innerHTML = cart.map((l, i) => lineHTML(l, i, true)).join("") + `<div style="margin-top:16px">${totalsHTML(t)}</div>`;
      track("InitiateCheckout", { content_ids: cart.map((l) => l.id), num_items: t.count, value: t.grand, currency: "PKR", content_type: "product" });
      return true;
    };
    if (!drawSummary()) return;

    const rules = {
      name: (v) => (v.trim().length >= 3 ? "" : "Enter your full name."),
      phone: (v) => (/^(\+?92|0)?3\d{2}[\s-]?\d{7}$/.test(v.replace(/\s|-/g, "")) ? "" : "Enter a valid mobile number, e.g. 0300 1234567."),
      city: (v) => (v.trim() ? "" : "Enter your city."),
      address: (v) => (v.trim().length >= 10 ? "" : "Enter your full address with house number and area."),
    };
    const check = (name) => {
      const el = form.elements[name];
      const msg = rules[name](el.value);
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      $(`#err-${name}`).textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach((n) => form.elements[n].addEventListener("blur", () => check(n)));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) {
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      // open the WhatsApp tab now, while we still have the click (avoids popup blockers)
      const waWin = window.open("about:blank", "_blank");
      const btn = $("#place-order");
      btn.disabled = true;
      btn.textContent = "Placing order…";
      const t = priceCart(cart);
      const orderId = "TZ-" + Date.now().toString(36).toUpperCase().slice(-6);
      const customer = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        city: form.elements.city.value.trim(),
        address: form.elements.address.value.trim(),
        notes: form.elements.notes.value.trim(),
      };
      const items = cart
        .map((l) => {
          const p = byId(l.id);
          return `${p.name} (${p.color}, ${l.size}) x${l.qty}`;
        })
        .join("; ");
      form.elements.order_id.value = orderId;
      form.elements.items.value = items;
      form.elements.total.value = money(t.grand);
      track(
        "Purchase",
        { content_ids: cart.map((l) => l.id), content_type: "product", num_items: t.count, value: t.grand, currency: "PKR" },
        { eventID: orderId }
      );

      // Netlify Forms records the order in your Netlify dashboard (Forms tab).
      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      } catch (err) {
        /* offline or not on Netlify — WhatsApp still receives the order */
      }

      const message = orderText(cart, t, customer, orderId);
      store.set("tz_last_order", { orderId, name: customer.name, total: money(t.grand), wa: waLink(message) });
      cart = [];
      saveCart();
      if (waWin) {
        try { waWin.opener = null; } catch (err) { /* ignore */ }
        waWin.location.href = waLink(message);
      }
      location.href = `thank-you.html?order=${encodeURIComponent(orderId)}`;
    });
  }

  function initThanks() {
    const box = $("#thanks");
    if (!box) return;
    const last = store.get("tz_last_order", null);
    const id = new URLSearchParams(location.search).get("order") || last?.orderId || "";
    $("#order-no").textContent = id ? `Order ${id}` : "Order received";
    if (last?.name) $("#thanks-name").textContent = `Thank you, ${last.name.split(" ")[0]}!`;
    if (last?.wa) $("#thanks-wa").href = last.wa;
  }

  function initWishlist() {
    const grid = $("#wish-grid");
    if (!grid) return;
    const list = wish.map(byId).filter(Boolean);
    grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty-state" style="grid-column:1/-1">${I.heart}<h3>No saved items yet</h3><p class="muted" style="margin-inline:auto">Tap the heart on any product to save it here.</p><a class="btn btn-primary" href="shop.html">Browse the shop</a></div>`;
  }

  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("#contact-status");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        status.className = "notice";
        status.textContent = "Message sent. We'll reply within a day — for faster help, WhatsApp us.";
      } catch (err) {
        status.className = "notice error";
        status.innerHTML = `Your message couldn't be sent right now. Please <a class="link" href="${waLink(
          "Hi Tinimini ZONE!"
        )}" target="_blank" rel="noopener">message us on WhatsApp</a> instead.`;
      }
      status.hidden = false;
    });
  }

  /* ---------- boot ---------- */

  renderLayout();
  bindGlobal();
  renderCartCount();
  renderDrawer();
  $$("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));
  $$("[data-icon]").forEach((el) => (el.innerHTML = I[el.dataset.icon] || ""));
  initHome();
  initShop();
  initProduct();
  initCheckout();
  initThanks();
  initWishlist();
  initContact();
})();
