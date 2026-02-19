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

export interface Collection {
    id: number;
    name: string;
    image: string;
    type: string;
}

export const collections: Collection[] = [
    {
        id: 6,
        name: 'Men Collection',
        image: 'images/men.png',
        type: 'category'
    },
    {
        id: 7,
        name: 'Women Collection',
        image: 'images/women.png',
        type: 'category'
    },
    {
        id: 8,
        name: 'Kids Collection',
        image: 'images/kids.png',
        type: 'category'
    }
];

export const allProducts: Product[] = [
    {
        id: 2,
        name: 'Classic Beige Shirt',
        price: 75.00,
        images: ['images/shirt_front.png', 'images/shirt_back.png'],
        category: 'Women', // Capitalized
        type: 'Shirt',
        description: 'The essential beige shirt for any wardrobe. Tailored fit with a soft touch finish.',
        material: '95% Cotton, 5% Elastane',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        rating: 4.5,
        reviews: 24,
        status: 'new'
    },
    {
        id: 4,
        name: 'Essential Linen Tunic',
        price: 89.00,
        // Used existing image for better visuals
        images: ['https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1887&auto=format&fit=crop', 'images/shirt_back.png'],
        category: 'Women',
        type: 'Shirt',
        description: 'A long-line tunic perfect for layering. Features side splits and a relaxed collar.',
        material: '100% Organic Linen',
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.8,
        reviews: 56,
        sale: true,
        status: 'featured'
    },
    {
        id: 5,
        name: 'Kids Denim Jacket',
        price: 55.00,
        images: ['images/kids.png'],
        category: 'Kids',
        type: 'Jacket',
        description: 'Durable and cool, this denim jacket is ready for any adventure.',
        material: '100% Denim Cotton',
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        rating: 4.7,
        reviews: 32
    },
    {
        id: 9,
        name: 'Urban Chino Pants',
        price: 65.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1473966968600-870d11f2eb08?q=80&w=2071&auto=format&fit=crop'],
        category: 'Men',
        type: 'Pants',
        description: 'Versatile chinos perfect for office or casual weekends.',
        material: '98% Cotton, 2% Elastane',
        sizes: ['30', '32', '34', '36', '38'],
        rating: 4.6,
        reviews: 88
    },
    {
        id: 10,
        name: 'Oxford Button Down',
        price: 59.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop', 'images/shirt_back.png'],
        category: 'Men',
        type: 'Shirt',
        description: 'A crisp oxford shirt that pairs with everything.',
        material: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.5,
        reviews: 42
    },
    {
        id: 15,
        name: 'Modern Slim Suit',
        price: 199.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1780&auto=format&fit=crop'],
        category: 'Men',
        type: 'Suit',
        description: 'Sharp, tailored fit for the contemporary professional.',
        material: 'Wool Blend',
        sizes: ['38R', '40R', '42R', '44R'],
        rating: 5.0,
        reviews: 15,
        status: 'featured'
    },
    {
        id: 16,
        name: 'Casual Weekend Blazer',
        price: 129.00,
        images: ['images/men.png'],
        category: 'Men',
        type: 'Jacket',
        description: 'Unstructured blazer for a smart-casual look.',
        material: 'Linen Blend',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.4,
        reviews: 28
    },
    {
        id: 11,
        name: 'Floral Summer Dress',
        price: 85.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop'],
        category: 'Women',
        type: 'Dress',
        description: 'Flowy and feminine, capturing the essence of summer.',
        material: '100% Viscose',
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.9,
        reviews: 120,
        status: 'bestseller'
    },
    {
        id: 12,
        name: 'Silk Blouse',
        price: 110.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1974&auto=format&fit=crop'],
        category: 'Women',
        type: 'Shirt',
        description: 'Luxurious silk blouse for a touch of elegance.',
        material: '100% Silk',
        sizes: ['S', 'M', 'L'],
        rating: 4.7,
        reviews: 45
    },
    {
        id: 13,
        name: 'Cotton Graphic Tee',
        price: 25.00,
        // Used existing image
        images: ['https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop'],
        category: 'Kids',
        type: 'T-Shirt',
        description: 'Fun and playful graphic tee for everyday wear.',
        material: '100% Organic Cotton',
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        rating: 4.8,
        reviews: 65
    },
    {
        id: 14,
        name: 'Comfy Joggers',
        price: 35.00,
        images: ['images/kids.png'],
        category: 'Kids',
        type: 'Pants',
        description: 'Soft joggers designed for active kids.',
        material: '80% Cotton, 20% Polyester',
        sizes: ['4Y', '6Y', '8Y', '10Y'],
        rating: 4.6,
        reviews: 38
    }
];
