import type { Payload } from 'payload'

import { fetchUnsplashSquare, makeBannerImage, makeProductImage } from './placeholder'

/** Build a minimal valid Lexical richText value from plain paragraphs. */
const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          mode: 'normal',
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})

type CategorySeed = { key: string; name: string; description: string; featured: boolean; img: string }

const categories: CategorySeed[] = [
  { key: 'keyboards', name: 'Keyboards', description: 'Mechanical, low-profile and wireless boards built to type on for hours.', featured: true, img: 'photo-1618384887929-16ec33fab9ef' },
  { key: 'mice', name: 'Mice', description: 'Lightweight, precise pointers — wired and wireless.', featured: true, img: 'photo-1615663245857-ac93bb7c39e7' },
  { key: 'headsets', name: 'Headsets', description: 'Immersive audio and crystal-clear comms for work and play.', featured: true, img: 'photo-1505740420928-5e560c06d30e' },
  { key: 'monitors', name: 'Monitors', description: 'High-refresh, color-accurate panels from portable to ultrawide.', featured: true, img: 'photo-1593640408182-31c70c8268f5' },
  { key: 'connectivity', name: 'Cables & Hubs', description: 'Docks, hubs and cables that keep everything connected.', featured: false, img: 'photo-1593344484962-796055d4a3a4' },
  { key: 'desk', name: 'Desk Gear', description: 'Mousepads, stands and webcams to finish your setup.', featured: true, img: 'photo-1629429408209-1f912961dbd8' },
]

// Verified Unsplash product photos, one set per category (assigned to the
// products in that category in order). Square-cropped at download time.
const productImagesByCategory: Record<string, string[]> = {
  keyboards: ['photo-1618384887929-16ec33fab9ef', 'photo-1587829741301-dc798b83add3', 'photo-1541140532154-b024d705b90a'],
  mice: ['photo-1615663245857-ac93bb7c39e7', 'photo-1527814050087-3793815479db', 'photo-1605773527852-c546a8584ea3'],
  headsets: ['photo-1505740420928-5e560c06d30e', 'photo-1618366712010-f4ae9c647dcb', 'photo-1583394838336-acd977736f90'],
  monitors: ['photo-1593640408182-31c70c8268f5', 'photo-1527443224154-c4a3942d3acf', 'photo-1527443195645-1133f7f28990'],
  connectivity: ['photo-1593344484962-796055d4a3a4', 'photo-1624823183493-ed5832f48f18', 'photo-1601524909162-ae8725290836'],
  desk: ['photo-1629429408209-1f912961dbd8', 'photo-1517059224940-d4af9eec41b7', 'photo-1542751371-adc38448a05e'],
}

type ProductSeed = {
  title: string
  brand: string
  category: string
  price: number
  compareAtPrice?: number
  stock: number
  badges?: ('New' | 'Best Seller' | 'Sale' | 'Limited')[]
  short: string
  body: string[]
  specs: [string, string][]
  features: string[]
}

