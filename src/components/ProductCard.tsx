'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, Plus } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ProductProps {
    id: number;
    name: string;
    price: string;
    image: string;
    sale?: boolean;
    hoverImage?: string;
    images?: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isIn = isInWishlist(product.id);

    // 3D Tilt Setup
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const rotateX = useTransform(springY, [0, 1], ["8deg", "-8deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-8deg", "8deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width);
        y.set((event.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

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
                image: product.image,
                images: product.images
            });
        }
    };

    const [flyItems, setFlyItems] = useState<{ id: number; x: number; y: number; }[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

        // Trigger Fly-to-Cart Animation
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const newFlyItem = {
            id: Date.now(),
            x: rect.left + rect.width / 2 - 20, // Center minus half width (40/2)
            y: rect.top + rect.height / 2 - 20
        };

        setFlyItems(prev => [...prev, newFlyItem]);

        setTimeout(() => {
            setFlyItems(prev => prev.filter(item => item.id !== newFlyItem.id));
        }, 800);
    };

    // Determine fallback hover image
    const hoverImageSrc = product.hoverImage || (product.images && product.images.length > 1 ? product.images[1] : (product.image ? product.image.replace('lifestyle', 'studio').replace('1', '2') : '')) || `/images/fallback-product.png`;

    return (
        <motion.div
            className="group relative bg-bg-main border border-bg-accent rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1000,
            }}
        >
            {/* Image Container */}
            <div className="aspect-4/5 bg-gray-200 relative overflow-hidden rounded-t-lg" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                <Link href={`/product/${product.id}`} className="block w-full h-full cursor-pointer">
                    {/* Primary Image */}
                    <img
                        src={product.image || '/images/fallback-product.png'}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0 z-10"
                        onError={(e) => {
                            e.currentTarget.src = '/images/fallback-product.png';
                        }}
                    />
                    {/* Secondary/Hover Image */}
                    <img
                        src={hoverImageSrc || '/images/fallback-product.png'}
                        alt={`${product.name} Alternative View`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-110 z-0"
                        onError={(e) => {
                            e.currentTarget.src = '/images/fallback-product.png';
                        }}
                    />
                </Link>

                {/* Wishlist Button - Top Right */}
                <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${isIn
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0'
                    }`}>
                    <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={toggleWishlist}
                        className={`bg-bg-main/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-bg-soft flex items-center justify-center transition-colors duration-300 ${isIn ? 'text-red-500' : 'text-content-body hover:text-red-500'}`}
                    >
                        <Heart className={`w-5 h-5 transition-transform ${isIn ? 'fill-current scale-110' : 'scale-100'}`} />
                    </motion.button>
                </div>

                {/* Add to Cart - Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-bg-main/95 backdrop-blur-md py-3 flex justify-center items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-bg-accent">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={handleAddToCart}
                        className="text-sm font-semibold text-content-heading hover:text-brand-primary flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add to Cart
                    </motion.button>
                </div>


                {/* Sale Badge */}
                {product.sale && (
                    <span className="absolute top-4 left-4 bg-brand-primary text-bg-main text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wide">Sale</span>
                )}
            </div>

            {/* Info */}
            <div className="p-4 text-center rounded-b-lg bg-bg-main relative z-10 block" style={{ transform: "translateZ(40px)" }}>
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-content-heading text-lg mb-1 hover:text-brand-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-brand-primary font-medium">${product.price}</p>
            </div>

            {/* Fly to Cart Animation Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {flyItems.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 1, scale: 0.5, x: item.x, y: item.y }}
                            animate={{
                                opacity: [1, 1, 0],
                                scale: [0.5, 1, 0.2],
                                x: window.innerWidth - 60, // Top right corner approximation
                                y: 20
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                                times: [0, 0.4, 1] // Adjust timing for a trajectory arc
                            }}
                            style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', top: 0, left: 0 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-bg-main shadow-2xl overflow-hidden border-2 border-bg-main">
                                <img src={product.image || '/images/fallback-product.png'} className="w-full h-full object-cover opacity-80" alt="" onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>,
                document.body
            )}
        </motion.div>
    );
}
