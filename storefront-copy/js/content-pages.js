(() => {
    const nav = document.getElementById("navMenu");
    const menuButton = document.getElementById("mobileMenuButton");
    const themeButton = document.getElementById("themeButton");

    function updateThemeIcon() {
        const icon = themeButton?.querySelector("i");
        if (!icon) return;
        icon.className = document.body.classList.contains("dark")
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
    }

    const savedTheme = localStorage.getItem("gas-theme");
    if (savedTheme === "dark") document.body.classList.add("dark");
    updateThemeIcon();

    themeButton?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem(
            "gas-theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
        updateThemeIcon();
    });

    menuButton?.addEventListener("click", () => {
        const isOpen = nav?.classList.toggle("active") || false;
        menuButton.setAttribute("aria-expanded", String(isOpen));
        const icon = menuButton.querySelector("i");
        if (icon) icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    nav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuButton?.setAttribute("aria-expanded", "false");
            const icon = menuButton?.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !nav?.classList.contains("active")) return;
        nav.classList.remove("active");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.querySelector("i")?.classList.replace("fa-xmark", "fa-bars");
        menuButton?.focus();
    });

    function updateCounts() {
        if (!window.GASStore) return;
        const cartCount = document.getElementById("cartCount");
        const wishlistCount = document.getElementById("wishlistCount");
        if (cartCount) {
            cartCount.textContent = GASStore.getCart().reduce(
                (count, item) => count + item.quantity,
                0
            );
        }
        if (wishlistCount) wishlistCount.textContent = GASStore.getWishlist().length;
    }

    updateCounts();
    window.addEventListener("gas-cart-updated", updateCounts);
    window.addEventListener("gas-wishlist-updated", updateCounts);
    window.addEventListener("storage", updateCounts);

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    const form = document.getElementById("contactForm");
    form?.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const values = new FormData(form);
        const lines = [
            "Hello Guru Aashish Saree, I have an enquiry.",
            "",
            `Name: ${String(values.get("name")).trim()}`,
            values.get("phone") ? `Phone: ${String(values.get("phone")).trim()}` : null,
            `Topic: ${String(values.get("topic")).trim()}`,
            "",
            String(values.get("message")).trim()
        ].filter(line => line !== null);
        const message = lines.join("\n");
        const number = String(window.GAS_CONFIG?.whatsappNumber || "").replace(/\D/g, "");
        const base = number ? `https://wa.me/${number}` : "https://wa.me/";
        const link = document.getElementById("contactWhatsAppLink");
        const status = document.getElementById("contactStatus");

        if (!link || !status) return;
        link.href = `${base}?text=${encodeURIComponent(message)}`;
        link.hidden = false;
        status.textContent = "Your enquiry is ready. Review it in WhatsApp and press Send when you are ready.";
    });

    const floatingWhatsApp = document.getElementById("floatingWhatsapp");
    if (floatingWhatsApp) {
        const number = String(window.GAS_CONFIG?.whatsappNumber || "").replace(/\D/g, "");
        floatingWhatsApp.href = number ? `https://wa.me/${number}` : "https://wa.me/";
        floatingWhatsApp.target = "_blank";
        floatingWhatsApp.rel = "noopener noreferrer";
    }
})();
