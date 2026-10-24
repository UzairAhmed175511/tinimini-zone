import json, html, re, sys
BASE = "https://tinimini-zone.netlify.app/"
OUT = sys.argv[1]
DATE = "2026-10-19"
WA = "https://wa.me/923101310199?text=Hi%20Tinimini%20ZONE!%20I%27d%20like%20to%20order."

def strip(s): return re.sub(r"<[^>]+>", "", s)

def page(slug, title, desc, h1, lede, image, body, faqs, crumb, article=True):
    url = BASE + slug
    graph = [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "Guides", "item": BASE + "guides.html"}] +
            ([{"@type": "ListItem", "position": 3, "name": crumb, "item": url}] if article else [])},
    ]
    if article:
        graph.append({"@type": "Article", "headline": h1, "description": desc, "image": BASE + image,
                      "datePublished": DATE, "dateModified": DATE, "mainEntityOfPage": url, "inLanguage": "en-PK",
                      "author": {"@type": "Organization", "name": "Tinimini ZONE", "url": BASE},
                      "publisher": {"@type": "Organization", "name": "Tinimini ZONE", "logo": {"@type": "ImageObject", "url": BASE + "images/logo.webp"}}})
    else:
        graph.append({"@type": "CollectionPage", "name": h1, "url": url, "description": desc})
    if faqs:
        graph.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in faqs]})
    faq_html = ""
    if faqs:
        faq_html = "<h2>Questions parents ask</h2>\n<div class=\"faq\">" + "".join(
            f"<details><summary>{html.escape(q)}</summary><p>{a}</p></details>" for q, a in faqs) + "</div>"
    crumbs = '<li><a href="index.html">Home</a></li>' + (
        f'<li><a href="guides.html">Guides</a></li><li aria-current="page">{html.escape(crumb)}</li>' if article
        else '<li aria-current="page">Guides</li>')
    t, d = html.escape(title), html.escape(desc)
    doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{t}</title>
  <meta name="description" content="{d}">
  <meta name="theme-color" content="#fffdf8">
  <meta property="og:type" content="{'article' if article else 'website'}">
  <meta property="og:site_name" content="Tinimini ZONE">
  <meta property="og:title" content="{t}">
  <meta property="og:description" content="{d}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{BASE}{image}">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="images/logo.webp">
  <link rel="apple-touch-icon" href="images/logo.webp">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Young+Serif&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <script>window.__imgFallback=function(i){{i.onerror=null;i.src="images/placeholder.svg"}}</script>
  <script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False)}</script>
</head>
<body data-page="guide">
  <div id="site-header"></div>
  <main id="main">
    <nav class="wrap breadcrumbs" aria-label="Breadcrumb"><ol>{crumbs}</ol></nav>
    <section class="page-hero"><div class="wrap">
      <h1>{html.escape(h1)}</h1>
      <p class="lede">{lede}</p>
      {'<p class="muted">By Tinimini ZONE · Updated 19 October 2026</p>' if article else ''}
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap prose">
{body}
{faq_html}
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
        <a class="btn btn-whatsapp" href="{WA}" target="_blank" rel="noopener">Order on WhatsApp 0310 1310199</a>
        <a class="btn btn-ghost" href="shop.html">Shop kids clothes</a>
      </div>
      <p style="margin-top:28px">More guides: <a class="link" href="baby-clothes-size-chart-pakistan.html">Baby size chart</a> · <a class="link" href="baby-winter-clothes-guide-pakistan.html">Baby winter clothes guide</a> · <a class="link" href="baby-boy-wedding-outfit-ideas.html">Baby boy shaadi outfits</a></p>
    </div></section>
  </main>
  <div id="site-footer"></div>
  <script src="assets/js/config.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
