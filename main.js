
/* =====================================================
   GURU AASHISH SAREE
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   DOM
===================================================== */

const loader =
    document.getElementById("loader");

const navbar =
    document.querySelector(".navbar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const navMenu =
    document.getElementById("navMenu");

const themeButton =
    document.getElementById("themeButton");

const backToTop =
    document.getElementById("backToTop");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const featuredProducts =
    document.getElementById("featuredProducts");


/* =====================================================
   PAGE LOADER
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hidden");

    }, 700);

});


/* =====================================================
   TOAST SYSTEM
===================================================== */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);
}


/* =====================================================
   MOBILE MENU
===================================================== */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle("active");

            const icon =
                mobileMenuButton.querySelector("i");

            if (navMenu.classList.contains("active")) {

                icon.className =
                    "fa-solid fa-xmark";

            } else {

                icon.className =
                    "fa-solid fa-bars";

            }

        }
    );

}


/* CLOSE MOBILE MENU WHEN LINK CLICKED */

document.querySelectorAll(".nav-menu a")
.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        const icon =
            mobileMenuButton?.querySelector("i");

        if (icon) {

            icon.className =
                "fa-solid fa-bars";

        }

    });

});


/* =====================================================
   NAVBAR SCROLL
===================================================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }


    /* BACK TO TOP */

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


/* =====================================================
   BACK TO TOP
===================================================== */

backToTop?.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =====================================================
   DARK MODE
===================================================== */

function updateThemeIcon() {

    const icon =
        themeButton?.querySelector("i");

    if (!icon) return;

    if (document.body.classList.contains("dark")) {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-solid fa-moon";

    }

}


/* LOAD SAVED THEME */

const savedTheme =
    localStorage.getItem("gas-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

updateThemeIcon();


/* CHANGE THEME */

themeButton?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");

        const dark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "gas-theme",
            dark ? "dark" : "light"
        );

        updateThemeIcon();

        showToast(
            dark
                ? "Dark mode enabled"
                : "Light mode enabled"
        );

    }
);


/* =====================================================
   HERO SLIDER
===================================================== */

const heroSlides =
    document.querySelectorAll(".hero-slide");

const dots =
    document.querySelectorAll(".dot");

const previousSlide =
    document.getElementById("previousSlide");

const nextSlide =
    document.getElementById("nextSlide");

let currentSlide = 0;


function showSlide(index) {

    heroSlides.forEach(
        (slide, i) => {

            slide.classList.toggle(
                "active",
                i === index
            );

        }
    );

    dots.forEach(
        (dot, i) => {

            dot.classList.toggle(
                "active",
                i === index
            );

        }
    );

    currentSlide = index;

}


/* NEXT */

nextSlide?.addEventListener(
    "click",
    () => {

        let next =
            currentSlide + 1;

        if (next >= heroSlides.length) {

            next = 0;

        }

        showSlide(next);

    }
);


/* PREVIOUS */

previousSlide?.addEventListener(
    "click",
    () => {

        let previous =
            currentSlide - 1;

        if (previous < 0) {

            previous =
                heroSlides.length - 1;

        }

        showSlide(previous);

    }
);


/* DOTS */

dots.forEach((dot, index) => {

    dot.addEventListener(
        "click",
        () => {

            showSlide(index);

        }
    );

});


/* AUTO SLIDER */

