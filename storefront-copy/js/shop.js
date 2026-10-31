
/* =====================================================
   GURU AASHISH SAREE
   SHOP SYSTEM
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const shopProducts =
    document.getElementById("shopProducts");

const resultCount =
    document.getElementById("resultCount");

const emptyProducts =
    document.getElementById("emptyProducts");

const shopSearch =
    document.getElementById("shopSearch");

const sortProducts =
    document.getElementById("sortProducts");

const clearFilters =
    document.getElementById("clearFilters");

const emptyClear =
    document.getElementById("emptyClear");

const filterToggle =
    document.getElementById("filterToggle");

const filterSidebar =
    document.getElementById("filterSidebar");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const minPriceValue =
    document.getElementById("minPriceValue");

const maxPriceValue =
    document.getElementById("maxPriceValue");

const stockFilter =
    document.getElementById("stockFilter");

const colorFilter =
    document.getElementById("colorFilter");

const occasionFilter =
    document.getElementById("occasionFilter");


/* =====================================================
   SHOP STATE
===================================================== */

let shopState = {

    category: "all",

    search: "",

    minPrice: 500,

    maxPrice: 10000,

    badges: [],

    stockOnly: false,

    color: "all",

    occasion: "all",

    sort: "default"

};


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        readURLCategory();
        populateProductFilters();

        renderShop();

    }
);


/* =====================================================
   URL CATEGORY
===================================================== */

function readURLCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");


    if (
        category &&
        [
            "silk",
            "cotton",
            "designer",
            "banarasi"
        ].includes(category)
    ) {

        shopState.category =
            category;


        const radio =
            document.querySelector(
                `input[name="category"][value="${category}"]`
            );


        if (radio) {

            radio.checked = true;

        }

    }

}

function populateProductFilters() {
    if (!colorFilter) return;
    const colors = [...new Set(products.map(product => product.color))]
        .sort((a, b) => a.localeCompare(b));
    colorFilter.innerHTML = `<option value="all">All colours</option>${
        colors.map(color => `<option value="${color}">${color}</option>`).join("")
    }`;
}


/* =====================================================
   RENDER SHOP
===================================================== */

