export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    material: string;
    images: string[];
    sizes: string[];
    rating: number;
    reviews: number;
    category: string;
    type: string;
    sale?: boolean;
    status?: 'new' | 'featured' | 'bestseller';
}

export const allProducts: Product[] = [
    // --- MEN'S COLLECTION (IDs 1-99) ---
    {
        id: 1,
        name: 'Slim Fit Cotton Shirt',
        price: 45.00,
        description: 'A versatile slim-fit cotton shirt perfect for both office and casual wear. Breathable fabric ensures all-day comfort.',
        material: '100% Cotton. Machine wash cold.',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.5,
        reviews: 120,
        category: 'Men',
        type: 'Shirt',
        status: 'new'
    },
    {
        id: 2,
        name: 'Classic Chino Pants',
        price: 55.00,
        description: 'Timeless chinos with a modern cut. Durable and stylish, these pants are a wardrobe essential.',
        material: '98% Cotton, 2% Elastane.',
        images: ['https://images.unsplash.com/photo-1473966968600-870d11f2eb08?q=80&w=2071&auto=format&fit=crop'],
        sizes: ['30', '32', '34', '36'],
        rating: 4.6,
        reviews: 85,
        category: 'Men',
        type: 'Pants'
    },
    {
        id: 3,
        name: 'Denim Jacket',
        price: 89.00,
        description: 'Rugged denim jacket with classic styling. Features button-front closure and multiple pockets.',
        material: '100% Cotton Denim.',
        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1888&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8,
        reviews: 200,
        category: 'Men',
        type: 'Jacket'
    },
    {
        id: 4,
        name: 'Wool Blend Suit',
        price: 299.00,
        description: 'Elegant wool blend suit for formal occasions. Sharp tailoring meets premium comfort.',
        material: '80% Wool, 20% Polyester. Dry clean only.',
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1780&auto=format&fit=crop'],
        sizes: ['38R', '40R', '42R', '44R'],
        rating: 4.9,
        reviews: 45,
        category: 'Men',
        type: 'Suit'
    },
    {
        id: 5,
        name: 'Casual Linen Shirt',
        price: 49.00,
        description: 'Lighweight linen shirt designed for warm days. Relaxed fit for maximum breathability.',
        material: '100% Linen.',
        images: ['https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1889&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.7,
        reviews: 98,
        category: 'Men',
        type: 'Shirt',
        status: 'new'
    },
    {
        id: 6,
        name: 'Leather Belt',
        price: 35.00,
        description: 'Genuine leather belt with a classic buckle. Adds a refined touch to any outfit.',
        material: '100% Leather.',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['32', '34', '36', '38'],
        rating: 4.6,
        reviews: 150,
        category: 'Men',
        type: 'Accessories'
    },
    {
        id: 7,
        name: 'Bomber Jacket',
        price: 75.00,
        description: 'Modern bomber jacket with ribbed cuffs and hem. Perfect for layering in transitional weather.',
        material: 'Polyester Blend.',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8,
        reviews: 76,
        category: 'Men',
        type: 'Jacket'
    },
    {
        id: 8,
        name: 'Tailored Trousers',
        price: 65.00,
        description: 'Smart tailored trousers that work well for business casual settings.',
        material: 'Polyester/Viscose blend.',
        images: ['https://images.unsplash.com/photo-1506629082955-511b1aa009e5?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['30', '32', '34', '36'],
        rating: 4.5,
        reviews: 60,
        category: 'Men',
        type: 'Pants'
    },
    {
        id: 9,
        name: 'Summer Breeze Shirt',
        price: 95.00,
        description: 'Stay cool and stylish with our premium Summer Breeze Shirt. Features a unique fabric blend for ultimate comfort.',
        material: 'Cotton/Linen Blend.',
        images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.9,
        reviews: 32,
        category: 'Men',
        type: 'Shirt',
        sale: true,
        status: 'featured'
    },

    // --- WOMEN'S COLLECTION (IDs 100-199) ---
    {
        id: 101,
        name: 'Floral Summer Dress',
        price: 65.00,
        description: 'Beautiful floral print dress with a flattering silhouette. Perfect for garden parties and summer outings.',
        material: '100% Viscose.',
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.8,
        reviews: 210,
        category: 'Women',
        type: 'Dress'
    },
    {
        id: 102,
        name: 'Classic White Blouse',
        price: 45.00,
        description: 'Crisp white blouse that pairs with everything. A wardrobe staple for the modern woman.',
        material: 'Cotton Blend.',
        images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1974&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        rating: 4.6,
        reviews: 145,
        category: 'Women',
        type: 'Top'
    },
    {
        id: 103,
        name: 'High-Waist Jeans',
        price: 59.00,
        description: 'Flattering high-waist jeans with a comfortable stretch. Designed to hug your curves.',
        material: 'Denim with Elastane.',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['24', '26', '28', '30', '32'],
        rating: 4.7,
        reviews: 180,
        category: 'Women',
        type: 'Pants'
    },
    {
        id: 104,
        name: 'Pleated Midi Skirt',
        price: 49.00,
        description: 'Elegant pleated midi skirt that moves beautifully as you walk. Elastic waistband for comfort.',
        material: 'Polyester Chiffon.',
        images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1964&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.5,
        reviews: 90,
        category: 'Women',
        type: 'Skirt'
    },
    {
        id: 105,
        name: 'Beige Trench Coat',
        price: 129.00,
        description: 'Classic double-breasted trench coat. Water-resistant and stylish for rainy days.',
        material: 'Cotton Gabardine.',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.9,
        reviews: 65,
        category: 'Women',
        type: 'Jacket'
    },
    {
        id: 106,
        name: 'Silk Scarf',
        price: 25.00,
        description: 'Luxurious silk scarf with a vibrant print. Adds a pop of color to any ensemble.',
        material: '100% Silk.',
        images: ['https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1891&auto=format&fit=crop'],
        sizes: ['One Size'],
        rating: 4.8,
        reviews: 40,
        category: 'Women',
        type: 'Accessories'
    },
    {
        id: 107,
        name: 'Linen Jumpsuit',
        price: 79.00,
        description: 'Effortless linen jumpsuit for a chic one-and-done outfit. Features functional pockets.',
        material: '100% Linen.',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.7,
        reviews: 112,
        category: 'Women',
        type: 'Jumpsuit'
    },
    {
        id: 108,
        name: 'Leather Handbag',
        price: 150.00,
        description: 'Premium leather handbag with spacious interior. Durable hardware and timeless design.',
        material: 'Genuine Leather.',
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop'],
        sizes: ['One Size'],
        rating: 4.9,
        reviews: 88,
        category: 'Women',
        type: 'Accessories'
    },
    {
        id: 109,
        name: 'Essential Linen Tunic',
        price: 89.00,
        description: 'Relaxed fit tunic made from high-quality linen. Great for beach days or casual wear.',
        material: '100% Linen.',
        images: ['https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.6,
        reviews: 55,
        category: 'Women',
        type: 'Top',
        sale: true,
        status: 'featured'
    },

    // --- KIDS' COLLECTION (IDs 200-299) ---
    {
        id: 201,
        name: 'Cotton Graphic Tee',
        price: 25.00,
        description: 'Fun graphic tee made from soft, durable cotton for active kids.',
        material: '100% Cotton.',
        images: ['https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop'],
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        rating: 4.8,
        reviews: 45,
        category: 'Kids',
        type: 'T-Shirt'
    },
    {
        id: 202,
        name: 'Denim Overalls',
        price: 45.00,
        description: 'Classic denim overalls with adjustable straps. Cute and practical for playtime.',
        material: '100% Cotton Denim.',
        images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        rating: 4.7,
        reviews: 60,
        category: 'Kids',
        type: 'Overalls'
    },
    {
        id: 203,
        name: 'Floral Party Dress',
        price: 55.00,
        description: 'Adorable floral dress for special occasions. Comfortable lining and zip closure.',
        material: 'Cotton/Polyester Blend.',
        images: ['https://images.unsplash.com/photo-1621452773781-0f992fd0f5d0?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['3Y', '4Y', '5Y', '6Y'],
        rating: 4.9,
        reviews: 35,
        category: 'Kids',
        type: 'Dress'
    },
    {
        id: 204,
        name: 'Comfort Sweatshirt',
        price: 35.00,
        description: 'Soft and cozy sweatshirt for cooler days. Ribbed cuffs to keep warmth in.',
        material: 'Cotton Fleece.',
        images: ['https://images.unsplash.com/photo-1602826875956-628dc5637213?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        rating: 4.6,
        reviews: 70,
        category: 'Kids',
        type: 'Sweatshirt'
    },
    {
        id: 205,
        name: 'Puffer Jacket',
        price: 65.00,
        description: 'Warm puffer jacket with hood. Lightweight but insulated for maximum warmth.',
        material: 'Nylon/Polyester.',
        images: ['https://images.unsplash.com/photo-1611428813653-568e65842c5b?q=80&w=1951&auto=format&fit=crop'],
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        rating: 4.8,
        reviews: 50,
        category: 'Kids',
        type: 'Jacket'
    },
    {
        id: 206,
        name: 'Casual Sneakers',
        price: 40.00,
        description: 'Durable sneakers for everyday adventures. Velcro straps for easy on and off.',
        material: 'Synthetic Upper, Rubber Sole.',
        images: ['https://images.unsplash.com/photo-1514989940723-e8875ea6f03f?q=80&w=1994&auto=format&fit=crop'],
        sizes: ['10K', '11K', '12K', '13K', '1Y', '2Y'],
        rating: 4.7,
        reviews: 95,
        category: 'Kids',
        type: 'Shoes'
    },
    {
        id: 207,
        name: 'Polka Dot Leggings',
        price: 20.00,
        description: 'Stretchy leggings with a fun pattern. Great for active play or lounging.',
        material: 'Cotton/Spandex.',
        images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1887&auto=format&fit=crop'],
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        rating: 4.5,
        reviews: 110,
        category: 'Kids',
        type: 'Pants'
    },
    {
        id: 208,
        name: 'Striped Polo Shirt',
        price: 30.00,
        description: 'Smart casual polo shirt with classic stripes. Collar stays aligned nicely.',
        material: '100% Cotton Pique.',
        images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop'],
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        rating: 4.6,
        reviews: 40,
        category: 'Kids',
        type: 'Shirt'
    },
];