const products: ProductSeed[] = [
  // Keyboards
  {
    title: 'Aurora 75 Mechanical Keyboard', brand: 'VoltGear', category: 'keyboards',
    price: 129.99, compareAtPrice: 159.99, stock: 42, badges: ['Best Seller', 'Sale'],
    short: 'Gasket-mounted 75% board with hot-swap switches and a CNC aluminium frame.',
    body: [
      'The Aurora 75 packs a premium typing experience into a compact 75% layout. A gasket-mounted plate and five layers of sound dampening give every keystroke a deep, satisfying thock.',
      'Hot-swappable south-facing sockets let you change switches without soldering, while QMK/VIA support means every key is yours to remap.',
    ],
    specs: [['Layout', '75% (82 keys)'], ['Connectivity', 'USB-C / Bluetooth 5.1 / 2.4GHz'], ['Switches', 'Hot-swap (3/5-pin)'], ['Battery', '4000mAh'], ['Frame', 'CNC Aluminium']],
    features: ['Gasket-mounted typing feel', 'Hot-swappable switches', 'Triple-mode wireless', 'South-facing RGB', 'QMK / VIA programmable'],
  },
  {
    title: 'Nova TKL Wireless', brand: 'Nebula', category: 'keyboards',
    price: 99.99, stock: 60, badges: ['New'],
    short: 'Tenkeyless wireless board with PBT keycaps and a 200-hour battery.',
    body: ['A clean, no-nonsense tenkeyless board for the minimalist desk. Doubleshot PBT keycaps resist shine and wear, and the 200-hour battery means you rarely reach for a cable.'],
    specs: [['Layout', 'TKL (87 keys)'], ['Connectivity', 'Bluetooth 5.1 / USB-C'], ['Keycaps', 'Doubleshot PBT'], ['Battery', '4000mAh (~200h)']],
    features: ['Doubleshot PBT keycaps', 'Multi-device pairing', 'USB-C fast charge', 'Mac & Windows layouts'],
  },
  {
    title: 'Tactile Pro 60%', brand: 'Lumen', category: 'keyboards',
    price: 79.99, stock: 75,
    short: 'Compact 60% board with crisp tactile switches and per-key RGB.',
    body: ['Reclaim your desk with a 60% footprint. Pre-lubed tactile switches and a steel plate deliver a firm, responsive feel in a board you can take anywhere.'],
    specs: [['Layout', '60% (61 keys)'], ['Connectivity', 'USB-C'], ['Switches', 'Tactile (pre-lubed)'], ['Lighting', 'Per-key RGB']],
    features: ['Pre-lubed tactile switches', 'Steel plate', 'Per-key RGB', 'Detachable USB-C'],
  },
  // Mice
  {
    title: 'Vertex MX Wireless Mouse', brand: 'VoltGear', category: 'mice',
    price: 79.99, stock: 55, badges: ['Best Seller'],
    short: 'Ergonomic productivity mouse with a 26K sensor and MagSpeed scrolling.',
    body: ['Engineered for long workdays, the Vertex MX shapes to your hand and tracks flawlessly on any surface — including glass. An electromagnetic scroll wheel rips through documents and stops on a dime.'],
    specs: [['Sensor', '26,000 DPI optical'], ['Connectivity', 'Bluetooth / 2.4GHz USB'], ['Buttons', '7 programmable'], ['Battery', '70 days / USB-C']],
    features: ['MagSpeed electromagnetic scroll', 'Track on glass', 'Multi-device flow', 'USB-C quick charge'],
  },
  {
    title: 'Glide Pro Lightweight', brand: 'Nebula', category: 'mice',
    price: 59.99, compareAtPrice: 69.99, stock: 80, badges: ['Sale'],
    short: '58g honeycomb gaming mouse with PTFE feet and an 8K polling rate.',
    body: ['At just 58 grams, the Glide Pro practically disappears in hand. Virgin-grade PTFE feet and a flexible paracord give you effortless, drag-free aim.'],
    specs: [['Weight', '58g'], ['Sensor', '19,000 DPI'], ['Polling', 'Up to 8000Hz'], ['Switches', '80M-click optical']],
    features: ['Ultralight honeycomb shell', 'Optical switches', 'PTFE skates', 'Paracord cable'],
  },
  {
    title: 'Precision Ergo Trackball', brand: 'Lumen', category: 'mice',
    price: 89.99, stock: 24, badges: ['Limited'],
    short: 'Thumb-operated trackball that keeps your wrist still and your desk clear.',
    body: ['Move the cursor, not your arm. The Precision Ergo trackball reduces wrist travel to near zero, with a sculpted rest that supports your hand all day.'],
    specs: [['Type', 'Thumb trackball'], ['Connectivity', 'Bluetooth / 2.4GHz'], ['Buttons', '6 programmable'], ['Battery', '4 months AA']],
    features: ['Zero-arm-travel control', 'Adjustable cursor speed', 'Replaceable 34mm ball', 'Multi-device pairing'],
  },
  // Headsets
  {
    title: 'Resonance HX Wireless Headset', brand: 'VoltGear', category: 'headsets',
    price: 149.99, stock: 38, badges: ['New', 'Best Seller'],
    short: 'Low-latency wireless headset with 50mm drivers and hybrid ANC.',
    body: ['Hear everything that matters and nothing that does not. The Resonance HX pairs custom 50mm drivers with hybrid active noise cancellation and a detachable broadcast-grade boom mic.'],
    specs: [['Drivers', '50mm dynamic'], ['Connectivity', '2.4GHz / Bluetooth'], ['Latency', '<25ms (2.4GHz)'], ['Battery', '40 hours'], ['Mic', 'Detachable cardioid']],
    features: ['Hybrid ANC', 'Sub-25ms wireless', 'Detachable boom mic', 'Memory-foam earcups', 'Simultaneous BT + 2.4GHz'],
  },
  {
    title: 'AeroPods Studio', brand: 'Nebula', category: 'headsets',
    price: 119.99, stock: 47,
    short: 'Open-back studio headset tuned for accurate, fatigue-free listening.',
    body: ['An open-back design gives the AeroPods Studio a wide, natural soundstage that is perfect for mixing, editing, or simply enjoying detail in your music.'],
    specs: [['Type', 'Open-back, wired'], ['Drivers', '45mm'], ['Impedance', '38Ω'], ['Cable', '3m detachable']],
    features: ['Wide open soundstage', 'Velour earpads', 'Detachable cable', 'Reference-tuned'],
  },
  {
    title: 'Comms Pro USB Headset', brand: 'Lumen', category: 'headsets',
    price: 69.99, stock: 90,
    short: 'Plug-and-play USB headset with noise-cancelling mic for calls all day.',
    body: ['Built for the back-to-back meeting day. A noise-cancelling mic isolates your voice, and on-ear controls keep mute one tap away.'],
    specs: [['Connectivity', 'USB-A'], ['Mic', 'Noise-cancelling'], ['Controls', 'Inline mute / volume'], ['Weight', '210g']],
    features: ['Certified for major UC apps', 'Flip-to-mute mic', 'All-day comfort', 'Plug and play'],
  },
  // Monitors
  {
    title: 'VoltView 27" 4K UHD Monitor', brand: 'VoltGear', category: 'monitors',
    price: 399.99, compareAtPrice: 449.99, stock: 18, badges: ['Sale'],
    short: '27-inch 4K IPS panel with 144Hz, HDR400 and USB-C 90W charging.',
    body: ['Sharp, fast and connected. The VoltView 27 combines a 4K IPS panel with a 144Hz refresh rate, so creative detail and gaming smoothness finally live on the same screen. A single USB-C cable carries video and 90W of charge.'],
    specs: [['Panel', '27" IPS 4K (3840×2160)'], ['Refresh', '144Hz'], ['HDR', 'VESA HDR400'], ['Ports', 'USB-C 90W, 2× HDMI 2.1, DP 1.4'], ['Color', '98% DCI-P3']],
    features: ['4K @ 144Hz', 'USB-C single-cable docking', '98% DCI-P3', 'Ergonomic stand', 'FreeSync / G-Sync compatible'],
  },
  {
    title: 'UltraWide 34" QHD', brand: 'Nebula', category: 'monitors',
    price: 549.99, stock: 12, badges: ['Best Seller'],
    short: '34-inch curved ultrawide for immersive work and play at 165Hz.',
    body: ['More room to think. This 1440p ultrawide curves gently around your field of view, replacing a dual-monitor setup with one seamless 34-inch canvas.'],
    specs: [['Panel', '34" VA UWQHD (3440×1440)'], ['Curve', '1500R'], ['Refresh', '165Hz'], ['Ports', 'HDMI 2.0, DP 1.4, USB hub']],
    features: ['21:9 ultrawide', '1500R immersive curve', '165Hz', 'Built-in USB hub'],
  },
  {
    title: 'Portable 15.6" OLED', brand: 'Lumen', category: 'monitors',
    price: 279.99, stock: 20, badges: ['New', 'Limited'],
    short: 'A featherweight OLED second screen that runs off a single USB-C cable.',
    body: ['Your second screen, anywhere. This 15.6-inch OLED weighs under 700g and draws power and video from one USB-C cable — perfect for the road.'],
    specs: [['Panel', '15.6" OLED 1080p'], ['Weight', '690g'], ['Ports', '2× USB-C, mini-HDMI'], ['Extras', 'Smart cover stand']],
    features: ['True-black OLED', 'Single-cable USB-C', 'Under 700g', 'Folding cover stand'],
  },
  // Connectivity
  {
    title: 'FluxHub 9-in-1 USB-C Dock', brand: 'VoltGear', category: 'connectivity',
    price: 89.99, stock: 65, badges: ['Best Seller'],
    short: 'Turn one USB-C port into nine — 4K HDMI, PD 100W, Ethernet and more.',
    body: ['One cable, every port. The FluxHub adds dual 4K HDMI, gigabit Ethernet, card readers and 100W pass-through charging to any USB-C laptop, in an aluminium shell that stays cool.'],
    specs: [['Ports', '9-in-1'], ['Video', '2× HDMI 4K@60'], ['Power', '100W PD pass-through'], ['Network', 'Gigabit Ethernet'], ['Data', 'USB 3.2, SD/microSD']],
    features: ['Dual 4K @ 60Hz output', '100W pass-through charging', 'Gigabit Ethernet', 'Aluminium heat-spreader'],
  },
  {
    title: 'Thunder Cable 240W USB-C', brand: 'Nebula', category: 'connectivity',
    price: 24.99, stock: 140,
    short: 'Braided 240W USB-C cable with 40Gbps data and 8K video.',
    body: ['Future-proof your desk. This USB4 cable carries 240W of power, 40Gbps of data and 8K video through a tough braided jacket rated for 25,000 bends.'],
    specs: [['Standard', 'USB4 / Thunderbolt'], ['Power', '240W (48V)'], ['Data', '40Gbps'], ['Video', 'Up to 8K@60'], ['Length', '1m']],
    features: ['240W charging', '40Gbps transfer', '8K video', 'Braided 25k-bend jacket'],
  },
  {
    title: 'Nexus 4-Port USB 3.2 Hub', brand: 'Lumen', category: 'connectivity',
    price: 34.99, compareAtPrice: 44.99, stock: 110, badges: ['Sale'],
    short: 'Slim powered 4-port hub with individual switches and a 5Gbps bus.',
    body: ['A tidy way to add four fast ports to any machine. Individual power switches let you cut power to idle devices, and the slim aluminium body slips under any monitor stand.'],
    specs: [['Ports', '4× USB-A 3.2'], ['Speed', '5Gbps'], ['Power', 'Optional 5V input'], ['Cable', '0.5m USB-C']],
    features: ['Per-port power switches', '5Gbps bus', 'Slim aluminium body', 'Optional external power'],
  },
  // Desk Gear
  {
    title: 'Horizon XL Desk Mat', brand: 'VoltGear', category: 'desk',
    price: 34.99, stock: 130, badges: ['New'],
    short: 'Extra-large stitched desk mat with a smooth, fast cloth surface.',
    body: ['Cover the whole desk in one clean surface. The Horizon XL pairs a fast, control-balanced cloth top with a grippy rubber base and stitched anti-fray edges.'],
    specs: [['Size', '900 × 400 × 4mm'], ['Surface', 'Micro-textured cloth'], ['Base', 'Natural rubber'], ['Edges', 'Stitched']],
    features: ['Full-desk coverage', 'Stitched anti-fray edges', 'Non-slip rubber base', 'Spill-resistant weave'],
  },
  {
    title: 'Elevate Aluminium Laptop Stand', brand: 'Nebula', category: 'desk',
    price: 54.99, stock: 70, badges: ['Best Seller'],
    short: 'Foldable aluminium stand that lifts your laptop to eye level.',
    body: ['Raise your screen, fix your posture. The Elevate folds flat for travel and props your laptop at an ergonomic height with an open back for airflow.'],
    specs: [['Material', 'Aluminium alloy'], ['Supports', 'Up to 16" / 8kg'], ['Folded', '230 × 30mm'], ['Feet', 'Silicone grip']],
    features: ['Folds flat for travel', 'Open-back cooling', 'Silicone-padded cradle', 'Holds up to 8kg'],
  },
  {
    title: 'ClarityCam 4K Webcam', brand: 'Lumen', category: 'desk',
    price: 99.99, compareAtPrice: 129.99, stock: 33, badges: ['Sale', 'Limited'],
    short: '4K webcam with autofocus, HDR and a built-in privacy shutter.',
    body: ['Show up sharp. The ClarityCam shoots crisp 4K with HDR and fast autofocus, while dual noise-cancelling mics keep your voice clean. A physical shutter closes the lens when you are done.'],
    specs: [['Resolution', '4K@30 / 1080p@60'], ['Focus', 'Auto + HDR'], ['Mics', 'Dual noise-cancelling'], ['Mount', 'Clip + tripod thread'], ['Privacy', 'Physical shutter']],
    features: ['4K HDR video', 'Fast autofocus', 'Dual stereo mics', 'Physical privacy shutter'],
  },
]