function renderShop() {

    let filtered =
        [...products];


    /* CATEGORY */

    if (
        shopState.category !== "all"
    ) {

        filtered =
            filtered.filter(
                product =>
                    product.category ===
                    shopState.category
            );

    }


    /* SEARCH */

    if (shopState.search) {

        const query =
            shopState.search
            .toLowerCase();


        filtered =
            filtered.filter(
                product =>

                    product.name
                    .toLowerCase()
                    .includes(query)

                    ||

                    product.category
                    .toLowerCase()
                    .includes(query)

                    ||

                    product.color
                    .toLowerCase()
                    .includes(query)

            );

    }

    if (shopState.color !== "all") {
        filtered = filtered.filter(
            product => product.color === shopState.color
        );
    }

    if (shopState.occasion !== "all") {
        filtered = filtered.filter(
            product => (product.suggestedOccasions || [])
                .includes(shopState.occasion)
        );
    }


    /* PRICE */

    filtered =
        filtered.filter(
            product =>

                product.price >=
                shopState.minPrice

                &&

                product.price <=
                shopState.maxPrice

        );


    /* BADGES */

    if (
        shopState.badges.length
    ) {

        filtered =
            filtered.filter(
                product =>
                    shopState.badges
                    .includes(product.badge)
            );

    }


    /* STOCK */

    if (shopState.stockOnly) {

        filtered =
            filtered.filter(
                product =>
                GASStore.getAvailableStock(product.id) > 0
            );

    }


    /* SORT */

    switch (shopState.sort) {


        case "price-low":

            filtered.sort(
                (a,b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            filtered.sort(
                (a,b) =>
                    b.price - a.price
            );

            break;


        case "popular":

            filtered.sort(
                (a,b) =>
                    b.reviews - a.reviews
            );

            break;


        case "newest":

            filtered.sort(
                (a,b) =>
                    b.id - a.id
            );

            break;


        default:

            break;

    }


    displayProducts(filtered);

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(list) {


    if (!shopProducts) return;


    resultCount.textContent =
        `${list.length} ${
            list.length === 1
                ? "Product"
                : "Products"
        }`;


    if (!list.length) {

        shopProducts.innerHTML = "";

        emptyProducts.classList.add(
            "show"
        );

        return;

    }


    emptyProducts.classList.remove(
        "show"
    );


    shopProducts.innerHTML =
        list
        .map(
            createShopProductCard
        )
        .join("");


    activateShopButtons();

}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createShopProductCard(product) {

    const availableStock =
        GASStore.getAvailableStock(product.id);
    const isWishlisted =
        GASStore.getWishlist().includes(product.id);
    const isCompared =
        GASStore.getCompareList().includes(product.id);

    let badgeClass = "";


    if (product.badge === "Sale") {

        badgeClass = "sale";

    }


    if (
        product.badge ===
        "Bestseller"
    ) {

        badgeClass =
            "bestseller";

    }


    let stockClass =
        "in-stock";

    let stockText =
        `${availableStock} pieces available`;

    if (availableStock === 0) {

        stockClass =
            "out-stock";

        stockText =
            "Out of stock";

    }

    else if (availableStock <= 5) {

        stockClass =
            "low-stock";

        stockText =
            `Only ${availableStock} left`;

    }


    return `

        <article
            class="product-card reveal"
            data-id="${product.id}"
        >


            <div class="product-image">


                <span
                    class="product-badge ${badgeClass}"
                >
                    ${product.badge}
                </span>


                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    loading="lazy"
                >


                <div class="product-actions">


                    <button
                        class="product-action shop-wishlist"
                        data-id="${product.id}"
                        title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                        aria-label="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                        aria-pressed="${isWishlisted}"
                    >

                        <i class="${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>

                    </button>


                    <button
                        class="product-action shop-quick-view"
                        data-id="${product.id}"
                        title="Quick View"
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>


                    <button
                        class="product-action shop-cart"
                        data-id="${product.id}"
                        title="Add to Cart"
                        ${availableStock === 0
                            ? "disabled"
                            : ""}
                    >

                        <i class="fa-solid fa-bag-shopping"></i>

                    </button>


                </div>


                <button
                    class="quick-shop-button shop-quick-view"
                    data-id="${product.id}"
                >

                    QUICK VIEW

                </button>


            </div>


            <div class="product-info">


                <div class="product-category">

                    ${product.category}

                </div>


                <h3 class="product-name">

                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>

                </h3>


                <div class="rating">

                    ${generateShopStars(
                        product.rating
                    )}

                    <span>
                        (${product.reviews})
                    </span>

                </div>


                <div class="product-price">

                    <span class="price">

                        ₹${product.price.toLocaleString("en-IN")}

                    </span>


                    <span class="old-price">

                        ₹${product.oldPrice.toLocaleString("en-IN")}

                    </span>

                </div>


                <div
                    class="stock-indicator ${stockClass}"
                >

                    <i
                        class="fa-solid fa-circle"
                    ></i>

                    ${stockText}

                </div>

                <button class="compare-toggle ${isCompared ? "selected" : ""}" type="button" data-id="${product.id}" aria-pressed="${isCompared}">
                    <i class="fa-solid fa-code-compare" aria-hidden="true"></i>
                    ${isCompared ? "Added to compare" : "Compare"}
                </button>

            </div>


        </article>

    `;

}


/* =====================================================
   STARS
===================================================== */

function generateShopStars(
    rating
) {

    let html = "";

    const full =
        Math.floor(rating);


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        if (i < full) {

            html +=
                `<i class="fa-solid fa-star"></i>`;

        } else {

            html +=
                `<i class="fa-regular fa-star"></i>`;

        }

    }


    return html;

}


/* =====================================================
   BUTTONS
===================================================== */

function activateShopButtons() {


    /* CART */

    document.querySelectorAll(
        ".shop-cart"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const id =
                    Number(
                        button.dataset.id
                    );


                if (
                    typeof addToCart ===
                    "function"
                ) {

                    addToCart(id);

                } else {

                    addShopCart(id);

                }

            }
        );

    });


    /* WISHLIST */

    document.querySelectorAll(
        ".shop-wishlist"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const id =
                    Number(
                        button.dataset.id
                    );


                if (
                    typeof toggleWishlist ===
                    "function"
                ) {

                    toggleWishlist(id);

                } else {

                    toggleShopWishlist(id);

                }

            }
        );

    });


    /* QUICK VIEW */

    document.querySelectorAll(
        ".shop-quick-view"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const id =
                    Number(
                        button.dataset.id
                    );


                openShopQuickView(id);

            }
        );

    });


    if (
        typeof revealElements ===
        "function"
    ) {

        revealElements();

    }

}


