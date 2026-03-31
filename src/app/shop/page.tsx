'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ValuePropSection from '@/components/ValuePropSection';
import { useSearchParams } from 'next/navigation';
import { DB } from '@/services/db';
import ProductCard from '@/components/ProductCard';
import {
    Filter, X, ChevronDown, ChevronRight, Search,
    Trash2, LayoutGrid, User, UserCheck, Baby,
    Home, Briefcase, RefreshCcw, Check
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'low-high' },
    { label: 'Price: High to Low', value: 'high-low' },
    { label: 'New Arrivals', value: 'newest' },
];

function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeType, setActiveType] = useState('All');
    const [priceFilters, setPriceFilters] = useState<string[]>([]);
    const [materialFilters, setMaterialFilters] = useState<string[]>([]);
    const [sizeFilters, setSizeFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('featured');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const data = await DB.fetchProducts();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
            setActiveCategory(formattedCat);
        }
    }, [searchParams]);

    // Data Aggregations
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { 'All': products.length };
        products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [products]);

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
                if (p.material) mats.add(p.material.split(',')[0].trim());
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
        return Array.from(szs).sort((a, b) => {
            let iA = order.indexOf(a);
            let iB = order.indexOf(b);
            if (iA === -1 && iB === -1) return a.localeCompare(b);
            if (iA === -1) return 1;
            if (iB === -1) return -1;
            return iA - iB;
        });
    }, [products, activeCategory]);

    // Main Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            // Search
            if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
    }, [products, searchQuery, activeCategory, activeType, priceFilters, materialFilters, sizeFilters, sortOption]);

    const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) +
        (activeType !== 'All' ? 1 : 0) +
        priceFilters.length +
        materialFilters.length +
        sizeFilters.length +
        (searchQuery ? 1 : 0);

    const clearAll = () => {
        setActiveCategory('All');
        setActiveType('All');
        setPriceFilters([]);
        setMaterialFilters([]);
        setSizeFilters([]);
        setSortOption('featured');
        setSearchQuery('');
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'All': return <LayoutGrid size={16} />;
            case 'Men': return <User size={16} />;
            case 'Women': return <UserCheck size={16} />;
            case 'Kids': return <Baby size={16} />;
            case 'Home Textile': return <Home size={16} />;
            case 'Wholesale / B2B': return <Briefcase size={16} />;
            default: return <ChevronRight size={16} />;
        }
    };

    // Sub-component for Filter Sections
    const FilterSection = ({ title, children, isOpenDefault = true }: { title: string, children: React.ReactNode, isOpenDefault?: boolean }) => {
        const [isOpen, setIsOpen] = useState(isOpenDefault);
        return (
            <div className="border-b border-bg-accent pb-4 mb-4 last:border-0 last:mb-0">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full font-bold text-content-heading mb-4 hover:opacity-70 transition-opacity"
                >
                    <span className="uppercase tracking-wider text-xs">{title}</span>
                    <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const CategoriesUI = () => (
        <div className="space-y-1">
            {['All', 'Men', 'Women', 'Kids', 'Home Textile', 'Wholesale / B2B'].map(cat => (
                <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setActiveType('All'); setShowMobileFilters(false); }}
                    className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${activeCategory === cat
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 translate-x-1'
                        : 'text-content-body hover:bg-bg-soft hover:text-content-heading'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <span className={`${activeCategory === cat ? 'text-white' : 'text-brand-primary/60 group-hover:text-brand-primary'} transition-colors`}>
                            {getCategoryIcon(cat)}
                        </span>
                        <span className="font-medium">{cat}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${activeCategory === cat ? 'border-white/30 text-white' : 'border-bg-accent text-content-body/60'
                        }`}>
                        {categoryCounts[cat] || 0}
                    </span>
                </button>
            ))}
        </div>
    );

    const FiltersSidebar = () => (
        <aside className="space-y-6">
            {/* Search */}
            <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-body/40 group-focus-within:text-brand-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search in shop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-soft border border-bg-accent rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                />
            </div>

            <FilterSection title="Category" isOpenDefault={true}>
                <CategoriesUI />
            </FilterSection>

            <FilterSection title="Price Range">
                <div className="space-y-2">
                    {['0-50', '50-100', '100-200', '200+'].map(range => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded hover:bg-bg-soft transition-colors">
                            <input
                                type="checkbox"
                                checked={priceFilters.includes(range)}
                                onChange={() => setPriceFilters(prev => prev.includes(range) ? prev.filter(p => p !== range) : [...prev, range])}
                                className="w-4 h-4 rounded border-bg-accent bg-bg-main text-brand-primary focus:ring-brand-primary transition-colors cursor-pointer"
                            />
                            <span className="text-sm text-content-body group-hover:text-content-heading transition-colors">
                                {range === '200+' ? `${formatPrice(200)}+` : `${formatPrice(parseFloat(range.split('-')[0]))} - ${formatPrice(parseFloat(range.split('-')[1]))}`}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {availableMaterials.length > 0 && (
                <FilterSection title="Material" isOpenDefault={false}>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {availableMaterials.map(mat => (
                            <label key={mat} className="flex items-center justify-between cursor-pointer group px-2 py-1 rounded hover:bg-bg-soft transition-colors">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={materialFilters.includes(mat)}
                                        onChange={() => setMaterialFilters(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat])}
                                        className="w-4 h-4 rounded border-bg-accent bg-bg-main text-brand-primary focus:ring-brand-primary transition-colors cursor-pointer"
                                    />
                                    <span className="text-sm text-content-body group-hover:text-content-heading transition-colors capitalize">{mat}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {availableSizes.length > 0 && (
                <FilterSection title="Size">
                    <div className="grid grid-cols-3 gap-2">
                        {availableSizes.map(sz => (
                            <button
                                key={sz}
                                onClick={() => setSizeFilters(prev => prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz])}
                                className={`py-2 text-[10px] font-bold border-2 rounded-lg transition-all ${sizeFilters.includes(sz)
                                    ? 'bg-content-heading text-bg-main border-content-heading'
                                    : 'bg-bg-main text-content-heading border-bg-accent hover:border-brand-primary'
                                    }`}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {activeFilterCount > 0 && (
                <button
                    onClick={clearAll}
                    className="flex items-center justify-center gap-2 w-full py-3 mt-4 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                >
                    <RefreshCcw size={12} /> Reset All ({activeFilterCount})
                </button>
            )}
        </aside>
    );

    const SortDropdown = ({ mobile = false }: { mobile?: boolean }) => {
        const selectedLabel = SORT_OPTIONS.find(o => o.value === sortOption)?.label || 'Featured';

        return (
            <div className="relative">
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className={`flex items-center justify-between gap-3 px-6 py-4 bg-bg-soft border border-bg-accent text-content-heading rounded-2xl font-bold transition-all hover:border-brand-primary active:scale-95 ${mobile ? 'flex-1 w-full' : 'min-w-[240px]'}`}
                >
                    <div className="flex items-center gap-2">
                        {!mobile && <span className="text-[10px] uppercase font-bold text-content-body/40 tracking-tighter">Sort By:</span>}
                        <span className="text-sm uppercase tracking-wider">{selectedLabel}</span>
                    </div>
                    <ChevronDown size={16} className={`text-brand-primary transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isSortOpen && (
                        <>
                            <div className="fixed inset-0 z-110" onClick={() => setIsSortOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={`absolute z-120 mt-2 w-full min-w-[220px] bg-bg-main/80 backdrop-blur-xl border border-bg-accent rounded-3xl shadow-2xl p-2 overflow-hidden ${mobile ? 'left-0' : 'right-0'}`}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${sortOption === option.value
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                            : 'text-content-body hover:bg-bg-soft hover:text-content-heading'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortOption === option.value && <Check size={14} className="text-white" />}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="pt-20">
            {/* Page Header */}
            <div className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-bg-soft skew-y-1 -translate-y-12 transition-colors -z-10" />
                <div className="container mx-auto px-6 relative text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase italic"
                    >
                        The Modernist Collection
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-content-heading">Shop Everything</h1>
                    <p className="max-w-xl mx-auto text-content-body text-lg font-light leading-relaxed">
                        Curated minimalist essentials for the modern lifestyle. Quality materials, timeless designs.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 sticky top-32">
                        <FiltersSidebar />
                    </div>

                    {/* Mobile Filter Toggle & Bottom Sheet */}
                    <div className="lg:hidden w-full flex flex-col sm:flex-row gap-3 mb-8">
                        <button
                            className="flex-1 flex items-center justify-between px-6 py-4 bg-bg-soft border border-bg-accent text-content-heading rounded-2xl font-bold transition-all active:scale-95"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <div className="flex items-center gap-3">
                                <Filter size={20} className="text-brand-primary" />
                                <span className="text-sm uppercase tracking-wider">Refine Selection</span>
                            </div>
                            <span className="bg-brand-primary text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        </button>
                        <SortDropdown mobile />
                    </div>

                    <AnimatePresence>
                        {showMobileFilters && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm lg:hidden"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-bg-main p-8 shadow-2xl overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-playfair font-bold">Filters</h2>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2 rounded-full bg-bg-soft text-content-heading hover:bg-bg-accent transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <FiltersSidebar />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content Area */}
                    <div className="flex-1">
                        {/* Status Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h2 className="text-sm font-bold text-content-heading uppercase tracking-widest flex items-center gap-2">
                                    {filteredProducts.length} <span className="font-light italic text-content-body lowercase">Available Pieces</span>
                                </h2>
                                {activeCategory !== 'All' && (
                                    <p className="text-xs text-brand-primary mt-1 font-medium italic">Showing items in "{activeCategory}"</p>
                                )}
                            </div>

                            <div className="hidden lg:block">
                                <SortDropdown />
                            </div>
                        </div>

                        {/* Product Type Pills (Moved back to main area) */}
                        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {availableTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type)}
                                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border-2 transition-all ${activeType === type
                                        ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                        : 'border-bg-accent text-content-body bg-bg-soft hover:border-content-heading'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
                        >
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[4/5] bg-bg-soft rounded-2xl mb-4" />
                                        <div className="h-4 bg-bg-soft rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-bg-soft rounded w-1/4" />
                                    </div>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard
                                            product={{
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.images?.[0] || product.image,
                                                images: product.images,
                                                sale: product.sale
                                            }}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-32 flex flex-col items-center text-center space-y-6 bg-bg-soft/50 border border-dashed border-bg-accent rounded-3xl"
                                >
                                    <div className="w-20 h-20 rounded-full bg-bg-soft flex items-center justify-center text-content-body/20">
                                        <Trash2 size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-playfair font-bold text-content-heading">Nothing fits those filters</h3>
                                        <p className="text-content-body mt-2">Try adjusting your filters or search terms.</p>
                                    </div>
                                    <button
                                        onClick={clearAll}
                                        className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Clear All Filters
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export function ShopPage() {
    return (
        <main className="min-h-screen bg-bg-main font-sans text-content-body transition-colors">
            <Navbar />
            <Suspense fallback={<div className="container mx-auto px-6 pt-32 text-center text-content-heading py-20 animate-pulse">Initializing Boutique...</div>}>
                <ShopContent />
            </Suspense>
            <ValuePropSection />
            <Footer />
        </main>
    );
}

export default ShopPage;
