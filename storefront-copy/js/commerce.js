/* Shared browser-side cart and inventory for the storefront prototype. */

(() => {
    const CART_KEY = "gas-cart";
    const INVENTORY_KEY = "gas-inventory";
    const ORDERS_KEY = "gas-orders";
    const WISHLIST_KEY = "gas-wishlist";
    const RECENT_KEY = "gas-recently-viewed";
    const COMPARE_KEY = "gas-compare";
    const COUPON_KEY = "gas-coupon";
    const COUPON_CODE = "WELCOME10";

    function readJSON(key, fallback) {
        const value = localStorage.getItem(key);
        if (!value) return fallback;

        try {
            return JSON.parse(value);
        } catch (error) {
            console.error(`Could not read ${key} from browser storage.`, error);
            return fallback;
        }
    }

    function productById(id) {
        return products.find(product => product.id === Number(id));
    }

    function getCart() {
        const cart = readJSON(CART_KEY, []);
        if (!Array.isArray(cart)) return [];

        return cart
            .filter(item =>
                item &&
                Number.isInteger(Number(item.id)) &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0 &&
                productById(item.id)
            )
            .map(item => ({
                id: Number(item.id),
                quantity: Number(item.quantity)
            }));
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent("gas-cart-updated"));
    }

    function getInventory() {
        const savedInventory = readJSON(INVENTORY_KEY, {});
        return savedInventory && typeof savedInventory === "object"
            ? savedInventory
            : {};
    }

    function getAvailableStock(id) {
        const product = productById(id);
        if (!product) return 0;

        const savedStock = getInventory()[product.id];
        return Number.isInteger(savedStock) && savedStock >= 0
            ? savedStock
            : product.stock;
    }

    function getCartItems() {
        return getCart().map(item => {
            const product = productById(item.id);
            return {
                ...item,
                product,
                availableStock: getAvailableStock(item.id),
                lineTotal: product.price * item.quantity
            };
        });
    }

    function getSubtotal() {
        return getCartItems().reduce(
            (total, item) => total + item.lineTotal,
            0
        );
    }

    function getCouponCode() {
        return localStorage.getItem(COUPON_KEY) === COUPON_CODE
            ? COUPON_CODE
            : "";
    }

    function applyCoupon(code) {
        const subtotal = getSubtotal();
        if (!subtotal) {
            return { ok: false, message: "Add a saree to your bag before applying a coupon." };
        }
        if (String(code).trim().toUpperCase() !== COUPON_CODE) {
            return { ok: false, message: "That coupon code is not valid. Try WELCOME10." };
        }

        localStorage.setItem(COUPON_KEY, COUPON_CODE);
        window.dispatchEvent(new CustomEvent("gas-coupon-updated"));
        return { ok: true, message: "WELCOME10 applied — 10% off your subtotal." };
    }

    function removeCoupon() {
        localStorage.removeItem(COUPON_KEY);
        window.dispatchEvent(new CustomEvent("gas-coupon-updated"));
    }

    function getTotals() {
        const subtotal = getSubtotal();
        const couponCode = getCouponCode();
        const discount = couponCode ? Math.round(subtotal * 0.1) : 0;
        return {
            subtotal,
            couponCode,
            discount,
            total: Math.max(0, subtotal - discount)
        };
    }

    function addToCart(id, quantity = 1) {
        const product = productById(id);
        const amount = Number(quantity);
        if (!product || !Number.isInteger(amount) || amount < 1) {
            return { ok: false, message: "This product or quantity is not valid." };
        }

        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);
        const nextQuantity = (existing?.quantity || 0) + amount;
        const availableStock = getAvailableStock(product.id);

        if (nextQuantity > availableStock) {
            return {
                ok: false,
                message: availableStock
                    ? `Only ${availableStock} available.`
                    : "This saree is currently out of stock."
            };
        }

        if (existing) {
            existing.quantity = nextQuantity;
        } else {
            cart.push({ id: product.id, quantity: amount });
        }

        saveCart(cart);
        return { ok: true, message: `${product.name} added to your bag.` };
    }

    function setQuantity(id, quantity) {
        const product = productById(id);
        const amount = Number(quantity);
        const cart = getCart();
        const item = cart.find(entry => entry.id === Number(id));

        if (!product || !item || !Number.isInteger(amount)) {
            return { ok: false, message: "The cart item could not be updated." };
        }

        if (amount < 1) {
            return removeFromCart(id);
        }

        const availableStock = getAvailableStock(id);
        if (amount > availableStock) {
            return {
                ok: false,
                message: availableStock
                    ? `Only ${availableStock} available.`
                    : "This saree is currently out of stock."
            };
        }

        item.quantity = amount;
        saveCart(cart);
        return { ok: true };
    }

    function removeFromCart(id) {
        const cart = getCart().filter(item => item.id !== Number(id));
        saveCart(cart);
        return { ok: true };
    }

    function placeOrder(shippingDetails, paymentMethod) {
        const items = getCartItems();
        if (!items.length) {
            return { ok: false, message: "Your bag is empty." };
        }

        for (const item of items) {
            if (item.quantity > item.availableStock) {
                return {
                    ok: false,
                    message: `${item.product.name} has only ${item.availableStock} available. Please update your bag.`
                };
            }
        }

        if (paymentMethod !== "cod") {
            return { ok: false, message: "Choose an available payment method." };
        }

        const inventory = getInventory();
        items.forEach(item => {
            inventory[item.id] = item.availableStock - item.quantity;
        });

        const order = {
            id: `GAS-${Date.now().toString(36).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            items: items.map(item => ({
                id: item.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.images[0]
            })),
            subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
            paymentMethod,
            shippingDetails
        };

        const orders = readJSON(ORDERS_KEY, []);
        const savedOrders = Array.isArray(orders) ? orders : [];
        savedOrders.push(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(savedOrders));
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
        saveCart([]);

        return { ok: true, order };
    }

    function getOrder(id) {
        const orders = readJSON(ORDERS_KEY, []);
        if (!Array.isArray(orders)) return null;
        return orders.find(order => order.id === id) || null;
    }

    function formatPrice(amount) {
        return `₹${Number(amount).toLocaleString("en-IN")}`;
    }

    function getProductIds(key) {
        const ids = readJSON(key, []);
        if (!Array.isArray(ids)) return [];
        return [...new Set(ids.map(Number).filter(id => productById(id)))];
    }

    function getWishlist() {
        return getProductIds(WISHLIST_KEY);
    }

    function toggleWishlist(id) {
        const product = productById(id);
        if (!product) return { ok: false, saved: false };

        const wishlist = getWishlist();
        const exists = wishlist.includes(product.id);
        const next = exists
            ? wishlist.filter(item => item !== product.id)
            : [...wishlist, product.id];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("gas-wishlist-updated"));
        return { ok: true, saved: !exists };
    }

    function getRecentlyViewed() {
        return getProductIds(RECENT_KEY);
    }

    function recordRecentlyViewed(id) {
        const product = productById(id);
        if (!product) return;
        const next = [
            product.id,
            ...getRecentlyViewed().filter(item => item !== product.id)
        ].slice(0, 8);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }

    function getCompareList() {
        return getProductIds(COMPARE_KEY).slice(0, 3);
    }

    function toggleCompare(id) {
        const product = productById(id);
        if (!product) return { ok: false, selected: false };

        const compare = getCompareList();
        if (compare.includes(product.id)) {
            localStorage.setItem(
                COMPARE_KEY,
                JSON.stringify(compare.filter(item => item !== product.id))
            );
            window.dispatchEvent(new CustomEvent("gas-compare-updated"));
            return { ok: true, selected: false };
        }

        if (compare.length >= 3) {
            return { ok: false, selected: false, message: "Compare up to three sarees at a time." };
        }

        localStorage.setItem(COMPARE_KEY, JSON.stringify([...compare, product.id]));
        window.dispatchEvent(new CustomEvent("gas-compare-updated"));
        return { ok: true, selected: true };
    }

    window.GASStore = {
        getCart,
        getCartItems,
        getAvailableStock,
        getSubtotal,
        getCouponCode,
        applyCoupon,
        removeCoupon,
        getTotals,
        addToCart,
        setQuantity,
        removeFromCart,
        placeOrder,
        getOrder,
        formatPrice,
        getWishlist,
        toggleWishlist,
        getRecentlyViewed,
        recordRecentlyViewed,
        getCompareList,
        toggleCompare
    };
})();
