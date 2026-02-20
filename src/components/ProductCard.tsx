'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductProps {
    id: number;
    name: string;
    price: string;
    image: string;
    sale?: boolean;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isIn = isInWishlist(product.id);

    // ... (toggleWishlist logic remains same)

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isIn) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price), // ensure float
                image: product.image
            });
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1,
            size: 'M' // Default size for quick add
        });
    };

    return (
        <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Image Container */}
            <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                <Link href={`/product/${product.id}`}>
                    {/* ... image logic ... */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x500/F5F5F5/31343C?text=${product.name}`;
                        }}
                    />
                </Link>

                {/* Wishlist Button - Top Right */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 ${isIn ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                    <i className={`${isIn ? 'fas' : 'far'} fa-heart`}></i>
                </button>

                {/* Add to Cart - Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md py-3 flex justify-center items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-gray-100">
                    <button onClick={handleAddToCart} className="text-sm font-semibold text-content-heading hover:text-brand-primary flex items-center gap-2 transition-colors">
                        <i className="fas fa-plus"></i> Add to Cart
                    </button>
                </div>


                {/* Sale Badge */}
                {product.sale && (
                    <span className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wide">Sale</span>
                )}
            </div>

            {/* Info */}
            <div className="p-4 text-center">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-content-heading text-lg mb-1 hover:text-brand-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-brand-primary font-medium">${product.price}</p>
            </div>
        </div>
    );
}
