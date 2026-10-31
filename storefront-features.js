(() => {
    const compareTray = document.createElement("aside");
    compareTray.className = "compare-tray";
    compareTray.setAttribute("aria-live", "polite");
    compareTray.hidden = true;
    document.body.appendChild(compareTray);

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function price(value) {
        return GASStore.formatPrice(value);
    }

    function productCard(product, showRemove = false) {
        const selected = GASStore.getCompareList().includes(product.id);
        const saved = GASStore.getWishlist().includes(product.id);
        return `
            <article class="product-card feature-product-card">
                <div class="product-image">
                    <a href="product.html?id=${product.id}" tabindex="-1" aria-hidden="true">
                        <img src="${escapeHTML(product.images[0])}" alt="" loading="lazy">
                    </a>
                    <button class="feature-wishlist" type="button" data-id="${product.id}" aria-label="${saved ? "Remove from wishlist" : "Add to wishlist"}" aria-pressed="${saved}">
                        <i class="${saved ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category">${escapeHTML(product.category)}</span>
                    <h3 class="product-name"><a href="product.html?id=${product.id}">${escapeHTML(product.name)}</a></h3>
                    <div class="product-price"><span class="price">${price(product.price)}</span>${product.oldPrice > product.price ? `<del class="old-price">${price(product.oldPrice)}</del>` : ""}</div>
                    <div class="feature-card-actions">
                        <a class="feature-detail-link" href="product.html?id=${product.id}">View details</a>
                        ${showRemove ? `<button class="feature-remove" type="button" data-id="${product.id}">Remove</button>` : ""}
                        <button class="compare-toggle ${selected ? "selected" : ""}" type="button" data-id="${product.id}" aria-pressed="${selected}">
                            <i class="fa-solid fa-code-compare" aria-hidden="true"></i>
                            ${selected ? "Added to compare" : "Compare"}
                        </button>
                    </div>
                </div>
            </article>`;
    }

    function renderWishlist() {
        const count = GASStore.getWishlist().length;
        document.querySelectorAll("#wishlistCount").forEach(element => {
            element.textContent = count;
        });

        const root = document.getElementById("wishlistPage");
        if (!root) return;
        const items = GASStore.getWishlist()
            .map(id => products.find(product => product.id === id))
            .filter(Boolean);

        root.innerHTML = items.length
            ? `<div class="product-grid feature-product-grid">${items.map(product => productCard(product, true)).join("")}</div>`
            : `<section class="commerce-empty">
                    <i class="fa-regular fa-heart" aria-hidden="true"></i>
                    <h2>Your wishlist is waiting</h2>
                    <p>Save the sarees you love and find them here later on this device.</p>
                    <a class="btn btn-dark" href="shop.html">Explore Sarees</a>
                </section>`;
    }

    function renderRecentProducts() {
        const currentId = Number(new URLSearchParams(location.search).get("id"));
        const ids = GASStore.getRecentlyViewed()
            .filter(id => !currentId || id !== currentId);
        if (!ids.length) return;
        const items = ids
            .map(id => products.find(product => product.id === id))
            .filter(Boolean);
        if (!items.length) return;

        const section = document.createElement("section");
        section.className = "feature-section";
        section.innerHTML = `
            <div class="feature-section-heading">
                <span class="commerce-eyebrow">PICK UP WHERE YOU LEFT OFF</span>
                <h2>Recently viewed</h2>
            </div>
            <div class="product-grid feature-product-grid">
                ${items.slice(0, 4).map(product => productCard(product)).join("")}
            </div>`;

        const productRoot = document.getElementById("productDetail");
        const shopRoot = document.querySelector(".shop-container");
        const homeFeatured = document.getElementById("featured");
        const wishlistRoot = document.getElementById("wishlistPage");
        const target = productRoot || shopRoot || wishlistRoot;
        if (target) {
            target.insertAdjacentElement("afterend", section);
        } else if (homeFeatured) {
            homeFeatured.insertAdjacentElement("afterend", section);
        }
    }

    function renderRecommendations() {
        const root = document.getElementById("productDetail");
        if (!root) return;
        const viewedId = Number(new URLSearchParams(location.search).get("id"));
        const viewed = products.find(product => product.id === viewedId);
        if (!viewed) return;
        const related = products
            .filter(product => product.id !== viewed.id && product.category === viewed.category)
            .slice(0, 4);
        if (!related.length) return;
        const section = document.createElement("section");
        section.className = "feature-section related-products";
        section.innerHTML = `
            <div class="feature-section-heading">
                <span class="commerce-eyebrow">CURATED FOR YOU</span>
                <h2>More ${escapeHTML(viewed.category)} styles</h2>
            </div>
            <div class="product-grid feature-product-grid">
                ${related.map(product => productCard(product)).join("")}
            </div>`;
        root.appendChild(section);
    }

    function syncProductButtons() {
        const saved = new Set(GASStore.getWishlist());
        const compared = new Set(GASStore.getCompareList());
        document.querySelectorAll(".wishlist-button, .shop-wishlist").forEach(button => {
            const selected = saved.has(Number(button.dataset.id));
            button.setAttribute("aria-pressed", String(selected));
            button.setAttribute("aria-label", selected ? "Remove from wishlist" : "Add to wishlist");
            button.title = selected ? "Remove from wishlist" : "Add to wishlist";
            const icon = button.querySelector("i");
            if (icon) icon.className = `${selected ? "fa-solid" : "fa-regular"} fa-heart`;
        });
        document.querySelectorAll(".compare-toggle").forEach(button => {
            const selected = compared.has(Number(button.dataset.id));
            button.classList.toggle("selected", selected);
            button.setAttribute("aria-pressed", String(selected));
            button.innerHTML = `<i class="fa-solid fa-code-compare" aria-hidden="true"></i>${selected ? " Added to compare" : " Compare"}`;
        });
        renderWishlist();
        renderCompareTray();
    }

    function renderCompareTray() {
        const ids = GASStore.getCompareList();
        compareTray.hidden = ids.length === 0;
        if (!ids.length) return;
        compareTray.innerHTML = `
            <span>${ids.length} of 3 sarees selected</span>
            <button class="btn btn-dark compare-open" type="button">Compare now</button>
            <button class="compare-clear" type="button">Clear</button>`;
        compareTray.querySelector(".compare-open").addEventListener("click", openComparison);
        compareTray.querySelector(".compare-clear").addEventListener("click", () => {
            localStorage.setItem("gas-compare", "[]");
            window.dispatchEvent(new CustomEvent("gas-compare-updated"));
        });
    }

    function openComparison() {
        const selected = GASStore.getCompareList()
            .map(id => products.find(product => product.id === id))
            .filter(Boolean);
        if (!selected.length) return;

        document.getElementById("comparisonDialog")?.remove();
        const dialog = document.createElement("dialog");
        dialog.id = "comparisonDialog";
        dialog.className = "comparison-dialog";
        const rows = [
            ["Price", product => price(product.price)],
            ["Category", product => escapeHTML(product.category)],
            ["Colour", product => escapeHTML(product.color)],
            ["Blouse piece", product => product.blousePiece ? "Included" : "Not included"],
            ["Availability", product => `${GASStore.getAvailableStock(product.id)} currently listed`],
            ["Suggested occasions", product => escapeHTML((product.suggestedOccasions || []).join(", ") || "Not specified")]
        ];
        dialog.innerHTML = `
            <div class="comparison-heading">
                <div><span class="commerce-eyebrow">SIDE-BY-SIDE</span><h2>Compare sarees</h2></div>
                <button class="comparison-close" type="button" aria-label="Close comparison">×</button>
            </div>
            <div class="comparison-scroll">
                <table>
                    <thead><tr><th scope="col">Details</th>${selected.map(product => `<th scope="col">${escapeHTML(product.name)}</th>`).join("")}</tr></thead>
                    <tbody>
                        <tr><th scope="row">Product</th>${selected.map(product => `<td><img src="${escapeHTML(product.images[0])}" alt="${escapeHTML(product.name)}"><a href="product.html?id=${product.id}">View product</a></td>`).join("")}</tr>
                        ${rows.map(([label, getter]) => `<tr><th scope="row">${label}</th>${selected.map(product => `<td>${getter(product)}</td>`).join("")}</tr>`).join("")}
                    </tbody>
                </table>
            </div>`;
        document.body.appendChild(dialog);
        dialog.showModal();
        dialog.querySelector(".comparison-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", event => {
            if (event.target === dialog) dialog.close();
        });
        dialog.addEventListener("close", () => dialog.remove(), { once: true });
    }

    document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;
        const compareButton = event.target.closest(".compare-toggle");
        if (compareButton) {
            const result = GASStore.toggleCompare(compareButton.dataset.id);
            if (!result.ok) {
                const toastMessage = document.getElementById("toastMessage");
                const toast = document.getElementById("toast");
                if (toastMessage && toast) {
                    toastMessage.textContent = result.message;
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 2500);
                }
            }
            syncProductButtons();
            return;
        }

        const wishlistButton = event.target.closest(".feature-wishlist, .feature-remove");
        if (wishlistButton) {
            GASStore.toggleWishlist(wishlistButton.dataset.id);
            syncProductButtons();
        }
    });

    document.getElementById("wishlistNav")?.addEventListener("click", event => {
        if (event.currentTarget.tagName === "BUTTON") {
            location.href = "wishlist.html";
        }
    });

    window.addEventListener("gas-wishlist-updated", syncProductButtons);
    window.addEventListener("gas-compare-updated", syncProductButtons);
    renderWishlist();
    syncProductButtons();
    renderRecommendations();
    renderRecentProducts();

    let installPrompt = null;
    const installButtons = document.querySelectorAll("#installApp");
    const standaloneMode = window.matchMedia("(display-mode: standalone)").matches;
    installButtons.forEach(button => {
        button.hidden = standaloneMode;
    });
    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        installPrompt = event;
    });
    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        installButtons.forEach(button => {
            button.hidden = true;
        });
    });

    installButtons.forEach(button => {
        button.addEventListener("click", async () => {
            if (!installPrompt) {
                const toastMessage = document.getElementById("toastMessage");
                const toast = document.getElementById("toast");
                if (toastMessage && toast) {
                    toastMessage.textContent = "Use your browser menu and choose “Install app” or “Add to Home screen”.";
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 4500);
                }
                return;
            }
            try {
                await installPrompt.prompt();
                await installPrompt.userChoice;
                installPrompt = null;
            } catch (error) {
                console.error("The app install prompt could not be shown.", error);
                const toastMessage = document.getElementById("toastMessage");
                const toast = document.getElementById("toast");
                if (toastMessage && toast) {
                    toastMessage.textContent = "The app could not be installed right now.";
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 3000);
                }
                installPrompt = null;
            }
        });
    });

    if ("serviceWorker" in navigator && window.isSecureContext) {
        navigator.serviceWorker.register("service-worker.js")
            .catch(error => console.error("Could not register the storefront offline worker.", error));
    }
})();
