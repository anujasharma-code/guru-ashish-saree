/**
 * WhatsApp Order Flow & Message Dispatcher
 * Formats structured order messages, provides WhatsApp direct routing and clipboard copy.
 */

(function (window) {
    "use strict";

    const ADDRESS_STORAGE_KEY = "luxury_saree_saved_shipping_address_v1";

    function getSavedShippingDetails() {
        try {
            return JSON.parse(localStorage.getItem(ADDRESS_STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveShippingDetails(details) {
        try {
            localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(details));
        } catch (e) {
            console.warn("Could not save address details:", e);
        }
    }

    /**
     * Generates a beautifully formatted WhatsApp text receipt
     */
    function formatWhatsAppOrderMessage(orderDetails) {
        const {
            orderId,
            customerName,
            customerPhone,
            shippingAddress,
            city,
            state,
            pincode,
            paymentPref,
            notes,
            totals
        } = orderDetails;

        const storeName = window.STORE_CONFIG ? window.STORE_CONFIG.storeName : "GURU AASHISH LUXURY SAREES";
        const now = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        let msg = `✨ *NEW ORDER RESERVATION - ${storeName.toUpperCase()}* ✨\n`;
        msg += `Order Ref: *#${orderId}* | Date: ${now}\n`;
        msg += `-------------------------------------------\n\n`;

        msg += `👤 *CUSTOMER DETAILS*\n`;
        msg += `• Name: *${customerName}*\n`;
        msg += `• Mobile: ${customerPhone}\n`;
        msg += `• Address: ${shippingAddress}\n`;
        msg += `• City / State / PIN: ${city}, ${state} - ${pincode}\n`;
        if (paymentPref) {
            msg += `• Preferred Payment: ${paymentPref}\n`;
        }
        if (notes && notes.trim()) {
            msg += `• Special Note: _"${notes.trim()}"_\n`;
        }
        msg += `\n📦 *ORDERED ITEMS (${totals.totalItems} Saree${totals.totalItems > 1 ? "s" : ""})*\n`;

        totals.items.forEach((item, index) => {
            msg += `${index + 1}. *${item.product.name}*\n`;
            msg += `   • Fabric: ${item.product.fabric}\n`;
            msg += `   • Color: ${item.product.color}\n`;
            msg += `   • Qty: *${item.quantity}* × ₹${item.unitPrice.toLocaleString("en-IN")}\n`;
            msg += `   • Line Total: *₹${item.lineTotal.toLocaleString("en-IN")}*\n\n`;
        });

        msg += `-------------------------------------------\n`;
        msg += `💵 *ORDER SUMMARY*\n`;
        msg += `• Subtotal: ₹${totals.subtotal.toLocaleString("en-IN")}\n`;

        if (totals.coupon) {
            msg += `• Promo Discount (${totals.coupon.code} - ${totals.coupon.discountPercent}% OFF): -₹${totals.couponDiscount.toLocaleString("en-IN")}\n`;
        }

        msg += `• GST (5% Textile): ₹${totals.taxAmount.toLocaleString("en-IN")}\n`;
        msg += `• Insured Delivery: ${totals.shippingFee === 0 ? "FREE (Complimentary)" : "₹" + totals.shippingFee}\n`;
        
        msg += `-------------------------------------------\n`;
        msg += `🌟 *GRAND TOTAL: ₹${totals.grandTotal.toLocaleString("en-IN")}*\n`;
        msg += `-------------------------------------------\n\n`;

        msg += `🙏 _Please confirm silk availability, UPI/Bank account details, and dispatch timeline._\n`;
        msg += `_Thank you for choosing ${storeName}!_`;

        return msg;
    }

    /**
     * Builds direct WhatsApp click URL
     */
    function buildWhatsAppUrl(phoneNumber, textMessage) {
        // Strip non-digits
        const cleanNumber = (phoneNumber || "").toString().replace(/\D/g, "");
        const encodedText = encodeURIComponent(textMessage);
        return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
    }

    /**
     * Opens the WhatsApp modal dialog
     */
    function openWhatsAppOrderModal(directProductId = null, directQty = 1) {
        let modal = document.getElementById("whatsappOrderModal");
        if (!modal) {
            console.error("WhatsApp Order Modal not found in DOM.");
            return;
        }

        let totals;
        let isDirectSingleItem = false;
        let directProduct = null;

        if (directProductId) {
            directProduct = window.getProductById(directProductId);
            if (directProduct) {
                isDirectSingleItem = true;
                const unitPrice = directProduct.price;
                const lineTotal = unitPrice * directQty;
                const tax = Math.round(lineTotal * 0.05);
                const ship = lineTotal >= (window.STORE_CONFIG.freeShippingThreshold || 2999) ? 0 : 150;
                totals = {
                    items: [{
                        product: directProduct,
                        quantity: directQty,
                        unitPrice: unitPrice,
                        lineTotal: lineTotal
                    }],
                    totalItems: directQty,
                    subtotal: lineTotal,
                    coupon: null,
                    couponDiscount: 0,
                    taxAmount: tax,
                    shippingFee: ship,
                    grandTotal: lineTotal + tax + ship
                };
            }
        }

        if (!isDirectSingleItem) {
            totals = window.LuxuryStore.calculateTotals();
            if (totals.totalItems === 0) {
                if (window.LuxuryUI && window.LuxuryUI.showToast) {
                    window.LuxuryUI.showToast("Your shopping bag is empty. Please select a saree first!", "warning");
                } else {
                    alert("Your shopping bag is empty. Please add a saree to your bag first!");
                }
                return;
            }
        }

        // Populate summary box in modal
        const previewEl = document.getElementById("waOrderSummaryPreview");
        if (previewEl) {
            let html = `
                <div class="wa-summary-card">
                    <div class="wa-summary-header">
                        <strong>Order Preview (${totals.totalItems} saree${totals.totalItems > 1 ? "s" : ""})</strong>
                        <span class="wa-grand-price">₹${totals.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <ul class="wa-items-mini-list">
            `;
            totals.items.forEach(it => {
                html += `
                    <li>
                        <span class="mini-name">${it.product.name} × ${it.quantity}</span>
                        <span class="mini-price">₹${it.lineTotal.toLocaleString("en-IN")}</span>
                    </li>
                `;
            });
            if (totals.coupon) {
                html += `<li class="mini-discount"><span>Coupon (${totals.coupon.code}):</span> <span>-₹${totals.couponDiscount.toLocaleString("en-IN")}</span></li>`;
            }
            html += `
                    </ul>
                </div>
            `;
            previewEl.innerHTML = html;
        }

        // Prefill saved address details
        const saved = getSavedShippingDetails();
        if (saved.name) document.getElementById("waCustomerName").value = saved.name;
        if (saved.phone) document.getElementById("waCustomerPhone").value = saved.phone;
        if (saved.address) document.getElementById("waCustomerAddress").value = saved.address;
        if (saved.city) document.getElementById("waCustomerCity").value = saved.city;
        if (saved.state) document.getElementById("waCustomerState").value = saved.state;
        if (saved.pincode) document.getElementById("waCustomerPincode").value = saved.pincode;

        // Populate target phone number input for merchant test flexibility
        const phoneInput = document.getElementById("waTargetPhoneInput");
        if (phoneInput) {
            phoneInput.value = window.STORE_CONFIG.whatsappNumber;
        }

        // Store reference on modal dataset
        modal.dataset.isDirect = isDirectSingleItem ? "true" : "false";
        if (isDirectSingleItem && directProduct) {
            modal.dataset.directId = directProduct.id;
            modal.dataset.directQty = directQty;
        }

        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeWhatsAppOrderModal() {
        const modal = document.getElementById("whatsappOrderModal");
        if (modal) {
            modal.classList.remove("is-open");
            document.body.style.overflow = "";
        }
    }

    function submitWhatsAppOrder(event) {
        if (event) event.preventDefault();

        const modal = document.getElementById("whatsappOrderModal");
        const name = (document.getElementById("waCustomerName").value || "").trim();
        const phone = (document.getElementById("waCustomerPhone").value || "").trim();
        const address = (document.getElementById("waCustomerAddress").value || "").trim();
        const city = (document.getElementById("waCustomerCity").value || "").trim();
        const state = (document.getElementById("waCustomerState").value || "").trim();
        const pincode = (document.getElementById("waCustomerPincode").value || "").trim();
        const paymentPref = document.getElementById("waPaymentMethod") ? document.getElementById("waPaymentMethod").value : "UPI / GPay";
        const notes = document.getElementById("waOrderNotes") ? document.getElementById("waOrderNotes").value : "";
        const targetPhone = document.getElementById("waTargetPhoneInput") 
            ? document.getElementById("waTargetPhoneInput").value.trim() 
            : window.STORE_CONFIG.whatsappNumber;

        if (!name || !phone || !address || !city || !pincode) {
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("Please fill in your name, phone, address, and pincode.", "warning");
            } else {
                alert("Please fill in all required shipping address fields.");
            }
            return;
        }

        // Save for next time
        saveShippingDetails({ name, phone, address, city, state, pincode });

        // Update target phone if modified by user
        if (targetPhone && /^\d{10,15}$/.test(targetPhone)) {
            window.STORE_CONFIG.whatsappNumber = targetPhone;
            localStorage.setItem(window.STORE_CONFIG.storageKeys.whatsappCustom, targetPhone);
        }

        // Calculate totals
        let totals;
        const isDirect = modal.dataset.isDirect === "true";
        if (isDirect) {
            const prod = window.getProductById(modal.dataset.directId);
            const qty = Number(modal.dataset.directQty) || 1;
            const line = prod.price * qty;
            const tax = Math.round(line * 0.05);
            const ship = line >= (window.STORE_CONFIG.freeShippingThreshold || 2999) ? 0 : 150;
            totals = {
                items: [{ product: prod, quantity: qty, unitPrice: prod.price, lineTotal: line }],
                totalItems: qty,
                subtotal: line,
                coupon: null,
                couponDiscount: 0,
                taxAmount: tax,
                shippingFee: ship,
                grandTotal: line + tax + ship
            };
        } else {
            totals = window.LuxuryStore.calculateTotals();
        }

        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `GAS-${randomSuffix}`;

        const orderData = {
            orderId,
            customerName: name,
            customerPhone: phone,
            shippingAddress: address,
            city,
            state: state || "India",
            pincode,
            paymentPref,
            notes,
            totals
        };

        const messageText = formatWhatsAppOrderMessage(orderData);
        const waUrl = buildWhatsAppUrl(window.STORE_CONFIG.whatsappNumber, messageText);

        // Put message text into clipboard copy area
        const copyArea = document.getElementById("waFormattedMessagePreview");
        if (copyArea) {
            copyArea.value = messageText;
            document.getElementById("waMessagePreviewContainer").style.display = "block";
        }

        // Open WhatsApp in new tab
        const win = window.open(waUrl, "_blank");
        if (!win || win.closed || typeof win.closed === "undefined") {
            // Popup blocked: show alert to click copy or open link
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("Popup blocked by browser. Click 'Open WhatsApp' below!", "info");
            }
        } else {
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("WhatsApp opened! Send the pre-filled message to confirm your order.", "success");
            }
        }

        // If not direct single item, clear the bag after submitting
        if (!isDirect) {
            window.LuxuryStore.clearCart();
        }

        // Update modal UI to show success confirmation state
        const actionArea = document.getElementById("waModalActionButtons");
        if (actionArea) {
            actionArea.innerHTML = `
                <a href="${waUrl}" target="_blank" class="luxury-btn btn-gold btn-block">
                    <i class="fa-brands fa-whatsapp"></i> Re-open WhatsApp Order
                </a>
                <button type="button" class="luxury-btn btn-secondary btn-block" onclick="WhatsAppCheckout.copyOrderToClipboard()">
                    <i class="fa-regular fa-copy"></i> Copy Order Text to Clipboard
                </button>
                <button type="button" class="luxury-btn btn-outline btn-block" onclick="WhatsAppCheckout.closeWhatsAppOrderModal()">
                    Close Window
                </button>
            `;
        }
    }

    function copyOrderToClipboard() {
        const previewEl = document.getElementById("waFormattedMessagePreview");
        if (!previewEl || !previewEl.value) {
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("No order message generated yet.", "warning");
            }
            return;
        }

        navigator.clipboard.writeText(previewEl.value).then(() => {
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("Order message copied to clipboard! You can paste it into WhatsApp.", "success");
            }
        }).catch(err => {
            previewEl.select();
            document.execCommand("copy");
            if (window.LuxuryUI && window.LuxuryUI.showToast) {
                window.LuxuryUI.showToast("Copied to clipboard!", "success");
            }
        });
    }

    // Export API
    window.WhatsAppCheckout = {
        formatWhatsAppOrderMessage,
        buildWhatsAppUrl,
        openWhatsAppOrderModal,
        closeWhatsAppOrderModal,
        submitWhatsAppOrder,
        copyOrderToClipboard
    };

})(window);
