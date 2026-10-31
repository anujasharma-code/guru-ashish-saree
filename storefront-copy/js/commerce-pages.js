(() => {
    const cartCount = document.getElementById("cartCount");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    let toastTimer;

    function format(value) {
        return GASStore.formatPrice(value);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function notify(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function updateCartCount() {
        if (!cartCount) return;
        cartCount.textContent = GASStore.getCart().reduce(
            (total, item) => total + item.quantity,
            0
        );
    }

    function updateThemeIcon() {
        const icon = document.querySelector("#themeButton i");
        if (icon) {
            icon.className = document.body.classList.contains("dark")
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }
    }

    const savedTheme = localStorage.getItem("gas-theme");
    if (savedTheme === "dark") document.body.classList.add("dark");
    updateThemeIcon();
    document.getElementById("themeButton")?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains("dark");
        localStorage.setItem("gas-theme", dark ? "dark" : "light");
        updateThemeIcon();
    });

    const productRoot = document.getElementById("productDetail");
    const cartRoot = document.getElementById("cartPage");
    const checkoutRoot = document.getElementById("checkoutPage");
    const confirmationRoot = document.getElementById("confirmationPage");
    const wishlistRoot = document.getElementById("wishlistPage");

    function renderProduct() {
        const id = Number(new URLSearchParams(location.search).get("id"));
        const product = products.find(item => item.id === id);
        if (!product) {
            productRoot.innerHTML = `
                <section class="commerce-empty">
                    <h1>Saree not found</h1>
                    <p>This product link may be out of date.</p>
                    <a class="btn btn-dark" href="shop.html">Browse the collection</a>
                </section>`;
            return;
        }

        document.title = `${product.name} | Guru Aashish Saree`;
        const stock = GASStore.getAvailableStock(product.id);
        GASStore.recordRecentlyViewed(product.id);
        const suggestedOccasions = (product.suggestedOccasions || [])
            .map(escapeHTML)
            .join(", ");
        productRoot.innerHTML = `
            <nav class="commerce-breadcrumb" aria-label="Breadcrumb">
                <a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><span>${escapeHTML(product.name)}</span>
            </nav>
            <section class="product-detail">
                <div class="detail-gallery">
                    <img class="detail-main-image" id="detailMainImage" src="${escapeHTML(product.images[0])}" alt="${escapeHTML(product.name)}">
                    <div class="detail-thumbnails" aria-label="Product images">
                        ${product.images.map((image, index) => `
                            <button class="detail-thumbnail ${index === 0 ? "active" : ""}" type="button" data-image="${escapeHTML(image)}" aria-label="Show product image ${index + 1}">
                                <img src="${escapeHTML(image)}" alt="">
                            </button>`).join("")}
                    </div>
                </div>
                <div class="detail-copy">
                    <span class="commerce-eyebrow">${escapeHTML(product.category)}${product.badge ? ` · ${escapeHTML(product.badge)}` : ""}</span>
                    <h1>${escapeHTML(product.name)}</h1>
                    <div class="detail-price">
                        <strong>${format(product.price)}</strong>
                        ${product.oldPrice > product.price ? `<del>${format(product.oldPrice)}</del>` : ""}
                    </div>
                    <p class="detail-description">${escapeHTML(product.description)}</p>
                    <dl class="detail-facts">
                        <div><dt>Colour</dt><dd>${escapeHTML(product.color)}</dd></div>
                        <div><dt>Blouse piece</dt><dd>${product.blousePiece ? "Included" : "Not included"}</dd></div>
                        <div><dt>Suggested occasions</dt><dd>${suggestedOccasions || "Not specified"}</dd></div>
                        <div><dt>Availability</dt><dd class="${stock ? "stock-available" : "stock-unavailable"}">${stock ? `${stock} available` : "Out of stock"}</dd></div>
                    </dl>
                    <details class="product-guide">
                        <summary>Care & measurements</summary>
                        <p>Measurements, fabric composition and fall details are not specified in the current catalogue. Ask the store to confirm these before ordering.</p>
                        <p>Care guidance: follow the garment's care label. Do not machine wash unless the product label specifically allows it.</p>
                        <p class="product-data-note">Occasions shown are styling suggestions. Inventory and product information are browser-side demo data.</p>
                    </details>
                    <div class="detail-actions">
                        <label for="detailQuantity">Quantity</label>
                        <input id="detailQuantity" type="number" min="1" max="${Math.max(1, stock)}" value="1" ${stock ? "" : "disabled"}>
                        <button id="detailAddToBag" class="btn btn-dark" type="button" ${stock ? "" : "disabled"}>
                            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                        </button>
                    </div>
                    <p id="detailMessage" class="form-message" role="status" aria-live="polite"></p>
                    <button class="compare-toggle ${GASStore.getCompareList().includes(product.id) ? "selected" : ""}" type="button" data-id="${product.id}" aria-pressed="${GASStore.getCompareList().includes(product.id)}">
                        <i class="fa-solid fa-code-compare" aria-hidden="true"></i> Compare this saree
                    </button>
                    <button id="shareProduct" class="share-product" type="button">
                        <i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Share this saree
                    </button>
                    <a class="detail-cart-link" href="cart.html">View shopping bag</a>
                </div>
            </section>`;

        productRoot.querySelectorAll(".detail-thumbnail").forEach(button => {
            button.addEventListener("click", () => {
                productRoot.querySelector("#detailMainImage").src = button.dataset.image;
                productRoot.querySelectorAll(".detail-thumbnail").forEach(item =>
                    item.classList.toggle("active", item === button)
                );
            });
        });

        document.getElementById("detailAddToBag").addEventListener("click", () => {
            const quantity = Number(document.getElementById("detailQuantity").value);
            const result = GASStore.addToCart(product.id, quantity);
            const message = document.getElementById("detailMessage");
            message.textContent = result.message;
            message.classList.toggle("error", !result.ok);
            updateCartCount();
            if (result.ok) notify(result.message);
        });

        document.getElementById("shareProduct").addEventListener("click", async () => {
            const shareData = {
                title: product.name,
                text: `Take a look at ${product.name}.`,
                url: location.href
            };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareData.url);
                    notify("Product link copied.");
                } else {
                    notify("Sharing is not supported by this browser.");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Could not share the product link.", error);
                    notify("Could not share this product link.");
                }
            }
        });

        const structuredData = document.createElement("script");
        structuredData.type = "application/ld+json";
        structuredData.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images,
            color: product.color,
            offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: product.price,
                availability: stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
            }
        });
        document.head.appendChild(structuredData);
    }

    function renderCart() {
        const items = GASStore.getCartItems();
        if (!items.length) {
            cartRoot.innerHTML = `
                <section class="commerce-empty">
                    <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
                    <h2>Your bag is empty</h2>
                    <p>Find a saree for your next special occasion.</p>
                    <a class="btn btn-dark" href="shop.html">Explore Sarees</a>
                </section>`;
            return;
        }

        const totals = GASStore.getTotals();
        const subtotal = totals.subtotal;
        cartRoot.innerHTML = `
            <section class="cart-items" aria-label="Items in your bag">
                ${items.map(item => `
                    <article class="cart-item">
                        <a class="cart-item-image" href="product.html?id=${item.id}">
                            <img src="${escapeHTML(item.product.images[0])}" alt="${escapeHTML(item.product.name)}">
                        </a>
                        <div class="cart-item-info">
                            <span class="commerce-eyebrow">${escapeHTML(item.product.category)}</span>
                            <h2><a href="product.html?id=${item.id}">${escapeHTML(item.product.name)}</a></h2>
                            <p>${format(item.product.price)} each</p>
                            <p class="${item.availableStock ? "stock-available" : "stock-unavailable"}">
                                ${item.availableStock ? `${item.availableStock} available` : "Out of stock"}
                            </p>
                        </div>
                        <div class="cart-item-controls">
                            <label for="quantity-${item.id}">Qty</label>
                            <input id="quantity-${item.id}" class="cart-quantity" type="number" min="1" max="${Math.max(1, item.availableStock)}" value="${item.quantity}" data-id="${item.id}" aria-label="Quantity for ${escapeHTML(item.product.name)}">
                            <strong>${format(item.lineTotal)}</strong>
                            <button class="text-button remove-cart-item" type="button" data-id="${item.id}">Remove</button>
                        </div>
                    </article>`).join("")}
            </section>
            <aside class="cart-summary">
                <h2>Order summary</h2>
                <div class="summary-line"><span>Subtotal</span><strong>${format(subtotal)}</strong></div>
                <form id="couponForm" class="coupon-form">
                    <label for="couponCode">Coupon code</label>
                    <div class="coupon-input-row">
                        <input id="couponCode" name="coupon" type="text" maxlength="24" autocomplete="off" placeholder="Enter code" value="${totals.couponCode}">
                        <button class="coupon-apply" type="submit">Apply</button>
                        ${totals.couponCode ? '<button class="coupon-remove" id="removeCoupon" type="button">Remove</button>' : ""}
                    </div>
                    <small class="coupon-hint" role="status">${totals.couponCode ? "WELCOME10 applied: 10% off." : "Try WELCOME10 for 10% off."}</small>
                </form>
                ${totals.discount ? `<div class="summary-line discount-line"><span>WELCOME10 discount</span><strong>−${format(totals.discount)}</strong></div>` : ""}
                <div class="summary-line"><span>Shipping</span><span>${subtotal >= 999 ? "Free from ₹999 (demo)" : "To be confirmed by the store"}</span></div>
                <div class="shipping-progress" role="status" aria-live="polite">
                    <p>${subtotal >= 999 ? "You reached the demo's ₹999 free-shipping threshold." : `Add ${format(999 - subtotal)} to reach the demo's ₹999 free-shipping threshold.`}</p>
                    <div class="shipping-progress-track" aria-hidden="true"><span style="width:${Math.min(100, (subtotal / 999) * 100)}%"></span></div>
                    <small>The store confirms the actual shipping offer and charges.</small>
                </div>
                <div class="summary-line total-line"><span>Estimated total</span><strong>${format(totals.total)}</strong></div>
                <p class="checkout-note">Final shipping charges must be confirmed by the store before the order is accepted.</p>
                <a class="btn btn-dark checkout-button" href="checkout.html">Continue to delivery</a>
                <a class="continue-shopping" href="shop.html">Continue shopping</a>
            </aside>`;

        cartRoot.querySelectorAll(".cart-quantity").forEach(input => {
            input.addEventListener("change", () => {
                const result = GASStore.setQuantity(input.dataset.id, Number(input.value));
                if (!result.ok) notify(result.message);
                renderCart();
                updateCartCount();
            });
        });

        cartRoot.querySelectorAll(".remove-cart-item").forEach(button => {
            button.addEventListener("click", () => {
                GASStore.removeFromCart(button.dataset.id);
                renderCart();
                updateCartCount();
            });
        });

        cartRoot.querySelector("#couponForm")?.addEventListener("submit", event => {
            event.preventDefault();
            const result = GASStore.applyCoupon(new FormData(event.currentTarget).get("coupon"));
            notify(result.message);
        });
        cartRoot.querySelector("#removeCoupon")?.addEventListener("click", () => {
            GASStore.removeCoupon();
            notify("Coupon removed.");
        });
    }

    function renderCheckout() {
        const items = GASStore.getCartItems();
        if (!items.length) {
            checkoutRoot.innerHTML = `
                <section class="commerce-empty">
                    <h2>Your bag is empty</h2>
                    <a class="btn btn-dark" href="shop.html">Browse Sarees</a>
                </section>`;
            return;
        }
        const totals = GASStore.getTotals();
        const subtotal = totals.subtotal;
        checkoutRoot.innerHTML = `
            <div class="checkout-layout">
                <form id="checkoutForm" class="checkout-form">
                    <section class="checkout-section">
                        <h2>Delivery details</h2>
                        <div class="form-grid">
                            <label>Full name<input name="name" autocomplete="name" required maxlength="100"></label>
                            <label>Email address<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
                            <label>Phone number<input name="phone" type="tel" autocomplete="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number" required></label>
                            <label>PIN code<input name="pincode" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" title="Enter a 6-digit PIN code" required></label>
                            <label class="form-span">Address<input name="address" autocomplete="street-address" required maxlength="250"></label>
                            <label>City<input name="city" autocomplete="address-level2" required maxlength="100"></label>
                            <label>State<input name="state" autocomplete="address-level1" required maxlength="100"></label>
                        </div>
                    </section>
                    <section class="checkout-section">
                        <h2>Payment method</h2>
                        <label class="payment-choice"><input type="radio" name="payment" value="cod" checked> Cash on delivery</label>
                        <p class="checkout-note">Online payments are not available in this prototype. No payment is collected here.</p>
                    </section>
                    <p class="prototype-warning"><strong>WhatsApp order request:</strong> This prepares a message for you to review and send in WhatsApp. No order is submitted until you tap Send.</p>
                    <p id="checkoutMessage" class="form-message" role="alert"></p>
                    <button class="btn btn-dark checkout-button" type="submit">Prepare WhatsApp order</button>
                    <a class="btn btn-dark checkout-button whatsapp-order-link" id="whatsappOrderLink" href="#" target="_blank" rel="noopener noreferrer" hidden>
                        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Review and send in WhatsApp
                    </a>
                </form>
                <aside class="cart-summary checkout-summary">
                    <h2>Your order</h2>
                    ${items.map(item => `
                        <div class="summary-product">
                            <span>${escapeHTML(item.product.name)} <b>× ${item.quantity}</b></span>
                            <strong>${format(item.lineTotal)}</strong>
                        </div>`).join("")}
                    <div class="summary-line"><span>Subtotal</span><strong>${format(subtotal)}</strong></div>
                    ${totals.discount ? `<div class="summary-line discount-line"><span>WELCOME10 discount</span><strong>−${format(totals.discount)}</strong></div>` : ""}
                    <div class="summary-line"><span>Shipping</span><span>${subtotal >= 999 ? "Free from ₹999 (demo)" : "To be confirmed"}</span></div>
                    <div class="summary-line total-line"><span>Estimated total</span><strong>${format(totals.total)}</strong></div>
                    <p class="checkout-note">Shipping is confirmed by the store. The total above excludes shipping when its cost is not yet known.</p>
                    <a class="continue-shopping" href="cart.html">Edit shopping bag</a>
                </aside>
            </div>`;

        document.getElementById("checkoutForm").addEventListener("submit", event => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.reportValidity()) return;

            const values = new FormData(form);
            const shippingDetails = {
                name: String(values.get("name")).trim(),
                email: String(values.get("email")).trim(),
                phone: String(values.get("phone")).trim(),
                pincode: String(values.get("pincode")).trim(),
                address: String(values.get("address")).trim(),
                city: String(values.get("city")).trim(),
                state: String(values.get("state")).trim()
            };
            if (Object.values(shippingDetails).some(value => !value)) {
                const message = document.getElementById("checkoutMessage");
                message.textContent = "Complete every delivery field before continuing.";
                message.classList.add("error");
                return;
            }

            const totals = GASStore.getTotals();
            const orderMessage = [
                "Hello Guru Aashish Saree, I would like to request this order:",
                "",
                "ITEMS",
                ...items.map(item => `• ${item.product.name} × ${item.quantity} — ${format(item.lineTotal)}`),
                "",
                `Subtotal: ${format(totals.subtotal)}`,
                totals.couponCode ? `Coupon ${totals.couponCode}: −${format(totals.discount)}` : null,
                `Estimated total: ${format(totals.total)}`,
                `Shipping: ${totals.subtotal >= 999 ? "Free from ₹999 (demo)" : "To be confirmed by the store"}`,
                "",
                "DELIVERY DETAILS",
                shippingDetails.name,
                shippingDetails.address,
                `${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.pincode}`,
                `Phone: ${shippingDetails.phone}`,
                `Email: ${shippingDetails.email}`,
                `Payment preference: ${values.get("payment") === "cod" ? "Cash on delivery" : "To be discussed"}`,
                "",
                "Please confirm availability and final shipping charges."
            ].filter(line => line !== null).join("\n");
            const whatsappNumber = String(window.GAS_CONFIG?.whatsappNumber || "").replace(/\D/g, "");
            const whatsappBase = whatsappNumber
                ? `https://wa.me/${whatsappNumber}`
                : "https://wa.me/";
            const orderLink = document.getElementById("whatsappOrderLink");
            orderLink.href = `${whatsappBase}?text=${encodeURIComponent(orderMessage)}`;
            orderLink.hidden = false;
            const message = document.getElementById("checkoutMessage");
            message.textContent = "Your message is ready. Open WhatsApp, review the details, and tap Send to contact the store.";
            message.classList.remove("error");
        });
    }

    function renderConfirmation() {
        const orderId = new URLSearchParams(location.search).get("id");
        const order = orderId ? GASStore.getOrder(orderId) : null;
        if (!order) {
            confirmationRoot.innerHTML = `
                <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                <h1>No order request found</h1>
                <p>Order requests are stored only in the browser where they were created.</p>
                <a class="btn btn-dark" href="shop.html">Browse Sarees</a>`;
            return;
        }

        confirmationRoot.innerHTML = `
            <i class="fa-solid fa-circle-check confirmation-icon" aria-hidden="true"></i>
            <span class="commerce-eyebrow">DEMO ORDER REQUEST</span>
            <h1>Request saved</h1>
            <p>This request exists only in this browser. It has not been sent to the store and no payment was taken.</p>
            <p class="order-reference">Reference: <strong>${escapeHTML(order.id)}</strong></p>
            <div class="confirmation-details">
                <h2>Delivery details</h2>
                <p>${escapeHTML(order.shippingDetails.name)}</p>
                <p>${escapeHTML(order.shippingDetails.address)}, ${escapeHTML(order.shippingDetails.city)}, ${escapeHTML(order.shippingDetails.state)} ${escapeHTML(order.shippingDetails.pincode)}</p>
                <p>${escapeHTML(order.shippingDetails.email)} · ${escapeHTML(order.shippingDetails.phone)}</p>
            </div>
            <div class="confirmation-details">
                <h2>Items</h2>
                ${order.items.map(item => `
                    <div class="summary-product"><span>${escapeHTML(item.name)} <b>× ${item.quantity}</b></span><strong>${format(item.price * item.quantity)}</strong></div>`).join("")}
                <div class="summary-line"><span>Subtotal</span><strong>${format(order.subtotal)}</strong></div>
                <div class="summary-line"><span>Payment</span><strong>Cash on delivery (not yet confirmed)</strong></div>
            </div>
            <a class="btn btn-dark" href="shop.html">Continue shopping</a>`;
    }

    if (productRoot) renderProduct();
    if (cartRoot) renderCart();
    if (checkoutRoot) renderCheckout();
    if (confirmationRoot) renderConfirmation();
    if (wishlistRoot) wishlistRoot.setAttribute("aria-live", "polite");

    updateCartCount();
    window.addEventListener("gas-cart-updated", () => {
        updateCartCount();
        if (cartRoot) renderCart();
        if (checkoutRoot) renderCheckout();
    });
    window.addEventListener("gas-coupon-updated", () => {
        if (cartRoot) renderCart();
        if (checkoutRoot) renderCheckout();
    });
})();
