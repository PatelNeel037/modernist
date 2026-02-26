'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { DB } from '@/services/db';
import ProductCard from '@/components/ProductCard';
import { Filter, X, ChevronDown } from 'lucide-react';

function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    // ... existing ...

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const data = await DB.fetchProducts();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);
    const [activeType, setActiveType] = useState('All');

    // New Filters
    const [priceFilters, setPriceFilters] = useState<string[]>([]);
    const [materialFilters, setMaterialFilters] = useState<string[]>([]);
    const [sizeFilters, setSizeFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('featured');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
            setActiveCategory(formattedCat);
        }
    }, [searchParams]);

    // Available Metas
    const availableTypes = useMemo(() => {
        const types = new Set(['All']);
        products.forEach(p => {
            if (activeCategory === 'All' || p.category === activeCategory) {
                if (p.type) types.add(p.type);
            }
        });
        return Array.from(types).sort();
    }, [products, activeCategory]);

    const availableMaterials = useMemo(() => {
        const mats = new Set<string>();
        products.forEach(p => {
            if (activeCategory === 'All' || p.category === activeCategory) {
                if (p.material) mats.add(p.material.split(',')[0].trim()); // simplified
            }
        });
        return Array.from(mats).sort();
    }, [products, activeCategory]);

    const availableSizes = useMemo(() => {
        const szs = new Set<string>();
        products.forEach(p => {
            if (activeCategory === 'All' || p.category === activeCategory) {
                if (Array.isArray(p.sizes)) p.sizes.forEach((s: string) => szs.add(s));
            }
        });
        const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        // Sort unknown sizes alphabetically at the end
        return Array.from(szs).sort((a, b) => {
            let iA = order.indexOf(a);
            let iB = order.indexOf(b);
            if (iA === -1 && iB === -1) return a.localeCompare(b);
            if (iA === -1) return 1;
            if (iB === -1) return -1;
            return iA - iB;
        });
    }, [products, activeCategory]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            // Category
            if (activeCategory !== 'All' && product.category !== activeCategory) return false;
            // Type
            if (activeType !== 'All' && product.type !== activeType) return false;

            // Price
            if (priceFilters.length > 0) {
                const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                const matchesPrice = priceFilters.some(range => {
                    if (range === '0-50') return price < 50;
                    if (range === '50-100') return price >= 50 && price <= 100;
                    if (range === '100-200') return price > 100 && price <= 200;
                    if (range === '200+') return price > 200;
                    return false;
                });
                if (!matchesPrice) return false;
            }

            // Material
            if (materialFilters.length > 0) {
                const mat = product.material ? product.material.toLowerCase() : '';
                const matchesMat = materialFilters.some(m => mat.includes(m.toLowerCase()));
                if (!matchesMat) return false;
            }

            // Size
            if (sizeFilters.length > 0) {
                if (!product.sizes || !Array.isArray(product.sizes)) return false;
                const matchesSize = product.sizes.some((s: string) => sizeFilters.includes(s));
                if (!matchesSize) return false;
            }

            return true;
        });

        // Sorting
        if (sortOption === 'low-high') {
            result.sort((a, b) => (Number(a.price) - Number(b.price)));
        } else if (sortOption === 'high-low') {
            result.sort((a, b) => (Number(b.price) - Number(a.price)));
        } else if (sortOption === 'newest') {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [products, activeCategory, activeType, priceFilters, materialFilters, sizeFilters, sortOption]);

    const togglePrice = (range: string) => {
        setPriceFilters(prev => prev.includes(range) ? prev.filter(p => p !== range) : [...prev, range]);
    };

    const toggleMaterial = (mat: string) => {
        setMaterialFilters(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);
    };

    const toggleSize = (sz: string) => {
        setSizeFilters(prev => prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]);
    };

    const clearAll = () => {
        setActiveCategory('All');
        setActiveType('All');
        setPriceFilters([]);
        setMaterialFilters([]);
        setSizeFilters([]);
        setSortOption('featured');
    };

    return (
        <>
            {/* Header */}
            <div className="pt-32 pb-12 text-center bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Our Collections</h1>
                    <p className="text-gray-600 text-lg">Explore our carefully curated styles for every occasion.</p>
                </div>
            </div>

            <section className="py-12 container mx-auto px-6 flex flex-col md:flex-row gap-8 items-start">

                {/* Mobile Filter Toggle */}
                <button
                    className="md:hidden w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <Filter size={18} /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Sidebar Filters */}
                <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>

                    {/* Category */}
                    <div>
                        <h3 className="font-bold mb-4 text-gray-900 border-b pb-2">Category</h3>
                        <div className="space-y-2">
                            {['All', 'Men', 'Women', 'Kids'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setActiveType('All'); }}
                                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <h3 className="font-bold mb-4 text-gray-900 border-b pb-2">Price</h3>
                        <div className="space-y-2">
                            {['0-50', '50-100', '100-200', '200+'].map(range => (
                                <label key={range} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={priceFilters.includes(range)}
                                        onChange={() => togglePrice(range)}
                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span className="text-sm text-gray-600">
                                        {range === '200+' ? '$200+' : `$${range.replace('-', ' - $')}`}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Material */}
                    {availableMaterials.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-4 text-gray-900 border-b pb-2">Material</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {availableMaterials.map(mat => (
                                    <label key={mat} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={materialFilters.includes(mat)}
                                            onChange={() => toggleMaterial(mat)}
                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className="text-sm text-gray-600 capitalize">{mat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size */}
                    {availableSizes.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-4 text-gray-900 border-b pb-2">Size</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {availableSizes.map(sz => (
                                    <button
                                        key={sz}
                                        onClick={() => toggleSize(sz)}
                                        className={`py-1.5 text-xs font-medium border rounded transition-colors ${sizeFilters.includes(sz)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={clearAll} className="w-full py-2 text-sm text-gray-500 underline hover:text-black">
                        Reset All Filters
                    </button>
                </aside>

                {/* Main Content */}
                <div className="flex-1">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

                        {/* Type Pills */}
                        <div className="flex flex-wrap gap-2">
                            {availableTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeType === type
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pr-6"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-20">Loading products...</div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price,
                                        image: product.images[0],
                                        sale: product.sale
                                    }}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded">
                                <p className="text-xl mb-4">No products found matching your filters.</p>
                                <button onClick={clearAll} className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </>
    );
}

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />
            <Suspense fallback={<div className="text-center pt-32">Loading shop...</div>}>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
}