"""
    open(f"{OUT}/{slug}", "w").write(doc)

# ---------- 1. size chart ----------
page("baby-clothes-size-chart-pakistan.html",
 "Baby Clothes Size Chart Pakistan (6M–3 Years) – Age, Height, Weight | Tinimini ZONE",
 "Easy baby clothes size chart for Pakistani parents: size by age, height and weight for 6 months–3 years, how to measure at home, and tips for ordering kids clothes online with cash on delivery.",
 "Baby Clothes Size Chart for Pakistan (6M–3 Years)",
 "Ordering baby clothes online and not sure which size to pick? Use this simple chart by age, height and weight — and a few tips that save you an exchange.",
 "images/dungaree-peach.webp",
 """      <h2>Size chart by age, height and weight</h2>
      <table class="size-table">
        <thead><tr><th>Size</th><th>Age</th><th>Height</th><th>Weight</th></tr></thead>
        <tbody>
          <tr><td>Small (1 year)</td><td>6–12 months</td><td>67–76 cm</td><td>7.5–10 kg</td></tr>
          <tr><td>Medium (2 years)</td><td>1–2 years</td><td>76–88 cm</td><td>10–12.5 kg</td></tr>
          <tr><td>Large (3 years)</td><td>2–3 years</td><td>88–98 cm</td><td>12.5–14.5 kg</td></tr>
        </tbody>
      </table>
      <p class="muted">This chart is for Tinimini ZONE baby dungaree and 2-piece sets. For winter suits, tracksuits and denim sets, send your child's age and height on WhatsApp and we will confirm the size before dispatch.</p>
      <h2>Age or height — which one to trust?</h2>
      <p>Age is only a starting point. Two babies of the same age can be a full size apart, so <strong>height matters more than age</strong>. If your baby is tall for their age, choose by height. If they are chubby, check the weight column too.</p>
      <h2>How to measure your baby at home</h2>
      <ul>
        <li><strong>Height:</strong> lay your baby flat on a bed, mark the top of the head and the heel, then measure the distance with a measuring tape.</li>
        <li><strong>Weight:</strong> use the weight from your last check-up, or weigh yourself with and without the baby and subtract.</li>
        <li><strong>Compare with a dress that fits:</strong> measure an outfit that fits well now and send us the length — the easiest way to be sure.</li>
      </ul>
      <h2>5 tips before you order baby clothes online</h2>
      <ul>
        <li>Between two sizes? <strong>Go one size up</strong> — babies grow fast and a slightly loose suit still looks cute.</li>
        <li>For winter clothes, leave room for a vest or inner underneath.</li>
        <li>Dungarees with adjustable straps last longer because you can loosen them as your baby grows.</li>
        <li>Buying a gift? Pick the size for the age the baby will be in 2–3 months.</li>
        <li>Always confirm the size on WhatsApp before cash on delivery — it avoids returns.</li>
      </ul>
      <h2>Roman Urdu mein</h2>
      <p>Baby ke kapre online mangwane se pehle size zaroor check karein: Small 1 saal, Medium 2 saal aur Large 3 saal ke liye hai. Umar se zyada bache ki lambai (height) dekhein. Agar do size ke beech mein hai to ek size bara lein. Size confirm karne ke liye bache ki umar aur height WhatsApp 0310 1310199 par bhej dein — Tinimini ZONE poore Pakistan mein Cash on Delivery deta hai.</p>
      <p>Shop by size: <a class="link" href="baby-dungaree.html">Baby dungaree sets (6 months–3 years)</a> · <a class="link" href="baby-winter-dress.html">Baby winter dresses</a> · <a class="link" href="size-guide.html">Full size guide</a></p>""",
 [("What size is a 1 year old baby in Pakistan?", "Most babies up to 1 year fit Small (1 year). If your baby is already 1 year old, tall or above 10 kg, choose Medium (2 years) so the outfit lasts longer."),
  ("What size should I buy for a 6 month old baby?", "Small (1 year, 6–12 months) fits most 6 month old babies and leaves room to grow for a few months."),
  ("Should I buy one size bigger for babies?", "If your baby is between two sizes, yes — choose the bigger size. For winter clothes, a little extra room is also useful for an inner layer."),
  ("Can I confirm the size before ordering?", "Yes. Send your child's age and height to Tinimini ZONE on WhatsApp 0310 1310199 and we will confirm the size before dispatch.")],
 "Baby clothes size chart")

# ---------- 2. winter guide ----------
page("baby-winter-clothes-guide-pakistan.html",
 "Baby Winter Clothes Guide Pakistan 2026 – What to Buy for Sardi | Tinimini ZONE",
 "What winter clothes does your baby need in Pakistan? A simple 2026 guide to layering, fabrics like fleece, a winter checklist and city tips for Karachi, Lahore and Islamabad — with cash on delivery.",
 "Baby Winter Clothes Guide for Pakistan (Winter 2026)",
 "Sardi aa rahi hai! Here is a simple guide to dressing your baby warm without overdoing it — what to buy, which fabrics work, and how winters differ across Pakistan.",
 "images/fleece-dungaree-blue.webp",
 """      <h2>The simple layering rule</h2>
      <p>A useful rule many parents follow: <strong>dress your baby in one more layer than you are wearing</strong>. Layers are better than one very thick outfit, because you can take one off when you go indoors or the sun comes out.</p>
      <ul>
        <li><strong>Inner layer:</strong> a soft cotton vest or body suit next to the skin.</li>
        <li><strong>Middle layer:</strong> a full-sleeve shirt, sweatshirt or fleece dungaree.</li>
        <li><strong>Outer layer:</strong> a jacket or warm suit for going out, plus socks and a cap.</li>
      </ul>
      <p>Check warmth by feeling the back of your baby's neck or tummy — it should feel warm, not sweaty. Hands and feet often feel a little cool even when the baby is comfortable. Avoid heavy layers and caps while your baby sleeps indoors, and ask your doctor if you are unsure.</p>
      <h2>Best fabrics for baby winter clothes</h2>
      <ul>
        <li><strong>Fleece:</strong> light, soft and warm — great for dungarees and tracksuits.</li>
        <li><strong>Cotton:</strong> best for the layer next to the skin because it breathes.</li>
        <li><strong>Denim with a warm inner:</strong> stylish for family visits and outings on milder days.</li>
      </ul>
      <h2>Winter in different cities of Pakistan</h2>
      <ul>
        <li><strong>Karachi:</strong> winter is mild and short. A full-sleeve 2-piece set or light fleece is usually enough during the day; add a layer at night.</li>
        <li><strong>Lahore, Faisalabad, Multan:</strong> foggy, cold mornings and nights. Fleece dungarees or tracksuits with an inner layer work well.</li>
        <li><strong>Islamabad, Rawalpindi, Peshawar:</strong> colder evenings — plan a warm suit, socks and a cap for going out.</li>
        <li><strong>Quetta and the north:</strong> very cold winters; add a heavy jacket over the winter suit.</li>
      </ul>
      <h2>Baby winter clothes checklist</h2>
      <ul>
        <li>4–5 cotton inners or body suits</li>
        <li>2–3 fleece dungarees or tracksuits for daily wear</li>
        <li>1–2 smart winter suits for weddings, birthdays and family visits</li>
        <li>Warm socks, a soft cap and mittens for newborns</li>
        <li>A blanket or wrap for the car and evenings out</li>
      </ul>
      <h2>Tinimini ZONE winter collection 2026</h2>
      <p>Our winter picks: the <a class="link" href="product.html?id=fleece-dungaree-blue">Happy Bear Fleece Dungaree</a> (Rs. 1,199, 6 months–3 years), the <a class="link" href="kids-tracksuit.html">Kids Fleece Tracksuit</a> (Rs. 1,199) and the <a class="link" href="product.html?id=winter-suit-olive">Boys 3-Piece Winter Suit</a> (Rs. 1,599). See everything on the <a class="link" href="baby-winter-dress.html">baby winter dress</a> page.</p>
      <h2>Roman Urdu mein</h2>
      <p>Sardi mein baby ko ek mota suit pehnane ke bajaye teh (layers) mein kapre pehnayein: andar cotton ka vest, us ke upar full sleeve shirt ya fleece dungaree, aur bahar jaane ke liye jacket, mozay aur topi. Bache ki gardan ke peeche haath laga kar check karein — garam ho lekin paseena na ho. Karachi mein sardi halki hoti hai, jabke Lahore, Islamabad aur Peshawar mein subah aur raat zyada thandi. Tinimini ZONE ki winter collection 2026 mein fleece dungaree, tracksuit aur winter suit Cash on Delivery ke saath poore Pakistan mein milte hain.</p>""",
 [("How many layers should a baby wear in winter?", "A common rule is one more layer than an adult would wear in the same place. Use a cotton inner, a warm middle layer like fleece, and a jacket for going out."),
  ("Is fleece good for babies?", "Yes, fleece is soft, light and warm, which makes it a popular choice for baby winter dungarees and tracksuits. Put a cotton layer next to the skin."),
  ("What winter clothes does a baby need in Karachi?", "Karachi winters are mild, so full-sleeve 2-piece sets or light fleece are usually enough in the day, with one extra layer at night."),
  ("Do you deliver baby winter clothes all over Pakistan?", "Yes. Tinimini ZONE delivers all over Pakistan with cash on delivery. Order on the website or WhatsApp 0310 1310199.")],
 "Baby winter clothes guide")

# ---------- 3. wedding outfits ----------
page("baby-boy-wedding-outfit-ideas.html",
 "Baby Boy Wedding Outfit Ideas Pakistan – Mehndi, Baraat, Walima | Tinimini ZONE",
 "Shaadi season outfit ideas for baby boys and toddlers in Pakistan: what to wear for mehndi, baraat and walima, winter wedding tips, comfort tips and smart suits from Rs. 1,299 with cash on delivery.",
 "Baby Boy Wedding Outfit Ideas for Shaadi Season",
 "Shaadi season is here! Ideas to make your little one look smart at mehndi, baraat and walima — while keeping him comfortable through a long evening.",
 "images/denim-vest-white-real.webp",
 """      <h2>Outfit ideas by function</h2>
      <ul>
        <li><strong>Mehndi:</strong> bright and fun. A colourful kurta, or a light shirt with a waistcoat, matches the mood and is easy to move in.</li>
        <li><strong>Baraat:</strong> the dressiest event. A smart 3-piece suit or a vest set with a full-sleeve shirt gives the "little groom" look.</li>
        <li><strong>Walima:</strong> elegant and calm. Soft colours like white, beige, olive or navy look great in photos.</li>
        <li><strong>Dholki and family dinners:</strong> a denim set or 2-piece set — smart but relaxed.</li>
      </ul>
      <h2>Winter wedding tips</h2>
      <ul>
        <li>Wedding halls can be warm while outdoor events get cold after sunset — dress in layers you can remove.</li>
        <li>A full-sleeve shirt under a vest or suit adds warmth without hiding the outfit.</li>
        <li>Carry a warm jacket or blanket for the drive home.</li>
      </ul>
      <h2>Comfort comes first</h2>
      <ul>
        <li>Soft fabrics near the skin — avoid scratchy embellishment around the neck.</li>
        <li>Choose outfits that make diaper changes easy.</li>
        <li>Pack a spare outfit; little ones and wedding food don't always mix!</li>
        <li>Try the outfit at home a few days before so you can fix the size.</li>
      </ul>
      <h2>Ready-to-wear picks from Tinimini ZONE</h2>
      <p>The <a class="link" href="boys-denim-suit.html">Kids Denim Vest Set</a> (Rs. 1,299, white or black) is a smart pick for dholki and family events, and the <a class="link" href="product.html?id=winter-suit-olive">Boys 3-Piece Winter Suit</a> (Rs. 1,599) keeps him warm and dressed up for winter weddings. Order two and save with our bundle prices.</p>
      <h2>Roman Urdu mein</h2>
      <p>Shaadi season mein baby boy ke liye mehndi par rang birangi kurta ya waistcoat, baraat par 3-piece suit ya vest set, aur walima par white, beige ya navy jaise halke rang achhe lagte hain. Sardi ki shaadi mein layers pehnayein aur wapsi ke liye jacket saath rakhein. Kapra naram ho aur diaper badalna aasaan ho. Tinimini ZONE par Kids Denim Vest Set Rs. 1,299 aur Boys 3-Piece Winter Suit Rs. 1,599 mein Cash on Delivery ke saath poore Pakistan mein milta hai.</p>""",
 [("What should a baby boy wear to a Pakistani wedding?", "For baraat a smart 3-piece suit or vest set works well, for mehndi a colourful kurta or waistcoat, and for walima soft colours like white, beige or navy."),
  ("How do I keep my baby warm at a winter wedding?", "Use layers: a full-sleeve shirt under a vest or suit, and carry a jacket or blanket for outdoor parts and the drive home."),
  ("Do you have wedding outfits for toddlers?", "Yes. Tinimini ZONE has the Kids Denim Vest Set (Rs. 1,299) and the Boys 3-Piece Winter Suit (Rs. 1,599). WhatsApp 0310 1310199 with your child's age and we'll confirm the size.")],
 "Baby boy wedding outfits")

# ---------- hub ----------
page("guides.html",
 "Parenting & Baby Clothes Guides | Tinimini ZONE Pakistan",
 "Helpful guides for Pakistani parents from Tinimini ZONE: baby clothes size chart, baby winter clothes guide and baby boy wedding outfit ideas.",
 "Guides for Parents",
 "Simple, practical guides from Tinimini ZONE to help you choose the right size and the right outfit for every season.",
 "images/dungaree-peach.webp",
 """      <ul>
        <li><a class="link" href="baby-clothes-size-chart-pakistan.html"><strong>Baby Clothes Size Chart for Pakistan (6M–3 Years)</strong></a> — size by age, height and weight, and how to measure at home.</li>
        <li><a class="link" href="baby-winter-clothes-guide-pakistan.html"><strong>Baby Winter Clothes Guide (Winter 2026)</strong></a> — layering, fabrics, city tips and a winter checklist.</li>
        <li><a class="link" href="baby-boy-wedding-outfit-ideas.html"><strong>Baby Boy Wedding Outfit Ideas</strong></a> — mehndi, baraat and walima looks for shaadi season.</li>
      </ul>""",
 [], "Guides", article=False)
print("ok")
