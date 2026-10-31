/**
 * User Interface & Interactivity Controller - Guru Aashish Luxury Sarees
 * Renders Product Grids, Quick View Modal, Drawers, Filtering, Sorting, and Toasts.
 */

(function (window) {
    "use strict";

    // Global UI state
    const state = {
        activeCategory: "all",
        searchQuery: "",
        sortBy: "featured",
        priceFilter: "all",
        activeQuickViewProduct: null,
        quickViewQty: 1
    };

    // ----------------------------------------------------
    // TOAST NOTIFICATIONS
    // ----------------------------------------------------
    function showToast(message, type = "success") {
        let container = document.getElementById("luxuryToastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "luxuryToastContainer";
            container.className = "luxury-toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `luxury-toast toast-${type}`;
        
        let icon = "fa-check";
        if (type === "warning") icon = "fa-triangle-exclamation";
        if (type === "info") icon = "fa-circle-info";
        if (type === "error") icon = "fa-circle-xmark";

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="toast-body">${message}</div>
            <button type="button" class="toast-close" aria-label="Close">&times;</button>
        `;

        toast.querySelector(".toast-close").addEventListener("click", () => {
            toast.classList.add("toast-hiding");
            setTimeout(() => toast.remove(), 300);
        });

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add("toast-hiding");
                setTimeout(() => toast.remove(), 300);
            }
        }, 3500);
    }

    // ----------------------------------------------------
    // BADGES & COUNTERS SYNC
    // ----------------------------------------------------
    function updateHeaderBadges() {
        const cartTotals = window.LuxuryStore.calculateTotals();
        const wishlist = window.LuxuryStore.getWishlist();

        // Cart counters
        document.querySelectorAll(".cart-counter-badge").forEach(badge => {
            badge.textContent = cartTotals.totalItems;
            badge.style.display = cartTotals.totalItems > 0 ? "inline-flex" : "none";
        });

        // Wishlist counters
        document.querySelectorAll(".wishlist-counter-badge").forEach(badge => {
            badge.textContent = wishlist.length;
            badge.style.display = wishlist.length > 0 ? "inline-flex" : "none";
        });
    }

    // ----------------------------------------------------
    // PRODUCT CARDS RENDERING
    // ----------------------------------------------------
    function createProductCardHTML(product) {
        const inWishlist = window.LuxuryStore.isInWishlist(product.id);
        const discountPercent = product.oldPrice 
            ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
            : 0;

        return `
            <article class="luxury-product-card" data-product-id="${product.id}" data-category="${product.category}">
                <div class="card-media">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                    ${discountPercent > 0 ? `<span class="discount-pill">${discountPercent}% OFF</span>` : ""}
                    
                    <button type="button" 
                            class="card-wishlist-btn ${inWishlist ? "is-active" : ""}" 
                            data-wishlist-id="${product.id}" 
                            aria-label="Add to wishlist" 
                            title="${inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}">
                        <i class="${inWishlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                    <div class="image-wrapper" onclick="LuxuryUI.openQuickView(${product.id})">
                        <img src="${product.images[0]}" 
                             alt="${product.name}" 
                             class="primary-image" 
                             loading="lazy" 
                             onerror="this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'">
                        ${product.images[1] ? `
                            <img src="${product.images[1]}" 
                                 alt="${product.name} detail" 
                                 class="hover-image" 
                                 loading="lazy">
                        ` : ""}
                    </div>

                    <div class="card-overlay-actions">
                        <button type="button" class="overlay-action-btn quick-view-btn" onclick="LuxuryUI.openQuickView(${product.id})">
                            <i class="fa-regular fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>

                <div class="card-content">
                    <div class="card-meta">
                        <span class="card-category">${product.categoryLabel || product.category}</span>
                        <div class="card-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${product.rating.toFixed(1)}</span>
                            <span class="reviews-count">(${product.reviews})</span>
                        </div>
                    </div>

                    <h3 class="card-title" onclick="LuxuryUI.openQuickView(${product.id})">
                        <a href="javascript:void(0);">${product.name}</a>
                    </h3>

                    <p class="card-fabric-snippet">${product.fabric}</p>

                    <div class="card-color-swatch-row">
                        <span class="swatch-circle" style="background-color: ${product.colorHex};" title="${product.color}"></span>
                        <span class="swatch-name">${product.color}</span>
                        <span class="stock-pill ${product.stock <= 3 ? "low-stock" : ""}">${product.stock <= 3 ? `Only ${product.stock} left` : "Ready to dispatch"}</span>
                    </div>

                    <div class="card-price-row">
                        <div class="prices">
                            <span class="current-price">₹${product.price.toLocaleString("en-IN")}</span>
                            ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>` : ""}
                        </div>
                    </div>

                    <div class="card-bottom-actions">
                        <button type="button" class="btn-card-add-bag" onclick="LuxuryUI.handleQuickAddToCart(${product.id})">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                        </button>
                        <button type="button" class="btn-card-whatsapp" onclick="WhatsAppCheckout.openWhatsAppOrderModal(${product.id}, 1)" title="Order directly via WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderProductGrid(targetElementId, productsList) {
        const container = document.getElementById(targetElementId);
        if (!container) return;

        if (!productsList || productsList.length === 0) {
            container.innerHTML = `
                <div class="empty-catalogue-state">
                    <div class="empty-icon"><i class="fa-solid fa-gem"></i></div>
                    <h3>No Sarees Found</h3>
                    <p>We couldn't find any sarees matching your search criteria. Try clearing some filters or searching for another fabric.</p>
                    <button type="button" class="luxury-btn btn-gold" onclick="LuxuryUI.resetFilters()">
                        View All Luxury Sarees
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = productsList.map(createProductCardHTML).join("");

        // Attach wishlist click events
        container.querySelectorAll(".card-wishlist-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const id = this.dataset.wishlistId;
                const result = window.LuxuryStore.toggleWishlist(id);
                this.classList.toggle("is-active", result.inWishlist);
                const icon = this.querySelector("i");
                if (result.inWishlist) {
                    icon.className = "fa-solid fa-heart";
                } else {
                    icon.className = "fa-regular fa-heart";
                }
                showToast(result.message, result.inWishlist ? "success" : "info");
                updateHeaderBadges();
            });
        });
    }

    // ----------------------------------------------------
    // FILTERING & SORTING LOGIC
    // ----------------------------------------------------
    function getFilteredProducts() {
        let list = [...window.SAREE_PRODUCTS];

        // 1. Category Filter
        if (state.activeCategory && state.activeCategory !== "all") {
            list = list.filter(p => p.category.toLowerCase() === state.activeCategory.toLowerCase());
        }

        // 2. Search Query
        if (state.searchQuery && state.searchQuery.trim()) {
            const q = state.searchQuery.toLowerCase().trim();
            list = list.filter(p => 
                p.name.toLowerCase().includes(q) ||
                p.fabric.toLowerCase().includes(q) ||
                p.color.toLowerCase().includes(q) ||
                (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
                (p.suggestedOccasions && p.suggestedOccasions.some(occ => occ.toLowerCase().includes(q)))
            );
        }

        // 3. Price Filter
        if (state.priceFilter && state.priceFilter !== "all") {
            if (state.priceFilter === "under-10000") {
                list = list.filter(p => p.price < 10000);
            } else if (state.priceFilter === "10000-15000") {
                list = list.filter(p => p.price >= 10000 && p.price <= 15000);
            } else if (state.priceFilter === "above-15000") {
                list = list.filter(p => p.price > 15000);
            }
        }

        // 4. Sorting
        if (state.sortBy === "price-low") {
            list.sort((a, b) => a.price - b.price);
        } else if (state.sortBy === "price-high") {
            list.sort((a, b) => b.price - a.price);
        } else if (state.sortBy === "rating") {
            list.sort((a, b) => b.rating - a.rating);
        } else if (state.sortBy === "new") {
            list.sort((a, b) => b.id - a.id);
        }

        return list;
    }

    function applyFiltersAndRender() {
        const filtered = getFilteredProducts();
        
        // Render on shop grid or featured grid
        if (document.getElementById("shopProductsGrid")) {
            renderProductGrid("shopProductsGrid", filtered);
        }
        if (document.getElementById("featuredProductsGrid")) {
            // For homepage, if no active search/category, show top featured sarees
            const featuredList = (state.activeCategory === "all" && !state.searchQuery)
                ? filtered.slice(0, 8)
                : filtered;
            renderProductGrid("featuredProductsGrid", featuredList);
        }

        // Update count indicator
        const countEl = document.getElementById("catalogResultsCount");
        if (countEl) {
            countEl.textContent = `Showing ${filtered.length} of ${window.SAREE_PRODUCTS.length} curated sarees`;
        }
    }

    function setCategoryFilter(category) {
        state.activeCategory = category;
        document.querySelectorAll(".category-pill-btn").forEach(btn => {
            btn.classList.toggle("is-active", btn.dataset.category === category);
        });
        applyFiltersAndRender();
    }

    function setSearchQuery(query) {
        state.searchQuery = query;
        applyFiltersAndRender();
    }

    function setSortBy(sortBy) {
        state.sortBy = sortBy;
        applyFiltersAndRender();
    }

    function setPriceFilter(priceRange) {
        state.priceFilter = priceRange;
        applyFiltersAndRender();
    }

    function resetFilters() {
        state.activeCategory = "all";
        state.searchQuery = "";
        state.sortBy = "featured";
        state.priceFilter = "all";

        const searchInput = document.getElementById("mainSearchInput");
        if (searchInput) searchInput.value = "";
        
        const sortSelect = document.getElementById("sortSelect");
        if (sortSelect) sortSelect.value = "featured";

        document.querySelectorAll(".category-pill-btn").forEach(btn => {
            btn.classList.toggle("is-active", btn.dataset.category === "all");
        });

        applyFiltersAndRender();
    }

    // ----------------------------------------------------
    // QUICK ADD TO BAG
    // ----------------------------------------------------
    function handleQuickAddToCart(productId) {
        const result = window.LuxuryStore.addToCart(productId, 1);
        if (result.success) {
            showToast(result.message, "success");
            updateHeaderBadges();
            openCartDrawer();
        } else {
            showToast(result.message, "warning");
        }
    }

    // ----------------------------------------------------
    // QUICK VIEW MODAL
    // ----------------------------------------------------
    function openQuickView(productId) {
        const product = window.getProductById(productId);
        if (!product) return;

        state.activeQuickViewProduct = product;
        state.quickViewQty = 1;

        const modal = document.getElementById("quickViewModal");
        if (!modal) return;

        const discountPercent = product.oldPrice 
            ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
            : 0;
        const inWishlist = window.LuxuryStore.isInWishlist(product.id);

        modal.innerHTML = `
            <div class="modal-backdrop" onclick="LuxuryUI.closeQuickView()"></div>
            <div class="quick-view-dialog">
                <button type="button" class="modal-close-btn" onclick="LuxuryUI.closeQuickView()" aria-label="Close modal">&times;</button>
                
                <div class="quick-view-grid">
                    <!-- Gallery Column -->
                    <div class="quick-view-gallery">
                        <div class="main-image-container">
                            <img id="qvMainImage" src="${product.images[0]}" alt="${product.name}">
                            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                        </div>
                        <div class="thumbnails-row">
                            ${product.images.map((img, idx) => `
                                <button type="button" 
                                        class="thumb-btn ${idx === 0 ? "is-active" : ""}" 
                                        onclick="LuxuryUI.switchQuickViewImage('${img}', this)">
                                    <img src="${img}" alt="Angle ${idx + 1}">
                                </button>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Details Column -->
                    <div class="quick-view-details">
                        <div class="qv-eyebrow">
                            <span class="qv-category">${product.categoryLabel || product.category}</span>
                            <span class="qv-stock ${product.stock <= 3 ? "low" : ""}">${product.stock <= 3 ? `Limited: Only ${product.stock} pieces remaining` : "In Stock - Ships Tomorrow"}</span>
                        </div>

                        <h2 class="qv-title">${product.name}</h2>

                        <div class="qv-rating-bar">
                            <div class="stars">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <span class="rating-text"><strong>${product.rating.toFixed(1)}</strong> (${product.reviews} verified reviews)</span>
                        </div>

                        <div class="qv-price-block">
                            <span class="qv-current-price">₹${product.price.toLocaleString("en-IN")}</span>
                            ${product.oldPrice ? `<span class="qv-old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>` : ""}
                            ${discountPercent > 0 ? `<span class="qv-discount-tag">${discountPercent}% OFF</span>` : ""}
                        </div>

                        <p class="qv-description">${product.description}</p>

                        <!-- Key Specifications -->
                        <div class="qv-specifications">
                            <div class="spec-row">
                                <span class="spec-label"><i class="fa-solid fa-certificate"></i> Fabric:</span>
                                <span class="spec-value">${product.fabric}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fa-solid fa-palette"></i> Color:</span>
                                <span class="spec-value"><span class="swatch-inline" style="background:${product.colorHex}"></span> ${product.color}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fa-solid fa-scissors"></i> Blouse Piece:</span>
                                <span class="spec-value">${product.blousePiece}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fa-solid fa-ruler-combined"></i> Length:</span>
                                <span class="spec-value">${product.length}</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label"><i class="fa-solid fa-shield-halved"></i> Care:</span>
                                <span class="spec-value">${product.care}</span>
                            </div>
                        </div>

                        <!-- Action Bar -->
                        <div class="qv-actions">
                            <div class="qv-qty-selector">
                                <button type="button" class="qty-btn" onclick="LuxuryUI.adjustQuickViewQty(-1)" aria-label="Decrease">&minus;</button>
                                <span id="qvQtyDisplay" class="qty-number">1</span>
                                <button type="button" class="qty-btn" onclick="LuxuryUI.adjustQuickViewQty(1)" aria-label="Increase">&#43;</button>
                            </div>

                            <button type="button" class="luxury-btn btn-gold btn-add-qv" onclick="LuxuryUI.addQuickViewToBag()">
                                <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                            </button>

                            <button type="button" class="qv-wishlist-toggle ${inWishlist ? "is-active" : ""}" 
                                    onclick="LuxuryUI.toggleQuickViewWishlist()" 
                                    aria-label="Wishlist">
                                <i class="${inWishlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
                            </button>
                        </div>

                        <!-- Direct WhatsApp Order CTA -->
                        <div class="qv-whatsapp-box">
                            <button type="button" class="luxury-btn btn-whatsapp-direct" onclick="LuxuryUI.orderQuickViewViaWhatsApp()">
                                <i class="fa-brands fa-whatsapp"></i> Buy Now via WhatsApp Concierge
                            </button>
                            <span class="wa-helper-hint">Instant confirmation & personalized assistance with our silk masters</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeQuickView() {
        const modal = document.getElementById("quickViewModal");
        if (modal) {
            modal.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    }

    function switchQuickViewImage(newSrc, thumbEl) {
        const mainImg = document.getElementById("qvMainImage");
        if (mainImg) mainImg.src = newSrc;
        const parent = thumbEl.parentElement;
        if (parent) {
            parent.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("is-active"));
            thumbEl.classList.add("is-active");
        }
    }

    function adjustQuickViewQty(delta) {
        if (!state.activeQuickViewProduct) return;
        const maxStock = state.activeQuickViewProduct.stock;
        let newQty = state.quickViewQty + delta;
        if (newQty < 1) newQty = 1;
        if (newQty > maxStock) {
            newQty = maxStock;
            showToast(`Maximum ${maxStock} pieces available for this saree.`, "warning");
        }
        state.quickViewQty = newQty;
        const display = document.getElementById("qvQtyDisplay");
        if (display) display.textContent = newQty;
    }

    function addQuickViewToBag() {
        if (!state.activeQuickViewProduct) return;
        const result = window.LuxuryStore.addToCart(state.activeQuickViewProduct.id, state.quickViewQty);
        if (result.success) {
            showToast(result.message, "success");
            updateHeaderBadges();
            closeQuickView();
            openCartDrawer();
        } else {
            showToast(result.message, "warning");
        }
    }

    function toggleQuickViewWishlist() {
        if (!state.activeQuickViewProduct) return;
        const result = window.LuxuryStore.toggleWishlist(state.activeQuickViewProduct.id);
        showToast(result.message, result.inWishlist ? "success" : "info");
        updateHeaderBadges();
        
        const btn = document.querySelector(".qv-wishlist-toggle");
        if (btn) {
            btn.classList.toggle("is-active", result.inWishlist);
            btn.querySelector("i").className = result.inWishlist ? "fa-solid fa-heart" : "fa-regular fa-heart";
        }
    }

    function orderQuickViewViaWhatsApp() {
        if (!state.activeQuickViewProduct) return;
        const prodId = state.activeQuickViewProduct.id;
        const qty = state.quickViewQty;
        closeQuickView();
        window.WhatsAppCheckout.openWhatsAppOrderModal(prodId, qty);
    }

    // ----------------------------------------------------
    // CART DRAWER (SLIDE-OUT SHOPPING BAG)
    // ----------------------------------------------------
    function openCartDrawer() {
        renderCartDrawerContents();
        const drawer = document.getElementById("luxuryCartDrawer");
        if (drawer) {
            drawer.classList.add("is-open");
            document.body.style.overflow = "hidden";
        }
    }

    function closeCartDrawer() {
        const drawer = document.getElementById("luxuryCartDrawer");
        if (drawer) {
            drawer.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    }

    function renderCartDrawerContents() {
        const drawerBody = document.getElementById("cartDrawerBody");
        const drawerFooter = document.getElementById("cartDrawerFooter");
        if (!drawerBody || !drawerFooter) return;

        const totals = window.LuxuryStore.calculateTotals();

        if (totals.totalItems === 0) {
            drawerBody.innerHTML = `
                <div class="empty-drawer-state">
                    <div class="empty-icon"><i class="fa-solid fa-bag-shopping"></i></div>
                    <h3>Your Bag is Empty</h3>
                    <p>Discover our handpicked collection of royal heritage sarees and add your favorites.</p>
                    <button type="button" class="luxury-btn btn-gold" onclick="LuxuryUI.closeCartDrawer()">
                        Explore Heritage Sarees
                    </button>
                </div>
            `;
            drawerFooter.innerHTML = "";
            return;
        }

        // Free shipping progress header
        let freeShippingHTML = "";
        if (totals.isFreeShipping) {
            freeShippingHTML = `
                <div class="free-shipping-card unlocked">
                    <div class="shipping-info">
                        <i class="fa-solid fa-truck-fast"></i>
                        <span><strong>Complimentary Luxury Insured Delivery Unlocked!</strong></span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: 100%;"></div>
                    </div>
                </div>
            `;
        } else {
            freeShippingHTML = `
                <div class="free-shipping-card pending">
                    <div class="shipping-info">
                        <i class="fa-solid fa-truck-fast"></i>
                        <span>Add <strong>₹${totals.freeShippingRemaining.toLocaleString("en-IN")}</strong> more to enjoy <strong>FREE Insured Shipping</strong></span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${totals.freeShippingProgressPercent}%;"></div>
                    </div>
                </div>
            `;
        }

        // Cart items list
        let itemsHTML = `
            ${freeShippingHTML}
            <div class="drawer-items-list">
        `;

        totals.items.forEach(item => {
            itemsHTML += `
                <div class="drawer-item-row" data-id="${item.id}">
                    <div class="item-thumb" onclick="LuxuryUI.openQuickView(${item.id})">
                        <img src="${item.product.images[0]}" alt="${item.product.name}">
                    </div>
                    <div class="item-info">
                        <h4 class="item-title" onclick="LuxuryUI.openQuickView(${item.id})">${item.product.name}</h4>
                        <span class="item-fabric-tag">${item.product.fabric}</span>
                        <div class="item-price-unit">
                            <span>₹${item.unitPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div class="item-actions-row">
                            <div class="qty-pill">
                                <button type="button" class="qty-btn" onclick="LuxuryUI.handleDrawerQtyChange(${item.id}, ${item.quantity - 1})" aria-label="Decrease">&minus;</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button type="button" class="qty-btn" onclick="LuxuryUI.handleDrawerQtyChange(${item.id}, ${item.quantity + 1})" aria-label="Increase">&#43;</button>
                            </div>
                            <button type="button" class="item-remove-btn" onclick="LuxuryUI.handleDrawerRemoveItem(${item.id})" title="Remove item">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <div class="item-subtotal">
                        ₹${item.lineTotal.toLocaleString("en-IN")}
                    </div>
                </div>
            `;
        });

        itemsHTML += `</div>`;
        drawerBody.innerHTML = itemsHTML;

        // Coupon and Totals Footer
        const coupon = totals.coupon;
        let couponHTML = "";
        if (coupon) {
            couponHTML = `
                <div class="applied-coupon-pill">
                    <div class="coupon-tag-info">
                        <i class="fa-solid fa-tag"></i>
                        <span>Code <strong>${coupon.code}</strong> applied (${coupon.discountPercent}% OFF)</span>
                    </div>
                    <button type="button" class="btn-remove-coupon" onclick="LuxuryUI.handleRemoveCoupon()" title="Remove coupon">&times;</button>
                </div>
            `;
        } else {
            couponHTML = `
                <div class="coupon-input-box">
                    <input type="text" id="drawerCouponInput" placeholder="Enter coupon code (e.g. WELCOME10)" uppercase>
                    <button type="button" class="luxury-btn btn-coupon-apply" onclick="LuxuryUI.handleApplyCoupon()">Apply</button>
                </div>
                <div class="promo-quick-apply" onclick="LuxuryUI.quickApplyWelcome10()">
                    <span>🎁 Click to apply demo coupon: <strong>WELCOME10</strong> (10% OFF)</span>
                </div>
            `;
        }

        drawerFooter.innerHTML = `
            <div class="drawer-coupon-section">
                ${couponHTML}
            </div>

            <div class="drawer-totals-breakdown">
                <div class="total-line">
                    <span>Subtotal (${totals.totalItems} saree${totals.totalItems > 1 ? "s" : ""}):</span>
                    <span>₹${totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
                ${totals.couponDiscount > 0 ? `
                    <div class="total-line discount-line">
                        <span>Coupon Savings (${coupon.code}):</span>
                        <span>-₹${totals.couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                ` : ""}
                <div class="total-line">
                    <span>GST (5% Textile):</span>
                    <span>₹${totals.taxAmount.toLocaleString("en-IN")}</span>
                </div>
                <div class="total-line">
                    <span>Insured Shipping:</span>
                    <span>${totals.shippingFee === 0 ? '<strong class="free-text">FREE</strong>' : '₹' + totals.shippingFee}</span>
                </div>
                <div class="total-line grand-total-line">
                    <span>Grand Total:</span>
                    <span>₹${totals.grandTotal.toLocaleString("en-IN")}</span>
                </div>
            </div>

            <div class="drawer-cta-stack">
                <button type="button" class="luxury-btn btn-whatsapp-checkout btn-block" onclick="LuxuryUI.proceedToWhatsAppOrder()">
                    <i class="fa-brands fa-whatsapp"></i> Order Bag via WhatsApp
                </button>
                <div class="drawer-aux-links">
                    <a href="cart.html" class="drawer-link-cart">View Full Bag Page</a>
                    <a href="checkout.html" class="drawer-link-checkout">Standard Checkout &rarr;</a>
                </div>
            </div>
        `;
    }

    function handleDrawerQtyChange(productId, newQty) {
        const res = window.LuxuryStore.updateCartQuantity(productId, newQty);
        if (res.message) {
            showToast(res.message, res.removed ? "info" : "warning");
        }
        updateHeaderBadges();
        renderCartDrawerContents();
    }

    function handleDrawerRemoveItem(productId) {
        const res = window.LuxuryStore.removeFromCart(productId);
        showToast("Item removed from bag.", "info");
        updateHeaderBadges();
        renderCartDrawerContents();
    }

    function handleApplyCoupon() {
        const input = document.getElementById("drawerCouponInput");
        if (!input) return;
        const code = input.value.trim();
        const res = window.LuxuryStore.applyCoupon(code);
        if (res.success) {
            showToast(res.message, "success");
            renderCartDrawerContents();
        } else {
            showToast(res.message, "warning");
        }
    }

    function quickApplyWelcome10() {
        const res = window.LuxuryStore.applyCoupon("WELCOME10");
        if (res.success) {
            showToast(res.message, "success");
            renderCartDrawerContents();
        } else {
            showToast(res.message, "warning");
        }
    }

    function handleRemoveCoupon() {
        window.LuxuryStore.removeCoupon();
        showToast("Coupon removed.", "info");
        renderCartDrawerContents();
    }

    function proceedToWhatsAppOrder() {
        closeCartDrawer();
        window.WhatsAppCheckout.openWhatsAppOrderModal();
    }

    // ----------------------------------------------------
    // WISHLIST DRAWER (SLIDE-OUT)
    // ----------------------------------------------------
    function openWishlistDrawer() {
        renderWishlistDrawerContents();
        const drawer = document.getElementById("luxuryWishlistDrawer");
        if (drawer) {
            drawer.classList.add("is-open");
            document.body.style.overflow = "hidden";
        }
    }

    function closeWishlistDrawer() {
        const drawer = document.getElementById("luxuryWishlistDrawer");
        if (drawer) {
            drawer.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    }

    function renderWishlistDrawerContents() {
        const body = document.getElementById("wishlistDrawerBody");
        if (!body) return;

        const wishlistIds = window.LuxuryStore.getWishlist();
        if (wishlistIds.length === 0) {
            body.innerHTML = `
                <div class="empty-drawer-state">
                    <div class="empty-icon"><i class="fa-regular fa-heart"></i></div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Save sarees you love by tapping the heart icon on any piece.</p>
                    <button type="button" class="luxury-btn btn-gold" onclick="LuxuryUI.closeWishlistDrawer()">
                        Browse Sarees
                    </button>
                </div>
            `;
            return;
        }

        let html = `<div class="drawer-items-list">`;
        wishlistIds.forEach(id => {
            const product = window.getProductById(id);
            if (!product) return;

            html += `
                <div class="drawer-item-row" data-id="${product.id}">
                    <div class="item-thumb" onclick="LuxuryUI.openQuickView(${product.id})">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="item-info">
                        <h4 class="item-title" onclick="LuxuryUI.openQuickView(${product.id})">${product.name}</h4>
                        <div class="item-price-unit">
                            <span>₹${product.price.toLocaleString("en-IN")}</span>
                            ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>` : ""}
                        </div>
                        <div class="wishlist-row-actions">
                            <button type="button" class="luxury-btn btn-sm btn-gold" onclick="LuxuryUI.handleWishlistMoveToBag(${product.id})">
                                <i class="fa-solid fa-bag-shopping"></i> Move to Bag
                            </button>
                            <button type="button" class="item-remove-btn" onclick="LuxuryUI.handleWishlistRemove(${product.id})" title="Remove">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        body.innerHTML = html;
    }

    function handleWishlistMoveToBag(productId) {
        const res = window.LuxuryStore.moveWishlistToCart(productId);
        if (res.success) {
            showToast("Moved saree to your shopping bag!", "success");
            updateHeaderBadges();
            renderWishlistDrawerContents();
            openCartDrawer();
        } else {
            showToast(res.message, "warning");
        }
    }

    function handleWishlistRemove(productId) {
        const res = window.LuxuryStore.toggleWishlist(productId);
        showToast(res.message, "info");
        updateHeaderBadges();
        renderWishlistDrawerContents();
        // Also update any visible card hearts
        document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
            btn.classList.remove("is-active");
            btn.querySelector("i").className = "fa-regular fa-heart";
        });
    }

    // ----------------------------------------------------
    // INITIALIZATION & EVENT HOOKS
    // ----------------------------------------------------
    function init() {
        updateHeaderBadges();

        // Listen for storage updates
        window.addEventListener("luxury-cart-updated", () => {
            updateHeaderBadges();
            if (document.getElementById("luxuryCartDrawer") && document.getElementById("luxuryCartDrawer").classList.contains("is-open")) {
                renderCartDrawerContents();
            }
        });

        window.addEventListener("luxury-wishlist-updated", () => {
            updateHeaderBadges();
            if (document.getElementById("luxuryWishlistDrawer") && document.getElementById("luxuryWishlistDrawer").classList.contains("is-open")) {
                renderWishlistDrawerContents();
            }
        });

        window.addEventListener("luxury-coupon-updated", () => {
            if (document.getElementById("luxuryCartDrawer") && document.getElementById("luxuryCartDrawer").classList.contains("is-open")) {
                renderCartDrawerContents();
            }
        });

        // Search bar live listener
        const mainSearch = document.getElementById("mainSearchInput");
        if (mainSearch) {
            mainSearch.addEventListener("input", (e) => {
                setSearchQuery(e.target.value);
            });
        }

        // Sort selector listener
        const sortSelect = document.getElementById("sortSelect");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                setSortBy(e.target.value);
            });
        }

        // Initial render if grids exist
        applyFiltersAndRender();
    }

    // DOM Ready execution
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Public UI namespace
    window.LuxuryUI = {
        showToast,
        updateHeaderBadges,
        renderProductGrid,
        applyFiltersAndRender,
        setCategoryFilter,
        setSearchQuery,
        setSortBy,
        setPriceFilter,
        resetFilters,
        handleQuickAddToCart,
        openQuickView,
        closeQuickView,
        switchQuickViewImage,
        adjustQuickViewQty,
        addQuickViewToBag,
        toggleQuickViewWishlist,
        orderQuickViewViaWhatsApp,
        openCartDrawer,
        closeCartDrawer,
        renderCartDrawerContents,
        handleDrawerQtyChange,
        handleDrawerRemoveItem,
        handleApplyCoupon,
        quickApplyWelcome10,
        handleRemoveCoupon,
        proceedToWhatsAppOrder,
        openWishlistDrawer,
        closeWishlistDrawer,
        renderWishlistDrawerContents,
        handleWishlistMoveToBag,
        handleWishlistRemove
    };

})(window);
