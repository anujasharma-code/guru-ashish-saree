/**
 * Central State & Storage Manager - Guru Aashish Luxury Sarees
 * Manages Cart, Wishlist, Coupon Engine, Stock Validation, and Order Calculations.
 */

(function (window) {
    "use strict";

    const cfg = window.STORE_CONFIG || {
        freeShippingThreshold: 2999,
        standardShippingFee: 150,
        taxRatePercent: 5,
        coupons: {
            "WELCOME10": { code: "WELCOME10", discountPercent: 10, minOrder: 0 },
            "ROYAL20": { code: "ROYAL20", discountPercent: 20, minOrder: 9999 }
        },
        storageKeys: {
            cart: "luxury_saree_cart_v1",
            wishlist: "luxury_saree_wishlist_v1",
            coupon: "luxury_saree_applied_coupon_v1"
        }
    };

    function safeJSONParse(str, fallback) {
        if (!str) return fallback;
        try {
            return JSON.parse(str);
        } catch (e) {
            console.warn("Storage parse error:", e);
            return fallback;
        }
    }

    // ----------------------------------------------------
    // CART ENGINE
    // ----------------------------------------------------
    function getCart() {
        const raw = localStorage.getItem(cfg.storageKeys.cart);
        const list = safeJSONParse(raw, []);
        if (!Array.isArray(list)) return [];
        // Filter out any stale/invalid products
        return list.filter(item => {
            const product = window.getProductById(item.id);
            return product && item.quantity > 0;
        });
    }

    function saveCart(cart) {
        localStorage.setItem(cfg.storageKeys.cart, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent("luxury-cart-updated", { detail: { cart } }));
    }

    function addToCart(productId, quantity = 1) {
        productId = Number(productId);
        quantity = Math.max(1, parseInt(quantity, 10) || 1);
        const product = window.getProductById(productId);
        if (!product) return { success: false, message: "Product not found." };

        const cart = getCart();
        const existing = cart.find(item => item.id === productId);
        const currentQty = existing ? existing.quantity : 0;
        const targetQty = currentQty + quantity;

        if (targetQty > product.stock) {
            const allowed = Math.max(0, product.stock - currentQty);
            return {
                success: false,
                message: allowed > 0 
                    ? `Only ${allowed} more available in stock (Max ${product.stock}).` 
                    : `Cannot add more. You have all ${product.stock} units in your bag.`
            };
        }

        if (existing) {
            existing.quantity = targetQty;
        } else {
            cart.push({ id: productId, quantity: targetQty, addedAt: Date.now() });
        }

        saveCart(cart);
        return { success: true, message: `Added "${product.name}" to your shopping bag.`, cart };
    }

    function updateCartQuantity(productId, quantity) {
        productId = Number(productId);
        quantity = parseInt(quantity, 10);
        const product = window.getProductById(productId);
        if (!product) return { success: false };

        const cart = getCart();
        const existingIndex = cart.findIndex(item => item.id === productId);
        if (existingIndex === -1) return { success: false };

        if (quantity <= 0) {
            cart.splice(existingIndex, 1);
            saveCart(cart);
            return { success: true, message: `Removed "${product.name}" from bag.`, removed: true };
        }

        if (quantity > product.stock) {
            cart[existingIndex].quantity = product.stock;
            saveCart(cart);
            return { 
                success: false, 
                message: `Limited stock: Maximum ${product.stock} available.`, 
                capped: true 
            };
        }

        cart[existingIndex].quantity = quantity;
        saveCart(cart);
        return { success: true };
    }

    function removeFromCart(productId) {
        return updateCartQuantity(productId, 0);
    }

    function clearCart() {
        saveCart([]);
    }

    // ----------------------------------------------------
    // WISHLIST ENGINE
    // ----------------------------------------------------
    function getWishlist() {
        const raw = localStorage.getItem(cfg.storageKeys.wishlist);
        const list = safeJSONParse(raw, []);
        if (!Array.isArray(list)) return [];
        return list.filter(id => window.getProductById(id));
    }

    function saveWishlist(wishlist) {
        localStorage.setItem(cfg.storageKeys.wishlist, JSON.stringify(wishlist));
        window.dispatchEvent(new CustomEvent("luxury-wishlist-updated", { detail: { wishlist } }));
    }

    function isInWishlist(productId) {
        productId = Number(productId);
        const list = getWishlist();
        return list.includes(productId);
    }

    function toggleWishlist(productId) {
        productId = Number(productId);
        const product = window.getProductById(productId);
        if (!product) return { inWishlist: false };

        let list = getWishlist();
        let inWishlist;
        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
            inWishlist = false;
        } else {
            list.push(productId);
            inWishlist = true;
        }
        saveWishlist(list);
        return { 
            inWishlist, 
            message: inWishlist ? `Added "${product.name}" to your Wishlist.` : `Removed from your Wishlist.` 
        };
    }

    function moveWishlistToCart(productId) {
        productId = Number(productId);
        const addResult = addToCart(productId, 1);
        if (addResult.success) {
            // Remove from wishlist
            let list = getWishlist().filter(id => id !== productId);
            saveWishlist(list);
        }
        return addResult;
    }

    function clearWishlist() {
        saveWishlist([]);
    }

    // ----------------------------------------------------
    // COUPON ENGINE
    // ----------------------------------------------------
    function getAppliedCoupon() {
        const raw = localStorage.getItem(cfg.storageKeys.coupon);
        if (!raw) return null;
        const code = raw.trim().toUpperCase();
        return cfg.coupons[code] || null;
    }

    function applyCoupon(code) {
        if (!code || typeof code !== "string") {
            return { success: false, message: "Please enter a valid coupon code." };
        }
        const cleaned = code.trim().toUpperCase();
        const coupon = cfg.coupons[cleaned];

        if (!coupon) {
            return { 
                success: false, 
                message: `Code "${cleaned}" is not recognized. Try "WELCOME10" for 10% off.` 
            };
        }

        const totals = calculateTotals();
        if (totals.subtotal === 0) {
            return { success: false, message: "Your bag is empty. Add a saree first!" };
        }

        if (coupon.minOrder && totals.subtotal < coupon.minOrder) {
            return { 
                success: false, 
                message: `Code "${cleaned}" requires a minimum order of ₹${coupon.minOrder.toLocaleString("en-IN")}.` 
            };
        }

        localStorage.setItem(cfg.storageKeys.coupon, cleaned);
        window.dispatchEvent(new CustomEvent("luxury-coupon-updated", { detail: { coupon } }));
        return { 
            success: true, 
            coupon, 
            message: `Coupon "${cleaned}" applied! You saved ${coupon.discountPercent}% on this order.` 
        };
    }

    function removeCoupon() {
        localStorage.removeItem(cfg.storageKeys.coupon);
        window.dispatchEvent(new CustomEvent("luxury-coupon-updated", { detail: { coupon: null } }));
        return { success: true, message: "Coupon removed." };
    }

    // ----------------------------------------------------
    // TOTALS CALCULATION ENGINE
    // ----------------------------------------------------
    function calculateTotals() {
        const cart = getCart();
        let subtotal = 0;
        let originalMrpTotal = 0;
        let totalItems = 0;

        const detailedItems = cart.map(item => {
            const product = window.getProductById(item.id);
            const linePrice = product.price * item.quantity;
            const lineOriginal = (product.oldPrice || product.price) * item.quantity;
            subtotal += linePrice;
            originalMrpTotal += lineOriginal;
            totalItems += item.quantity;
            return {
                ...item,
                product,
                unitPrice: product.price,
                lineTotal: linePrice,
                lineSavings: Math.max(0, lineOriginal - linePrice)
            };
        });

        // Coupon calculation
        let coupon = getAppliedCoupon();
        let couponDiscount = 0;
        if (coupon && subtotal > 0) {
            if (coupon.minOrder && subtotal < coupon.minOrder) {
                // Invalidate if subtotal dropped below requirement
                removeCoupon();
                coupon = null;
            } else {
                couponDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
            }
        }

        const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
        
        // Shipping calculation
        const freeShippingThreshold = cfg.freeShippingThreshold || 2999;
        const isFreeShipping = subtotal === 0 || discountedSubtotal >= freeShippingThreshold;
        const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : (cfg.standardShippingFee || 150);
        const freeShippingRemaining = isFreeShipping ? 0 : Math.max(0, freeShippingThreshold - discountedSubtotal);
        const freeShippingProgressPercent = Math.min(100, Math.round((discountedSubtotal / freeShippingThreshold) * 100));

        // 5% GST on textiles
        const taxRate = cfg.taxRatePercent || 5;
        const taxAmount = Math.round((discountedSubtotal * taxRate) / 100);

        // Overall savings (MRP savings + Coupon savings)
        const mrpSavings = Math.max(0, originalMrpTotal - subtotal);
        const totalSavings = mrpSavings + couponDiscount;

        const grandTotal = discountedSubtotal + taxAmount + shippingFee;

        return {
            items: detailedItems,
            totalItems,
            subtotal,
            originalMrpTotal,
            coupon,
            couponDiscount,
            discountedSubtotal,
            taxAmount,
            taxRate,
            isFreeShipping,
            freeShippingThreshold,
            freeShippingRemaining,
            freeShippingProgressPercent,
            shippingFee,
            mrpSavings,
            totalSavings,
            grandTotal
        };
    }

    // Cross-tab sync
    window.addEventListener("storage", function (e) {
        if (e.key === cfg.storageKeys.cart) {
            window.dispatchEvent(new CustomEvent("luxury-cart-updated"));
        } else if (e.key === cfg.storageKeys.wishlist) {
            window.dispatchEvent(new CustomEvent("luxury-wishlist-updated"));
        } else if (e.key === cfg.storageKeys.coupon) {
            window.dispatchEvent(new CustomEvent("luxury-coupon-updated"));
        }
    });

    // Public API
    window.LuxuryStore = {
        getCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getWishlist,
        isInWishlist,
        toggleWishlist,
        moveWishlistToCart,
        clearWishlist,
        getAppliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateTotals
    };

})(window);