export async function seedDatabase(payload: Payload): Promise<void> {
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  log('Clearing existing data…')
  for (const collection of ['orders', 'pages', 'products', 'categories', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  // ---- Media + Categories ----
  log('Creating categories…')
  const categoryIds: Record<string, number> = {}
  for (const cat of categories) {
    const real = await fetchUnsplashSquare(cat.img)
    const data = real ?? (await makeBannerImage())
    const ext = real ? 'jpg' : 'png'
    const mimetype = real ? 'image/jpeg' : 'image/png'
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${cat.name} category` },
      file: { data, mimetype, name: `category-${cat.key}.${ext}`, size: data.length },
    })
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        description: cat.description,
        featured: cat.featured,
        image: media.id,
        slug: cat.key === 'connectivity' ? 'cables-hubs' : cat.key === 'desk' ? 'desk-gear' : cat.key,
      },
    })
    categoryIds[cat.key] = created.id
  }

  // ---- Products ----
  log('Creating products…')
  const productIdsByCategory: Record<string, number[]> = {}
  const productImageIndex: Record<string, number> = {}
  const allProductIds: number[] = []
  for (const p of products) {
    const ids = productImagesByCategory[p.category] || []
    const idx = productImageIndex[p.category] ?? 0
    productImageIndex[p.category] = idx + 1
    const photoId = ids[idx % Math.max(1, ids.length)]
    const real = photoId ? await fetchUnsplashSquare(photoId) : null
    const data = real ?? (await makeProductImage())
    const ext = real ? 'jpg' : 'png'
    const mimetype = real ? 'image/jpeg' : 'image/png'
    const slugName = p.title.replace(/[^\w]+/g, '-').toLowerCase()
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${p.title} by ${p.brand}` },
      file: { data, mimetype, name: `product-${slugName}.${ext}`, size: data.length },
    })
    const created = await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        brand: p.brand,
        shortDescription: p.short,
        description: richText(p.body),
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku: `VG-${p.brand.slice(0, 2).toUpperCase()}-${1000 + allProductIds.length}`,
        stock: p.stock,
        badges: p.badges,
        category: categoryIds[p.category],
        images: [{ image: media.id }],
        specs: p.specs.map(([label, value]) => ({ label, value })),
        features: p.features.map((feature) => ({ feature })),
        status: 'published',
      },
    })
    allProductIds.push(created.id)
    ;(productIdsByCategory[p.category] ||= []).push(created.id)
  }

  // ---- Related products (same category) ----
  log('Linking related products…')
  for (const ids of Object.values(productIdsByCategory)) {
    for (const id of ids) {
      const related = ids.filter((other) => other !== id).slice(0, 3)
      if (related.length) {
        await payload.update({ collection: 'products', id, data: { relatedProducts: related } })
      }
    }
  }

  // ---- About page ----
  log('Creating About page…')
  const aboutReal = await fetchUnsplashSquare('photo-1517059224940-d4af9eec41b7')
  const aboutHero = aboutReal ?? (await makeBannerImage())
  const aboutHeroMedia = await payload.create({
    collection: 'media',
    data: { alt: 'A clean VoltGear desk setup' },
    file: {
      data: aboutHero,
      mimetype: aboutReal ? 'image/jpeg' : 'image/png',
      name: aboutReal ? 'about-hero.jpg' : 'about-hero.png',
      size: aboutHero.length,
    },
  })
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      slug: 'about',
      status: 'published',
      hero: {
        eyebrow: 'Our story',
        heading: 'Gear that earns its place on your desk',
        subheading: 'VoltGear builds and curates computer accessories for people who care how their tools feel — every single day.',
        image: aboutHeroMedia.id,
      },
      layout: [
        {
          blockType: 'richText',
          width: 'normal',
          content: richText([
            'VoltGear started with a simple frustration: too much desk gear looks the part but falls apart. So we set out to build and curate accessories that feel as good on day 500 as they do on day one.',
            'We obsess over the details most brands skip — the thock of a keystroke, the glide of a mouse, the click of a well-machined hinge. If it touches your hands every day, it should be worth touching.',
          ]),
        },
        {
          blockType: 'stats',
          heading: 'A few numbers we are proud of',
          stats: [
            { value: '50k+', label: 'Orders shipped' },
            { value: '4.9/5', label: 'Average review' },
            { value: '2-year', label: 'Standard warranty' },
            { value: '30-day', label: 'Easy returns' },
          ],
        },
        {
          blockType: 'imageText',
          eyebrow: 'How we choose',
          heading: 'Tested by people who actually use it',
          imagePosition: 'right',
          image: aboutHeroMedia.id,
          body: richText([
            'Every product in the VoltGear catalogue is used by our own team before it ever reaches the store. If it does not survive our desks, it does not make the cut.',
          ]),
        },
        {
          blockType: 'team',
          heading: 'What we stand for',
          description: 'The principles behind everything we ship.',
          members: [
            { name: 'Built to last', role: 'Durability first', bio: 'Premium materials and a 2-year warranty on everything we make.' },
            { name: 'Honest pricing', role: 'No fake discounts', bio: 'Fair prices every day — sales you can actually trust.' },
            { name: 'Real support', role: 'Humans, not bots', bio: 'Friendly help from people who know the products inside out.' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Ready to upgrade your setup?',
          text: 'Browse the full range of keyboards, mice, audio and desk gear.',
          buttonLabel: 'Shop all products',
          buttonHref: '/shop',
        },
      ],
    },
  })

  // ---- Globals ----
  log('Configuring globals…')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      storeName: 'VoltGear',
      supportEmail: 'support@voltgear.store',
      freeShippingThreshold: 75,
      flatShippingRate: 9.99,
    },
  })
  await payload.updateGlobal({
    slug: 'header',
    data: {
      announcement: { enabled: true, text: 'Free shipping on orders over $75 — 2-year warranty on everything.' },
      navLinks: [
        { label: 'Shop', href: '/shop' },
        { label: 'Keyboards', href: '/category/keyboards' },
        { label: 'Monitors', href: '/category/monitors' },
        { label: 'About', href: '/about' },
      ],
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'All products', href: '/shop' },
            { label: 'Keyboards', href: '/category/keyboards' },
            { label: 'Mice', href: '/category/mice' },
            { label: 'Monitors', href: '/category/monitors' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: 'mailto:support@voltgear.store' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Find an order', href: '/shop' },
            { label: 'Warranty', href: '/about' },
            { label: 'Returns', href: '/about' },
          ],
        },
      ],
      socialLinks: [
        { platform: 'twitter', href: 'https://twitter.com' },
        { platform: 'github', href: 'https://github.com' },
        { platform: 'youtube', href: 'https://youtube.com' },
      ],
      copyright: `© ${2025} VoltGear. Built with Payload CMS.`,
    },
  })

  log(`Done — ${products.length} products across ${categories.length} categories.`)
}