setInterval(() => {

    let next =
        currentSlide + 1;

    if (next >= heroSlides.length) {

        next = 0;

    }

    showSlide(next);

}, 5000);


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

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

    if (product.badge === "Bestseller") {

        badgeClass = "bestseller";

    }


    return `

        <article
            class="product-card reveal"
            data-product-id="${product.id}"
        >

            <div class="product-image">

                <span
                    class="product-badge ${badgeClass}">
                    ${product.badge}
                </span>


                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    loading="lazy"
                >


                <div class="product-actions">

                    <button
                        class="product-action wishlist-button"
                        data-id="${product.id}"
                        title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                        aria-label="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
                        aria-pressed="${isWishlisted}"
                    >

                        <i class="${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>

                    </button>


                    <button
                        class="product-action quick-view-button"
                        data-id="${product.id}"
                        title="Quick View"
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>


                    <button
                        class="product-action cart-button"
                        data-id="${product.id}"
                        title="Add to Cart"
                        ${availableStock === 0 ? "disabled" : ""}
                    >

                        <i class="fa-solid fa-bag-shopping"></i>

                    </button>

                </div>

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

                    ${generateStars(product.rating)}

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

                <button class="compare-toggle ${isCompared ? "selected" : ""}" type="button" data-id="${product.id}" aria-pressed="${isCompared}">
                    <i class="fa-solid fa-code-compare" aria-hidden="true"></i>
                    ${isCompared ? "Added to compare" : "Compare"}
                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   STAR GENERATOR
===================================================== */

function generateStars(rating) {

    const fullStars =
        Math.floor(rating);

    let stars = "";

    for (let i = 0; i < 5; i++) {

        if (i < fullStars) {

            stars +=
                `<i class="fa-solid fa-star"></i>`;

        } else {

            stars +=
                `<i class="fa-regular fa-star"></i>`;

        }

    }

    return stars;
}


/* =====================================================
   LOAD FEATURED PRODUCTS
===================================================== */

function loadProducts(category = "all") {

    if (!featuredProducts) return;

    let filteredProducts =
        products;

    if (category !== "all") {

        filteredProducts =
            products.filter(
                product =>
                    product.category === category
            );

    }


    featuredProducts.innerHTML =
        filteredProducts
        .slice(0, 8)
        .map(createProductCard)
        .join("");


    activateProductButtons();

    revealElements();

}


/* INITIAL LOAD */

loadProducts();


/* =====================================================
   CATEGORY FILTER
===================================================== */

document.querySelectorAll(".category-tab")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".category-tab")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            loadProducts(
                button.dataset.category
            );

        }
    );

});


/* =====================================================
   CART
===================================================== */

let cart = GASStore.getCart();


function updateCartCount() {

    cart = GASStore.getCart();

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


function addToCart(id) {

    const result = GASStore.addToCart(id);
    if (!result.ok) {
        showToast(result.message);
        return;
    }


    updateCartCount();

    showToast(result.message);

}


function activateCartButtons() {

    document.querySelectorAll(
        ".cart-button"
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

                addToCart(id);

            }
        );

    });

}


/* =====================================================
   WISHLIST
===================================================== */

let wishlist = GASStore.getWishlist();


function toggleWishlist(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;


    const result = GASStore.toggleWishlist(id);
    if (!result.ok) return;

    wishlist = GASStore.getWishlist();
    showToast(result.saved ? "Added to wishlist" : "Removed from wishlist");

}


function activateWishlistButtons() {

    document.querySelectorAll(
        ".wishlist-button"
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

                toggleWishlist(id);

            }
        );

    });

}


/* =====================================================
   QUICK VIEW
===================================================== */

const quickViewModal =
    document.getElementById(
        "quickViewModal"
    );

const quickViewContent =
    document.getElementById(
        "quickViewContent"
    );

const closeQuickView =
    document.getElementById(
        "closeQuickView"
    );


function openQuickView(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;

    const availableStock =
        GASStore.getAvailableStock(product.id);

    quickViewContent.innerHTML = `

        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
        ">

            <div style="
                height:550px;
                overflow:hidden;
            ">

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                    "
                >

            </div>


            <div style="
                padding:55px 40px;
            ">

                <small style="
                    color:#c9a227;
                    letter-spacing:3px;
                    text-transform:uppercase;
                ">
                    ${product.category}
                </small>


                <h2 style="
                    font-family:'Cormorant Garamond';
                    font-size:45px;
                    font-weight:500;
                    margin:15px 0;
                ">
                    ${product.name}
                </h2>


                <div style="
                    color:#c9a227;
                    margin-bottom:15px;
                ">

                    ${generateStars(product.rating)}

                    <span style="
                        color:#888;
                        font-size:11px;
                    ">
                        (${product.reviews} Reviews)
                    </span>

                </div>


                <h3 style="
                    color:#8b1e3f;
                    font-size:25px;
                ">
                    ₹${product.price.toLocaleString("en-IN")}
                </h3>


                <p style="
                    color:#777;
                    font-size:13px;
                    line-height:1.8;
                    margin:20px 0;
                ">
                    ${product.description}
                </p>


                <p style="
                    color:${availableStock < 6 ? '#b21f35' : '#2f7d32'};
                    font-size:12px;
                    font-weight:600;
                ">
                    <i class="fa-solid fa-box"></i>
                    ${availableStock
                        ? `${availableStock} pieces available`
                        : "Out of stock"}
                </p>


                <button
                    class="btn btn-dark"
                    style="margin-top:25px"
                    onclick="addToCart(${product.id})"
                    ${availableStock === 0 ? "disabled" : ""}
                >

                    Add to Cart

                    <i class="fa-solid fa-bag-shopping"></i>

                </button>

            </div>

        </div>

    `;


    quickViewModal.classList.add("active");

}


function activateQuickViewButtons() {

    document.querySelectorAll(
        ".quick-view-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openQuickView(
                    Number(button.dataset.id)
                );

            }
        );

    });

}


closeQuickView?.addEventListener(
    "click",
    () => {

        quickViewModal.classList.remove(
            "active"
        );

    }
);


quickViewModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            quickViewModal
        ) {

            quickViewModal.classList.remove(
                "active"
            );

        }

    }
);


/* =====================================================
   PRODUCT BUTTON ACTIVATION
===================================================== */

function activateProductButtons() {

    activateCartButtons();

    activateWishlistButtons();

    activateQuickViewButtons();

}


/* =====================================================
   SEARCH
===================================================== */

const searchButton =
    document.getElementById(
        "searchButton"
    );

const searchOverlay =
    document.getElementById(
        "searchOverlay"
    );

const closeSearch =
    document.getElementById(
        "closeSearch"
    );

const liveSearch =
    document.getElementById(
        "liveSearch"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );


searchButton?.addEventListener(
    "click",
    () => {

        searchOverlay.classList.add(
            "active"
        );

        setTimeout(
            () => liveSearch.focus(),
            300
        );

    }
);


closeSearch?.addEventListener(
    "click",
    () => {

        searchOverlay.classList.remove(
            "active"
        );

    }
);


liveSearch?.addEventListener(
    "input",
    () => {

        const query =
            liveSearch.value
            .toLowerCase()
            .trim();


        if (!query) {

            searchResults.innerHTML = "";

            return;

        }


        const results =
            products.filter(product =>

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


        if (!results.length) {

            searchResults.innerHTML = `

                <p style="
                    color:white;
                    padding-top:25px;
                ">
                    No sarees found.
                </p>

            `;

            return;

        }


        searchResults.innerHTML =
            results.map(product => `

                <div
                    style="
                        display:flex;
                        gap:15px;
                        align-items:center;
                        padding:15px 0;
                        border-bottom:
                        1px solid rgba(255,255,255,.1);
                        cursor:pointer;
                        color:white;
                    "
                    onclick="
                        openQuickView(${product.id});
                        document
                        .getElementById('searchOverlay')
                        .classList.remove('active');
                    "
                >

                    <img
                        src="${product.images[0]}"
                        style="
                            width:60px;
                            height:70px;
                            object-fit:cover;
                        "
                    >

                    <div>

                        <strong>
                            ${product.name}
                        </strong>

                        <p style="
                            color:#c9a227;
                            font-size:11px;
                            margin-top:4px;
                        ">
                            ₹${product.price.toLocaleString("en-IN")}
                        </p>

                    </div>

                </div>

            `).join("");

    }
);


/* =====================================================
   COUNTDOWN
===================================================== */

const saleEnd =
    new Date();

saleEnd.setDate(
    saleEnd.getDate() + 5
);


function updateCountdown() {

    const countdownElements = [
        document.getElementById("days"),
        document.getElementById("hours"),
        document.getElementById("minutes"),
        document.getElementById("seconds")
    ];

    if (countdownElements.some(element => !element)) return;

    const now =
        new Date();

    const difference =
        saleEnd - now;


    if (difference <= 0) {

        return;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference /
            (1000 * 60 * 60)) % 24
        );

    const minutes =
        Math.floor(
            (difference /
            (1000 * 60)) % 60
        );

    const seconds =
        Math.floor(
            (difference /
            1000) % 60
        );


    countdownElements[0].textContent = String(days).padStart(2,"0");
    countdownElements[1].textContent = String(hours).padStart(2,"0");
    countdownElements[2].textContent = String(minutes).padStart(2,"0");
    countdownElements[3].textContent = String(seconds).padStart(2,"0");

}


setInterval(
    updateCountdown,
    1000
);

updateCountdown();


/* =====================================================
   SCROLL REVEAL
===================================================== */

function revealElements() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("visible");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: .12
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );

}


revealElements();


/* =====================================================
   NEWSLETTER
===================================================== */

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


newsletterForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const email =
            document.getElementById(
                "newsletterEmail"
            ).value.trim();


        if (!email ||
            !email.includes("@")) {

            showToast(
                "Please enter a valid email"
            );

            return;

        }


        localStorage.setItem(
            "gas-newsletter",
            email
        );


        newsletterForm.reset();


        showToast(
            "Welcome to our Royal Circle ✨"
        );

    }
);


/* =====================================================
   WHATSAPP
===================================================== */

const whatsappNumber =
    "91XXXXXXXXXX";

const whatsappMessage =
    encodeURIComponent(
        "Hello Guru Aashish Saree, I would like to know more about your sarees."
    );


const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


const whatsappLink =
    document.getElementById(
        "whatsappLink"
    );

const floatingWhatsapp =
    document.getElementById(
        "floatingWhatsapp"
    );


if (whatsappLink) {

    whatsappLink.href =
        whatsappURL;

    whatsappLink.target =
        "_blank";

}


if (floatingWhatsapp) {

    floatingWhatsapp.href =
        whatsappURL;

    floatingWhatsapp.target =
        "_blank";

}


/* =====================================================
   ACCOUNT BUTTON
===================================================== */

const accountButton =
    document.getElementById(
        "accountButton"
    );


accountButton?.addEventListener(
    "click",
    () => {

        window.location.href =
            "login.html";

    }
);


/* =====================================================
   INITIAL CART
===================================================== */

updateCartCount();

window.addEventListener("gas-cart-updated", updateCartCount);

document.getElementById("cartNav")?.addEventListener("click", () => {
    window.location.href = "cart.html";
});
