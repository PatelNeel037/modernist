'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/context/ToastContext';
import { Star, Truck, RefreshCw, ShieldCheck, Heart, ShoppingBag, Zap } from 'lucide-react';
import { allProducts } from '@/data/products';

const getProduct = (id: string) => {
    return allProducts.find(p => p.id === parseInt(id));
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const product = getProduct(productId);
    const router = useRouter();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    // We'll initialize state with defaults if product exists, otherwise null
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState(product ? product.images[0] : '');
    const [quantity, setQuantity] = useState(1);

    // If product changes (unlikely in this page unless navigation happens), update image
    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    if (!product) {
        notFound();
        return null; // TS satisfaction
    }

    // Get related products (same category, excluding current one)
    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

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

    const handleAddToCart = () => {
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

        // Stay on page
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
                    <Link href="/shop/men" className="hover:text-gray-900">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-gray-900 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex text-yellow-400 text-sm gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 text-gray-300" />
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                        </div>

                        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-2xl font-medium text-gray-900 mb-6">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-900">Select Size</h4>
                                <Link href="/size-guide" className="text-sm text-gray-500 underline hover:text-gray-900">Size Guide</Link>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center rounded border transition-all ${selectedSize === size
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'text-gray-600 border-gray-200 hover:border-gray-900'
                                            }`}
                                    >
                                        {size}
                                    </button>
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
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-14 h-auto flex items-center justify-center border border-gray-200 rounded transition-all ${isIn ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isIn ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-white border border-gray-900 text-gray-900 py-3 px-6 rounded font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-gray-900 text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Zap className="w-5 h-5" /> Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex items-start gap-3">
                                <Truck className="text-gray-400 w-5 h-5 mt-1" />
                                <div>
                                    <h5 className="font-medium text-gray-900 text-sm">Free Shipping & Returns</h5>
                                    <p className="text-gray-500 text-sm mt-1">Free standard shipping on orders over $100.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RefreshCw className="text-gray-400 w-5 h-5 mt-1" />
                                <div>
                                    <h5 className="font-medium text-gray-900 text-sm">Easy Returns</h5>
                                    <p className="text-gray-500 text-sm mt-1">30-day return policy for a full refund.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="text-gray-400 w-5 h-5 mt-1" />
                                <div>
                                    <h5 className="font-medium text-gray-900 text-sm">Secure Payment</h5>
                                    <p className="text-gray-500 text-sm mt-1">All payments are processed securely.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-medium text-gray-900 mb-2">Material & Care</h4>
                            <p className="text-gray-600 text-sm">{product.material}</p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-24">
                    <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {relatedProducts.map(prod => (
                            <ProductCard
                                key={prod.id}
                                product={{
                                    ...prod,
                                    image: prod.images[0],
                                    price: typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
