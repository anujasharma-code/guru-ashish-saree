# Guru Aashish Saree storefront demo

A responsive, browser-only saree storefront built with HTML, CSS, and JavaScript. No package installation or build step is needed.

## Run it locally

1. Open PowerShell in the `storefront-copy` folder.
2. Start a local web server:

   ```powershell
   py -m http.server 8000
   ```

   If `py` is unavailable, use `python -m http.server 8000`.

3. Visit [http://localhost:8000/](http://localhost:8000/). The project-root page opens the storefront automatically.

Use a local server instead of opening the HTML file directly so browser storage and the service worker work consistently.

## Store setup

- In `js/store-config.js`, set `whatsappNumber` to the shop's full international number using digits only, including the country code (for example, `91` followed by the shop's Indian mobile number). Leave it blank to let the customer choose a WhatsApp recipient.
- Edit the `products` list and image URLs in `js/product.js` to update the demo catalogue.
- The coupon code `WELCOME10` takes 10% off the subtotal. Bag, wishlist, theme, and demo inventory data are saved in this browser's local storage.
- Customer pages include `about.html`, `contact.html`, `faq.html`, `shipping-returns.html`, and `privacy-terms.html`. The contact form prepares a WhatsApp draft for review; it does not send enquiries automatically.
- The catalogue includes search, category/price/colour/occasion filters, sorting, product quick view, comparison, recently viewed items, and saved wishlist controls.
- The shopping bag has quantity updates, live totals, coupon application, and a demo shipping-threshold progress indicator.
- `css/advanced-ui.css` adds restrained CSS 3D card motion and decorative animated artwork. It does not require a 3D library, and it respects reduced-motion preferences.
- The visual palette pairs deep plum and peacock teal with rose, saffron, lavender, and warm gold accents; the colors adapt for dark mode and appear across buttons, category controls, cards, banners, and page heroes.
- The homepage includes the Adobe Express campaign artwork at `images/adobe-campaign-banner.jpg`. The banner links to the saree catalogue and is cached for offline visits.
- Product photography is loaded from Unsplash and fonts and icons use hosted Google Fonts and Font Awesome, so those assets need an internet connection.

## Demo limitations

Checkout prepares an order message in WhatsApp. The customer must review it and press Send. No real order is created automatically. This frontend has no backend, secure accounts, production order management, or real payment processing. Confirm product availability, shipping, payment, and the final total with the store.
