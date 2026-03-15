'use client';

import { useState, useEffect, useRef, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/context/ToastContext';
import { Star, Truck, RefreshCw, ShieldCheck, Heart, ShoppingBag, Zap, X } from 'lucide-react';
import { DB } from '@/services/db';
import { formatPrice } from '@/lib/currency';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';

const ParallaxGalleryImage = ({ src, alt, index }: { src: string, alt: string, index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <div ref={ref} className="aspect-4/5 bg-bg-soft rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
            <motion.img
                src={src}
                alt={`${alt} ${index + 1}`}
                style={{ y }}
                className="w-full h-[130%] object-cover absolute top-[-15%] origin-center pointer-events-none"
            />
        </div>
    );
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();

    // State
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [flyItems, setFlyItems] = useState<{ id: number; x: number; y: number; }[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [newReviewName, setNewReviewName] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Hooks
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Fetch Product & Reviews
    useEffect(() => {
        const load = async () => {
            const data = await DB.fetchProduct(productId);
            if (!data) {
                setLoading(false);
                return;
            }
            setProduct(data);
            setMainImage(data.images[0]);
            setLoading(false);

            // Fetch reviews
            const revData = await DB.fetchReviews(productId);
            setReviews(revData);
            setReviewLoading(false);
        };
        load();
    }, [productId]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast('Please login to leave a review', 'error');
            return;
        }

        setSubmittingReview(true);
        const finalName = newReviewName.trim() || user.name || 'Anonymous';
        const result = await DB.submitReview(productId, newRating, newComment, finalName);

        if (result.success) {
            showToast('Review submitted successfully!', 'success');
            setNewComment('');
            setShowReviewForm(false);
            // Refresh reviews
            const revData = await DB.fetchReviews(productId);
            setReviews(revData);
            // Optionally update product localized state if needed
        } else {
            showToast(result.message || 'Failed to submit review', 'error');
        }
        setSubmittingReview(false);
    };

    // Update image if product changes (not strictly needed if set in fetch, but safe to keep)
    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    // Fetch Related Products
    useEffect(() => {
        if (!product) return;
        const loadRelated = async () => {
            const all = await DB.fetchProducts();
            const related = all.filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4);
            setRelatedProducts(related);
        };
        loadRelated();
    }, [product]);

    // Track Recently Viewed
    useEffect(() => {
        if (!product) return;

        try {
            const existingRaw = localStorage.getItem('modernist_recently_viewed');
            let existing = existingRaw ? JSON.parse(existingRaw) : [];

            // Remove if already exists so we can move it to front
            existing = existing.filter((p: any) => p.id !== product.id);

            // Add current product to front
            existing.unshift({
                id: product.id,
                name: product.name,
                price: product.price,
                images: product.images,
                image: product.images[0], // ProductCard expects 'image'
                category: product.category,
                sale: product.sale,
                hoverImage: product.hoverImage,
                rating: product.rating,
                reviews: product.reviews
            });

            // Keep only latest 6 items
            existing = existing.slice(0, 6);

            localStorage.setItem('modernist_recently_viewed', JSON.stringify(existing));

            // Set state (excluding the exact product being viewed to prevent self-looping in the ui) 
            setRecentlyViewed(existing.filter((p: any) => p.id !== product.id).slice(0, 4));
        } catch (e) {
            console.error("Failed to parse recently viewed memory", e);
        }
    }, [product]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    }

    if (!product) {
        notFound();
        return null; // TS satisfaction
    }

    // Derived state must be calculated after the null check
    const isIn = isInWishlist(product.id);

    const toggleWishlist = () => {
        if (isIn) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
            });
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: quantity
        });

        // Trigger Fly-to-Cart Animation
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const newFlyItem = {
            id: Date.now(),
            x: rect.left + rect.width / 2 - 20,
            y: rect.top + rect.height / 2 - 20
        };

        setFlyItems(prev => [...prev, newFlyItem]);

        setTimeout(() => {
            setFlyItems(prev => prev.filter(item => item.id !== newFlyItem.id));
        }, 800);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }

        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: quantity
        };

        if (!user) {
            showToast('Please login to complete your purchase.', 'error');
            sessionStorage.setItem('modernist_buy_now_item', JSON.stringify(item));
            setTimeout(() => { router.push('/login'); }, 1000);
            return;
        }

        sessionStorage.setItem('modernist_buy_now_item', JSON.stringify(item));
        router.push('/checkout?mode=buy_now');
    };

    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Breadcrumbs */}
            <div className="pt-28 pb-4 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-gray-900">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Parallax Image Gallery (Desktop) */}
                    <div className="hidden md:flex flex-col gap-8 relative">
                        {product.images.map((img: string, idx: number) => (
                            <ParallaxGalleryImage key={idx} src={img} alt={product.name} index={idx} />
                        ))}
                    </div>

                    {/* Swipeable Image Carousel (Mobile) */}
                    <div className="md:hidden space-y-4">
                        <div className="aspect-4/5 bg-bg-soft rounded-lg overflow-hidden relative group cursor-grab active:cursor-grabbing">
                            {/* Inner Drag Constraint Container */}
                            <motion.div
                                className="flex h-full"
                                style={{ width: `${product.images.length * 100}%` }}
                                drag="x"
                                dragConstraints={{ right: 0, left: 0 }} // Managed via state/animation visually
                                animate={{ x: `-${currentImageIndex * (100 / product.images.length)}%` }}
                                dragElastic={0.2}
                                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipeThreshold = 50;
                                    if (offset.x < -swipeThreshold && currentImageIndex < product.images.length - 1) {
                                        setCurrentImageIndex(currentImageIndex + 1);
                                    } else if (offset.x > swipeThreshold && currentImageIndex > 0) {
                                        setCurrentImageIndex(currentImageIndex - 1);
                                    }
                                }}
                            >
                                {product.images.map((img: string, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        className="h-full shrink-0 flex-none"
                                        style={{ width: `${100 / product.images.length}%` }}
                                    >
                                        <img
                                            src={img || '/images/fallback-product.png'}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover pointer-events-none" // Disable pointer events so drag works smoothly over images
                                            onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Floating Helper Pill */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="animate-pulse">←</span> Swipe to explore <span className="animate-pulse">→</span>
                            </div>
                        </div>

                        {/* Pagination Dots (Optional Visual Indicator instead of old thumbnails) */}
                        <div className="flex justify-center space-x-2 pt-2">
                            {product.images.map((_: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-gray-900 w-4' : 'bg-gray-300 w-2 hover:bg-gray-400'}`}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="md:sticky md:top-36 bg-bg-main p-0 md:p-6 md:-m-6 rounded-xl">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex text-yellow-400 text-sm gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                        </div>

                        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-2xl font-medium text-gray-900 mb-6">{formatPrice(product.price)}</p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-900">Select Size</h4>
                                <button onClick={() => setShowSizeGuide(true)} className="text-sm text-gray-400 border-b border-gray-400 hover:text-gray-900 hover:border-gray-900 transition-colors pb-0.5">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size: string) => (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center rounded border transition-colors ${selectedSize === size
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'text-gray-600 border-gray-200 hover:border-gray-900'
                                            }`}
                                    >
                                        {size}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex gap-4">
                                <div className="flex items-center border border-gray-300 rounded w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                                    >-</button>
                                    <span className="flex-1 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                                    >+</button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.85 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={toggleWishlist}
                                    className={`w-14 h-auto flex items-center justify-center border rounded transition-colors duration-300 ${isIn
                                        ? 'text-red-500 border-red-200 bg-red-50 shadow-sm'
                                        : 'text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50/30'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 transition-transform duration-300 ${isIn ? 'fill-current scale-110' : 'scale-100 hover:scale-110'}`} />
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={handleAddToCart}
                                    className="bg-white border border-gray-900 text-gray-900 py-3 px-6 rounded font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    onClick={handleBuyNow}
                                    className="bg-gray-900 text-white py-3 px-6 rounded font-medium hover:bg-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                                >
                                    <Zap className="w-5 h-5" /> Buy Now
                                </motion.button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex items-start gap-3">
                                <Truck className="text-gray-400 w-5 h-5 mt-1" />
                                <div className="text-sm">
                                    <h5 className="font-medium text-gray-900">Free Shipping & Returns</h5>
                                    <p className="text-gray-500 mt-1">Free standard shipping on orders over {formatPrice(100)}.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RefreshCw className="text-gray-400 w-5 h-5 mt-1" />
                                <div className="text-sm">
                                    <h5 className="font-medium text-gray-900">Easy Returns</h5>
                                    <p className="text-gray-500 mt-1">30-day return policy for a full refund.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="text-gray-400 w-5 h-5 mt-1" />
                                <div className="text-sm">
                                    <h5 className="font-medium text-gray-900">Secure Payment</h5>
                                    <p className="text-gray-500 mt-1">All payments are processed securely.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-medium text-gray-900 mb-2">Material & Care</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{product.material}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-gray-900">Customer Reviews</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="font-medium text-gray-900">{product.rating || 0} out of 5</span>
                                <span className="text-gray-500">({product.reviews || 0} reviews)</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={() => {
                                if (!user) {
                                    showToast('Please login to leave a review', 'error');
                                    router.push('/login');
                                } else {
                                    setNewReviewName(user?.name || '');
                                    setShowReviewForm(!showReviewForm);
                                }
                            }}
                            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                        >
                            {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </motion.button>
                    </div>

                    {showReviewForm && (
                        <div className="bg-gray-50 p-8 rounded-xl mb-12 border border-gray-100 max-w-2xl">
                            <h3 className="text-xl font-bold mb-6">Write your review</h3>
                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={newReviewName}
                                        onChange={(e) => setNewReviewName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-gray-900 outline-none"
                                        placeholder="How should we display your name?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <motion.button
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.8 }}
                                                key={num}
                                                type="button"
                                                onClick={() => setNewRating(num)}
                                                className=""
                                            >
                                                <Star className={`w-8 h-8 ${num <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
                                    <textarea
                                        required
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-gray-900 outline-none resize-none"
                                        rows={4}
                                        placeholder="What did you like or dislike about this product?"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    disabled={submittingReview}
                                    type="submit"
                                    className="w-full md:w-auto bg-gray-900 text-white px-10 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {submittingReview ? 'Submitting...' : 'Post Review'}
                                </motion.button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-8 max-w-4xl">
                        {reviewLoading ? (
                            <p className="text-gray-500 italic">Loading reviews...</p>
                        ) : reviews.length > 0 ? (
                            reviews.map((rev) => (
                                <div key={rev._id} className="pb-8 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{rev.userName}</h4>
                                            <div className="flex text-yellow-400 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedProducts.map(prod => (
                                <ProductCard
                                    key={prod.id}
                                    product={{
                                        ...prod,
                                        image: prod.images?.[0] || prod.image,
                                        images: prod.images,
                                        price: prod.price
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-24 mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-playfair font-bold text-gray-900">Recently Viewed</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {recentlyViewed.map(prod => (
                                <ProductCard
                                    key={`recent-${prod.id}`}
                                    product={{
                                        ...prod,
                                        image: prod.images?.[0] || prod.image,
                                        images: prod.images,
                                        price: prod.price
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowSizeGuide(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-2xl font-playfair font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-brand-primary" /> Size Guide
                            </h2>
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 overflow-y-auto">
                            <p className="text-gray-600 mb-6 font-medium">Use this chart to find your perfect fit. Measurements are in inches.</p>

                            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-900">
                                            <th className="px-6 py-4 font-bold rounded-tl-lg">Size</th>
                                            <th className="px-6 py-4 font-bold">Chest</th>
                                            <th className="px-6 py-4 font-bold">Waist</th>
                                            <th className="px-6 py-4 font-bold rounded-tr-lg">Hips</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-600">
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">XS</td>
                                            <td className="px-6 py-4">32-34</td>
                                            <td className="px-6 py-4">26-28</td>
                                            <td className="px-6 py-4">34-36</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">S</td>
                                            <td className="px-6 py-4">35-37</td>
                                            <td className="px-6 py-4">29-31</td>
                                            <td className="px-6 py-4">37-39</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 bg-gray-50/50 transition-colors border-l-4 border-l-black">
                                            <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                                                M <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Popular</span>
                                            </td>
                                            <td className="px-6 py-4">38-40</td>
                                            <td className="px-6 py-4">32-34</td>
                                            <td className="px-6 py-4">40-42</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">L</td>
                                            <td className="px-6 py-4">41-43</td>
                                            <td className="px-6 py-4">35-37</td>
                                            <td className="px-6 py-4">43-45</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">XL</td>
                                            <td className="px-6 py-4">44-46</td>
                                            <td className="px-6 py-4">38-40</td>
                                            <td className="px-6 py-4">46-48</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 bg-gray-50 p-5 rounded-lg flex items-start gap-4 border border-gray-100">
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Between Sizes?</h4>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">If your measurements are in between those listed in the size chart, pick the next larger size for a looser, relaxed fit, or the next smaller size for a tighter fit.</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto flex justify-end">
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium shadow-md shadow-black/10"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-2xl overflow-hidden border-2 border-white">
                                <img src={mainImage || '/images/fallback-product.png'} className="w-full h-full object-cover opacity-80" alt="" onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>,
                document.body
            )}

            <Footer />
        </main>
    );
}