/* =====================================================
   CART FALLBACK
===================================================== */

function addShopCart(id) {
    const result = GASStore.addToCart(id);
    if (!result.ok) {
        showShopToast(result.message);
        return;
    }

    updateShopCartCount();
    showShopToast(result.message);

}


/* =====================================================
   CART COUNT
===================================================== */

function updateShopCartCount() {
    const cart = GASStore.getCart();


    const count =
        cart.reduce(
            (total,item) =>
                total + item.quantity,
            0
        );


    const element =
        document.getElementById(
            "cartCount"
        );


    if (element) {

        element.textContent =
            count;

    }

}


/* =====================================================
   WISHLIST FALLBACK
===================================================== */

function toggleShopWishlist(id) {
    const result = GASStore.toggleWishlist(id);
    if (!result.ok) return;
    showShopToast(result.saved ? "Added to wishlist" : "Removed from wishlist");

}


/* =====================================================
   TOAST FALLBACK
===================================================== */

function showShopToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !toastMessage
    ) return;


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =====================================================
   QUICK VIEW
===================================================== */

function openShopQuickView(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;

    const availableStock =
        GASStore.getAvailableStock(product.id);


    /*
       Part 1's modal is not included
       on shop.html, so we create
       our own modal.
    */


    const oldModal =
        document.getElementById(
            "shopQuickModal"
        );


    oldModal?.remove();


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "shopQuickModal";


    modal.className =
        "shop-quick-modal";


    modal.innerHTML = `

        <div class="shop-quick-content">


            <button
                class="shop-quick-close"
                id="shopQuickClose"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="quick-gallery">


                <img
                    id="quickMainImage"
                    src="${product.images[0]}"
                    alt="${product.name}"
                >


                <div class="quick-thumbnails">

                    ${product.images
                        .map(
                            (image,index) => `

                            <button
                                class="
                                quick-thumb
                                ${index === 0
                                    ? "active"
                                    : ""}
                                "
                                data-image="${image}"
                            >

                                <img
                                    src="${image}"
                                    alt=""
                                >

                            </button>

                        `
                        )
                        .join("")
                    }

                </div>

            </div>


            <div class="quick-details">


                <span class="quick-category">

                    ${product.category}

                </span>


                <h2>

                    ${product.name}

                </h2>


                <div class="quick-rating">

                    ${generateShopStars(
                        product.rating
                    )}

                    <span>
                        ${product.rating}
                        (${product.reviews} reviews)
                    </span>

                </div>


                <div class="quick-price">

                    ₹${product.price.toLocaleString("en-IN")}

                    <del>
                        ₹${product.oldPrice.toLocaleString("en-IN")}
                    </del>

                </div>


                <p class="quick-description">

                    ${product.description}

                </p>


                <div class="quick-stock">

                    <i class="fa-solid fa-circle"></i>

                    ${availableStock > 5
                        ? "In Stock"
                        : availableStock > 0
                            ? `Only ${availableStock} left`
                            : "Out of Stock"}

                </div>


                <!-- COLOR -->

                <div class="option-group">

                    <label>
                        Color:
                        <strong>
                            ${product.color}
                        </strong>
                    </label>


                    <div class="color-options">

                        <button
                            class="color-option selected"
                            title="${product.color}"
                        ></button>

                    </div>

                </div>


                <div class="option-group">

                    <label>
                        Measurements & care
                    </label>

                    <p class="quick-description">
                        Length and fabric-care details are not listed for this item.
                        Please confirm measurements and follow the product care label.
                    </p>

                </div>


                <!-- BLOUSE -->

                <div class="option-group">

                    <label>
                        Blouse Piece
                    </label>


                    <div class="size-options">

                        <button
                            class="size-option active"
                        >
                            ${product.blousePiece
                                ? "Included"
                                : "Not Included"}
                        </button>

                    </div>

                </div>


                <div class="quick-buttons">

                    <button
                        class="btn btn-dark"
                        id="quickAddCart"
                        ${availableStock === 0
                            ? "disabled"
                            : ""}
                    >

                        <i class="fa-solid fa-bag-shopping"></i>

                        Add to Cart

                    </button>


                    <button
                        class="quick-wishlist"
                        id="quickWishlist"
                    >

                        <i class="fa-regular fa-heart"></i>

                    </button>

                </div>


                <a
                    class="full-product-link"
                    href="product.html?id=${product.id}"
                >

                    View Full Product Details

                    <i class="fa-solid fa-arrow-right"></i>

                </a>


            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "active"
            );

        }
    );


    /* CLOSE */

    document.getElementById(
        "shopQuickClose"
    )
    .addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "active"
            );

            setTimeout(
                () => modal.remove(),
                300
            );

        }
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "active"
                );

                setTimeout(
                    () => modal.remove(),
                    300
                );

            }

        }
    );


    /* THUMBNAILS */

    modal.querySelectorAll(
        ".quick-thumb"
    )
    .forEach(thumb => {

        thumb.addEventListener(
            "click",
            () => {

                document.getElementById(
                    "quickMainImage"
                ).src =
                    thumb.dataset.image;


                modal.querySelectorAll(
                    ".quick-thumb"
                )
                .forEach(
                    item =>
                        item.classList
                        .remove("active")
                );


                thumb.classList.add(
                    "active"
                );

            }
        );

    });


    /* SIZE */

    modal.querySelectorAll(
        ".size-option"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const parent =
                    button.parentElement;


                parent
                    .querySelectorAll(
                        ".size-option"
                    )
                    .forEach(
                        item =>
                            item.classList
                            .remove("active")
                    );


                button.classList.add(
                    "active"
                );

            }
        );

    });


    /* ADD CART */

    document.getElementById(
        "quickAddCart"
    )?.addEventListener(
        "click",
        () => {

            if (
                typeof addToCart ===
                "function"
            ) {

                addToCart(id);

            } else {

                addShopCart(id);

            }

            modal.classList.remove(
                "active"
            );

            setTimeout(
                () => modal.remove(),
                300
            );

        }
    );


    /* WISHLIST */

    document.getElementById(
        "quickWishlist"
    )?.addEventListener(
        "click",
        () => {

            if (
                typeof toggleWishlist ===
                "function"
            ) {

                toggleWishlist(id);

            } else {

                toggleShopWishlist(id);

            }

        }
    );

}


/* =====================================================
   SEARCH
===================================================== */

shopSearch?.addEventListener(
    "input",
    () => {

        shopState.search =
            shopSearch.value;

        renderShop();

    }
);

colorFilter?.addEventListener("change", () => {
    shopState.color = colorFilter.value;
    renderShop();
});

occasionFilter?.addEventListener("change", () => {
    shopState.occasion = occasionFilter.value;
    renderShop();
});


/* =====================================================
   SORT
===================================================== */

sortProducts?.addEventListener(
    "change",
    () => {

        shopState.sort =
            sortProducts.value;

        renderShop();

    }
);


/* =====================================================
   CATEGORY
===================================================== */

document.querySelectorAll(
    'input[name="category"]'
)
.forEach(radio => {

    radio.addEventListener(
        "change",
        () => {

            shopState.category =
                radio.value;

            renderShop();

        }
    );

});


/* =====================================================
   PRICE
===================================================== */

minPrice?.addEventListener(
    "input",
    () => {

        let min =
            Number(
                minPrice.value
            );

        let max =
            Number(
                maxPrice.value
            );


        if (min >= max) {

            min =
                max - 100;

            minPrice.value =
                min;

        }


        shopState.minPrice =
            min;


        minPriceValue.textContent =
            min.toLocaleString("en-IN");


        renderShop();

    }
);


maxPrice?.addEventListener(
    "input",
    () => {

        let max =
            Number(
                maxPrice.value
            );

        let min =
            Number(
                minPrice.value
            );


        if (max <= min) {

            max =
                min + 100;

            maxPrice.value =
                max;

        }


        shopState.maxPrice =
            max;


        maxPriceValue.textContent =
            max.toLocaleString("en-IN");


        renderShop();

    }
);


/* =====================================================
   BADGES
===================================================== */

document.querySelectorAll(
    ".badge-filter"
)
.forEach(checkbox => {

    checkbox.addEventListener(
        "change",
        () => {

            shopState.badges =
                Array.from(
                    document.querySelectorAll(
                        ".badge-filter:checked"
                    )
                )
                .map(
                    item =>
                        item.value
                );


            renderShop();

        }
    );

});


/* =====================================================
   STOCK
===================================================== */

stockFilter?.addEventListener(
    "change",
    () => {

        shopState.stockOnly =
            stockFilter.checked;

        renderShop();

    }
);


/* =====================================================
   CLEAR FILTERS
===================================================== */

function resetShopFilters() {

    shopState = {

        category: "all",

        search: "",

        minPrice: 500,

        maxPrice: 10000,

        badges: [],

        stockOnly: false,

        color: "all",

        occasion: "all",

        sort: "default"

    };


    document.querySelector(
        'input[name="category"][value="all"]'
    ).checked = true;


    document.querySelectorAll(
        ".badge-filter"
    )
    .forEach(
        item =>
            item.checked = false
    );


    if (stockFilter) {

        stockFilter.checked =
            false;

    }

    if (colorFilter) colorFilter.value = "all";
    if (occasionFilter) occasionFilter.value = "all";


    if (shopSearch) {

        shopSearch.value = "";

    }


    if (sortProducts) {

        sortProducts.value =
            "default";

    }


    if (minPrice) {

        minPrice.value =
            500;

    }


    if (maxPrice) {

        maxPrice.value =
            10000;

    }


    minPriceValue.textContent =
        "500";


    maxPriceValue.textContent =
        "10,000";


    renderShop();


    showShopToast(
        "Filters cleared"
    );

}


clearFilters?.addEventListener(
    "click",
    resetShopFilters
);


emptyClear?.addEventListener(
    "click",
    resetShopFilters
);


/* =====================================================
   MOBILE FILTER
===================================================== */

filterToggle?.addEventListener(
    "click",
    () => {

        filterSidebar.classList.toggle(
            "active"
        );

    }
);


/* =====================================================
   CART NAV
===================================================== */

document.getElementById(
    "cartNav"
)?.addEventListener(
    "click",
    () => {

        window.location.href =
            "cart.html";

    }
);


/* =====================================================
   WISHLIST NAV
===================================================== */

document.getElementById(
    "wishlistNav"
)?.addEventListener(
    "click",
    () => {

        window.location.href =
            "wishlist.html";

    }
);


/* =====================================================
   ACCOUNT
===================================================== */



/* =====================================================
   INITIAL COUNT
===================================================== */

updateShopCartCount();
