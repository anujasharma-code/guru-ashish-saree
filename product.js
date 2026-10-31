
/* =====================================================
   GURU AASHISH SAREE
   PRODUCT DATABASE
===================================================== */

const products = [

    {
        id: 1,

        name: "Royal Banarasi Silk Saree",

        category: "banarasi",

        badge: "Bestseller",

        price: 4999,

        oldPrice: 6999,

        rating: 4.9,

        reviews: 128,

        stock: 12,

        color: "Maroon",

        suggestedOccasions: ["Wedding", "Festive"],

        blousePiece: true,

        description:
            "A luxurious Banarasi silk saree featuring traditional woven motifs and an elegant zari border.",

        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 2,

        name: "Elegant Kanjivaram Silk",

        category: "silk",

        badge: "New",

        price: 5999,

        oldPrice: 7999,

        rating: 4.8,

        reviews: 94,

        stock: 8,

        color: "Pink",

        suggestedOccasions: ["Wedding", "Festive"],

        blousePiece: true,

        description:
            "Classic Kanjivaram-inspired silk saree designed with rich borders and timeless elegance.",

        images: [
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 3,

        name: "Handwoven Cotton Classic",

        category: "cotton",

        badge: "Sale",

        price: 1899,

        oldPrice: 2499,

        rating: 4.7,

        reviews: 76,

        stock: 25,

        color: "Yellow",

        suggestedOccasions: ["Everyday", "Workwear"],

        blousePiece: true,

        description:
            "Lightweight handwoven cotton saree perfect for elegant everyday styling.",

        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 4,

        name: "Designer Festive Saree",

        category: "designer",

        badge: "New",

        price: 3499,

        oldPrice: 4499,

        rating: 4.9,

        reviews: 51,

        stock: 7,

        color: "Red",

        suggestedOccasions: ["Festive", "Celebration"],

        blousePiece: true,

        description:
            "A statement designer saree created for festive celebrations and special occasions.",

        images: [
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 5,

        name: "Classic Golden Silk",

        category: "silk",

        badge: "Bestseller",

        price: 4299,

        oldPrice: 5799,

        rating: 4.8,

        reviews: 113,

        stock: 16,

        color: "Golden",

        suggestedOccasions: ["Wedding", "Celebration"],

        blousePiece: true,

        description:
            "Rich golden silk saree with subtle traditional detailing for weddings and celebrations.",

        images: [
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf06?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 6,

        name: "Pastel Cotton Saree",

        category: "cotton",

        badge: "New",

        price: 1599,

        oldPrice: 1999,

        rating: 4.6,

        reviews: 42,

        stock: 20,

        color: "Pastel",

        suggestedOccasions: ["Everyday", "Workwear"],

        blousePiece: false,

        description:
            "A soft pastel cotton saree designed for comfortable and graceful everyday wear.",

        images: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 7,

        name: "Royal Designer Drapes",

        category: "designer",

        badge: "Bestseller",

        price: 3899,

        oldPrice: 4999,

        rating: 4.9,

        reviews: 88,

        stock: 10,

        color: "Wine",

        suggestedOccasions: ["Festive", "Celebration"],

        blousePiece: true,

        description:
            "Contemporary designer saree with a luxurious silhouette and elegant detailing.",

        images: [
            "https://images.unsplash.com/photo-1610189012906-4b8a5f7e5e77?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1583391733981-849840f1c7d1?auto=format&fit=crop&w=900&q=85"
        ]
    },


    {
        id: 8,

        name: "Heritage Banarasi Gold",

        category: "banarasi",

        badge: "Sale",

        price: 4599,

        oldPrice: 6299,

        rating: 4.8,

        reviews: 67,

        stock: 5,

        color: "Royal Blue",

        suggestedOccasions: ["Wedding", "Festive"],

        blousePiece: true,

        description:
            "Traditional Banarasi-inspired weave with intricate golden motifs.",

        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85"
        ]
    }

];

products.forEach(product => {
    product.price = Math.round(product.price * 1.2);
    product.oldPrice = Math.round(product.oldPrice * 1.2);
});
