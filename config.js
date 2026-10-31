/**
 * Store Configuration - Luxury Saree Boutique
 * Easily customize store details, WhatsApp numbers, currency, and promotional coupons.
 */

const STORE_CONFIG = {
    storeName: "GURU AASHISH",
    subTitle: "Haute Couture & Heritage Sarees",
    whatsappNumber: "919876543210", // International format without + or dashes (e.g., 919876543210)
    whatsappDisplay: "+91 98765 43210",
    supportEmail: "concierge@aashishluxury.com",
    currencySymbol: "₹",
    freeShippingThreshold: 2999, // Orders at or above this amount get free shipping
    standardShippingFee: 150,     // Standard shipping rate below threshold
    taxRatePercent: 5,           // 5% standard GST on apparel/textiles
    
    // Active coupon codes
    coupons: {
        "WELCOME10": {
            code: "WELCOME10",
            discountPercent: 10,
            description: "10% Instant Off on Your First Luxury Order",
            minOrder: 0
        },
        "ROYAL20": {
            code: "ROYAL20",
            discountPercent: 20,
            description: "20% Exclusive Festive Off on Orders above ₹9,999",
            minOrder: 9999
        }
    },

    // Storage Keys
    storageKeys: {
        cart: "luxury_saree_cart_v1",
        wishlist: "luxury_saree_wishlist_v1",
        coupon: "luxury_saree_applied_coupon_v1",
        whatsappCustom: "luxury_saree_custom_whatsapp_v1"
    }
};

// Allow user or merchant to customize test WhatsApp number via browser console or settings modal
(function initWhatsAppOverride() {
    const saved = localStorage.getItem(STORE_CONFIG.storageKeys.whatsappCustom);
    if (saved && /^\d{10,15}$/.test(saved)) {
        STORE_CONFIG.whatsappNumber = saved;
        STORE_CONFIG.whatsappDisplay = "+" + saved;
    }
})();

// Export for browser
window.STORE_CONFIG = STORE_CONFIG;
