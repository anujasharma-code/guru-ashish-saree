/**
 * Master Product Catalogue - Luxury Saree Boutique
 * High-definition imagery, authentic weave specifications, and rich attributes.
 */

const SAREE_PRODUCTS = [
    {
        id: 1,
        name: "Maharani Crimson Banarasi Katan Silk",
        slug: "maharani-crimson-banarasi-katan-silk",
        category: "banarasi",
        categoryLabel: "Banarasi Silk",
        badge: "Royal Heritage",
        price: 14800,
        oldPrice: 19500,
        rating: 4.9,
        reviews: 142,
        stock: 5,
        color: "Crimson Red",
        colorHex: "#8B1E3F",
        fabric: "Pure Mulberry Katan Silk with 24K Gold Tested Zari",
        weave: "Traditional Banarasi Kadwa Handloom Weave",
        blousePiece: "Included (0.8m unstitched brocade silk with heavy zari border)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Strictly dry clean only. Store wrapped in pure unbleached muslin.",
        suggestedOccasions: ["Bridal", "Wedding", "Karwa Chauth"],
        description: "An heirloom masterpiece handwoven by master artisans of Varanasi. Rich crimson red body adorned with intricate gold zari floral jaal, culminated by a grand pallu depicting traditional paisley motifs.",
        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 2,
        name: "Emerald Green Kanjeevaram Temple Border",
        slug: "emerald-green-kanjeevaram-temple-border",
        category: "kanjeevaram",
        categoryLabel: "Kanjeevaram",
        badge: "Bestseller",
        price: 18500,
        oldPrice: 24000,
        rating: 5.0,
        reviews: 98,
        stock: 4,
        color: "Emerald Green",
        colorHex: "#1B4D3E",
        fabric: "100% Pure Mulberry Silk with Heavy South Indian Zari",
        weave: "Authentic Kanchipuram Korvai Double Warp Weave",
        blousePiece: "Included (0.8m contrast ruby red silk with rich temple zari)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Air out occasionally in shade; do not spray perfume directly.",
        suggestedOccasions: ["Bridal", "Muhurtham", "Temple Weddings"],
        description: "Woven with high-density pure silk yarn, this deep emerald saree showcases contrast ruby borders with majestic gopuram temple spires and sacred Mayil (peacock) zari motifs.",
        images: [
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 3,
        name: "Vintage Champagne Gold Tissue Organza",
        slug: "vintage-champagne-gold-tissue-organza",
        category: "organza",
        categoryLabel: "Organza & Tissue",
        badge: "Trending",
        price: 8900,
        oldPrice: 12200,
        rating: 4.8,
        reviews: 64,
        stock: 8,
        color: "Champagne Gold",
        colorHex: "#E5C158",
        fabric: "Pure Sheer Metallic Tissue Silk Organza",
        weave: "Lightweight Crisp Metallic Lurex Hand-interlock",
        blousePiece: "Included (0.8m raw silk unstitched blouse in warm champagne gold)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Roll carefully onto cardboard roll; avoid sharp folding.",
        suggestedOccasions: ["Cocktail", "Evening Gala", "Sangeet"],
        description: "Luminous, gossamer-light tissue organza woven with shimmering metallic yarn that catches the ambient light like liquid gold. Accented with scalloped pearl and fine cutdana hand embroidery.",
        images: [
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 4,
        name: "Royal Peacock Blue Katan Silk Saree",
        slug: "royal-peacock-blue-katan-silk-saree",
        category: "banarasi",
        categoryLabel: "Banarasi Silk",
        badge: "Limited Edition",
        price: 16200,
        oldPrice: 21000,
        rating: 4.9,
        reviews: 86,
        stock: 3,
        color: "Peacock Blue",
        colorHex: "#005F73",
        fabric: "Pure Katan Silk with Antiqued Muted Silver Zari",
        weave: "Traditional Banarasi Rangkaat Handloom Weave",
        blousePiece: "Included (0.8m matching peacock blue silk with sleeve border)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Iron gently on reverse under muslin cloth.",
        suggestedOccasions: ["Festive", "Reception", "Grand Anniversaries"],
        description: "Draped in regal splendor, this peacock blue drape features delicate floral jaal woven in subdued antique silver and champagne gold zari, creating an understated yet undeniable aura of royalty.",
        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 5,
        name: "Hand-Painted Floral Organza Saree",
        slug: "hand-painted-floral-organza-saree",
        category: "organza",
        categoryLabel: "Organza & Tissue",
        badge: "Artisan Craft",
        price: 9400,
        oldPrice: 13000,
        rating: 4.8,
        reviews: 53,
        stock: 7,
        color: "Pastel Rose",
        colorHex: "#E7A8B4",
        fabric: "Pure Silk Organza with Gota Patti Highlights",
        weave: "Fine Sheer Silk Weave with Hand-painted Botanical Art",
        blousePiece: "Included (0.8m raw silk unstitched blouse with embroidered neckline)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Gentle dry clean only. Keep away from moisture and perfume.",
        suggestedOccasions: ["Day Wedding", "Mehendi", "Festive Brunch"],
        description: "A garden in bloom. Each petal of the oversized peonies is individually hand-painted by master Kalamkari artists and framed with delicate hand-stitched silver gota patti along the undulating scallops.",
        images: [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 6,
        name: "Imperial Ivory Chanderi Silk with Golden Booti",
        slug: "imperial-ivory-chanderi-silk-with-golden-booti",
        category: "chanderi",
        categoryLabel: "Chanderi & Tussar",
        badge: "Handloom Pure",
        price: 7600,
        oldPrice: 9900,
        rating: 4.7,
        reviews: 79,
        stock: 12,
        color: "Ivory",
        colorHex: "#FDFBF7",
        fabric: "Pure Chanderi Silk-Cotton with Real Zari Border",
        weave: "Traditional Madhya Pradesh Handloom Ek-Nali Weave",
        blousePiece: "Included (0.8m solid chanderi silk blouse piece)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean recommended for maintaining the natural crisp drape.",
        suggestedOccasions: ["Pooja", "Festive", "Elegance Dinners"],
        description: "Understated luxury at its finest. Woven in the historic town of Chanderi, this saree blends fine silk warp with cotton weft, scattered with shimmering Ashrafi coin motifs and a regal gold tissue border.",
        images: [
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 7,
        name: "Royal Mustard Paithani with Mor Bangdi Pallu",
        slug: "royal-mustard-paithani-with-mor-bangdi-pallu",
        category: "paithani",
        categoryLabel: "Paithani Heritage",
        badge: "Masterpiece",
        price: 21500,
        oldPrice: 28000,
        rating: 5.0,
        reviews: 41,
        stock: 2,
        color: "Mustard Gold",
        colorHex: "#DDA15E",
        fabric: "Pure Mulberry Silk with Tested Silver & Gold Zari",
        weave: "Traditional Yeola Paithani Tapestry Weaving Technique",
        blousePiece: "Included (0.8m contrast magenta raw silk blouse)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Refold along new fold lines every six months.",
        suggestedOccasions: ["Bridal", "Diwali", "Ganesh Utsav"],
        description: "Known as the Queen of Silks in Maharashtra, this brilliant mustard gold Paithani features the iconic kaleidoscopic Mor Bangdi (dancing peacock in a ring) pallu handwoven over 45 days.",
        images: [
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 8,
        name: "Rani Pink Katan Silk Meenakari Saree",
        slug: "rani-pink-katan-silk-meenakari-saree",
        category: "banarasi",
        categoryLabel: "Banarasi Silk",
        badge: "Bestseller",
        price: 15500,
        oldPrice: 19999,
        rating: 4.9,
        reviews: 110,
        stock: 6,
        color: "Rani Pink",
        colorHex: "#D81B60",
        fabric: "Pure Katan Silk with Multi-colored Meenakari Weave",
        weave: "Banarasi Kadwa Weave with Enamel-hued Silk Resham Inlay",
        blousePiece: "Included (0.8m unstitched matching brocade blouse)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Strictly dry clean only. Store flat in saree bag.",
        suggestedOccasions: ["Wedding Reception", "Sangeet", "Festive"],
        description: "Vibrant and celebratory, this Rani Pink Banarasi features multi-hued Meenakari birds and vines intricately woven into pure gold zari, reflecting centuries of royal Awadh craftsmanship.",
        images: [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 9,
        name: "Deep Wine Banarasi Khaddi Georgette",
        slug: "deep-wine-banarasi-khaddi-georgette",
        category: "georgette",
        categoryLabel: "Georgette & Chiffon",
        badge: "New Arrival",
        price: 11200,
        oldPrice: 14500,
        rating: 4.8,
        reviews: 37,
        stock: 9,
        color: "Wine",
        colorHex: "#5B1924",
        fabric: "Pure Khaddi Georgette with Antique Gold Zari",
        weave: "Handspun Khaddi Texture with Floating Floral Zari Weft",
        blousePiece: "Included (0.8m tone-on-tone unstitched georgette blouse)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Gentle steam pressing recommended.",
        suggestedOccasions: ["Cocktail", "Evening Soirée", "Reception"],
        description: "Crafted from whisper-soft, body-contouring pure Khaddi Georgette, dyed in a luscious wine shade and embellished with antique gold zari shikargah hunting scene motifs along the border.",
        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 10,
        name: "Golden Coral Muhurtham Kanjivaram",
        slug: "golden-coral-muhurtham-kanjivaram",
        category: "kanjeevaram",
        categoryLabel: "Kanjeevaram",
        badge: "Bridal Heirloom",
        price: 23900,
        oldPrice: 31000,
        rating: 5.0,
        reviews: 29,
        stock: 3,
        color: "Sunset Coral",
        colorHex: "#FF6F59",
        fabric: "Pure South Indian Silk with Solid Gold Zari Pallu",
        weave: "Three-ply Heavy Warp Korvai Interlocking Craft",
        blousePiece: "Included (0.8m heavy gold tissue jacquard blouse piece)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Preserve in cotton muslin; air in shade once every quarter.",
        suggestedOccasions: ["Bridal", "Muhurtham", "Temple Ceremony"],
        description: "The pinnacle of bridal luxury. A rich coral body intertwined with pure gold zari threads, bearing sacred motifs of the Kamalam (lotus) and Yali guardians on an opulent pallu.",
        images: [
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 11,
        name: "Natural Handspun Wild Tussar Ghicha Silk",
        slug: "natural-handspun-wild-tussar-ghicha-silk",
        category: "chanderi",
        categoryLabel: "Chanderi & Tussar",
        badge: "Eco Luxury",
        price: 6800,
        oldPrice: 8900,
        rating: 4.8,
        reviews: 73,
        stock: 11,
        color: "Earthy Ochre",
        colorHex: "#C68B59",
        fabric: "100% Wild Forest Tussar Silk with Ghicha Slub Texture",
        weave: "Bhagalpur Village Artisan Pit Loom Weave",
        blousePiece: "Included (0.8m handspun tussar contrast border piece)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean or gentle hand wash with natural reetha soap nut.",
        suggestedOccasions: ["Art Openings", "Intimate Gatherings", "Office Festive"],
        description: "Celebrates the raw, textured beauty of non-violent Ahimsa wild silk. Breathable, rich in natural golden sheen, with a striking hand-block printed geometric border in natural indigo and madder root dyes.",
        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85"
        ]
    },
    {
        id: 12,
        name: "Lavender Twilight Cutwork Organza",
        slug: "lavender-twilight-cutwork-organza",
        category: "organza",
        categoryLabel: "Organza & Tissue",
        badge: "New",
        price: 8200,
        oldPrice: 10500,
        rating: 4.7,
        reviews: 31,
        stock: 6,
        color: "Pastel Lavender",
        colorHex: "#BDB2FF",
        fabric: "Glass Silk Organza with Thread & Pearl Cutwork",
        weave: "Airy Crisp Weave with Detailed Laser Cutwork Borders",
        blousePiece: "Included (0.8m unstitched raw silk lavender blouse)",
        length: "5.5 meters saree + 0.8 meter blouse piece",
        care: "Dry clean only. Store without pressing heavy weights on top.",
        suggestedOccasions: ["Engagement", "Summer Soirée", "Cocktail Party"],
        description: "Dreamy and ethereal, this soft pastel lavender organza features scalloped borders enriched with delicate white cutwork embroidery and micro-pearl beadwork that drapes like misty poetry.",
        images: [
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=1200&q=85"
        ]
    }
];

// Helper to look up product by ID or Slug
function getProductById(id) {
    return SAREE_PRODUCTS.find(p => p.id === Number(id)) || null;
}

function getProductBySlug(slug) {
    return SAREE_PRODUCTS.find(p => p.slug === slug) || null;
}

// Export for browser usage
window.SAREE_PRODUCTS = SAREE_PRODUCTS;
window.getProductById = getProductById;
window.getProductBySlug = getProductBySlug;
