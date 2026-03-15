'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, Heart, ChevronRight, LogOut, Package, IdCard, Sun, Moon } from 'lucide-react';
import { motion, useScroll, useVelocity, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { DB } from '@/services/db';
import CartDrawer from './CartDrawer';
import { formatPrice } from '@/lib/currency';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { getCartCount, openCart } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
        <Link href={href} className={`relative group text-sm font-medium transition-colors ${isActive(href) ? 'text-brand-primary' : 'text-bg-main/80 hover:text-bg-main'}`}>
            {children}
            <span className={`absolute left-0 -bottom-1 h-[2px] bg-brand-primary transition-all duration-300 ${isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSearchOpen(false);
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await DB.fetchProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults(products.slice(0, 4));
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery))
        ).slice(0, 8);

        setSearchResults(filtered);
    };

    const [isUserOpen, setIsUserOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);

    const wishlistCount = wishlist.length;
    const cartCount = getCartCount();

    const isHome = pathname === '/';
    const [yOffset, setYOffset] = useState(0);
    const lastScrollY = useRef(0);
    const { scrollY } = useScroll();

    useEffect(() => {
        setIsScrolled(!isHome || window.scrollY > 50);
        setYOffset(0);
    }, [pathname, isHome]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const diff = latest - lastScrollY.current;
        setIsScrolled(!isHome || latest > 50);
        if (latest < 50) {
            setYOffset(0);
        } else {
            setYOffset((prev) => {
                const newOffset = prev - diff;
                return Math.max(-100, Math.min(0, newOffset));
            });
        }
        lastScrollY.current = latest;
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; }
    }, [isOpen]);

    const handleProductClick = (id: number) => {
        router.push(`/product/${id}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <>
            <motion.nav
                initial={false}
                animate={{ y: (isOpen || isSearchOpen || isUserOpen) ? 0 : `${yOffset}%` }}
                transition={{ duration: 0.1 }}
                className={`fixed top-0 left-0 w-full z-50 transition-[background-color,padding,box-shadow,backdrop-filter] duration-500 ${isScrolled ? 'bg-brand-dark shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-3 backdrop-blur-xl' : 'bg-transparent py-8'}`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-playfair font-bold tracking-wider text-bg-main">
                        MODERNIST
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/">HOME</NavLink>
                        <NavLink href="/shop/men">MEN</NavLink>
                        <NavLink href="/shop/women">WOMEN</NavLink>
                        <NavLink href="/shop/kids">KIDS</NavLink>
                        <NavLink href="/shop/home-textile">HOME TEXTILE</NavLink>
                        <NavLink href="/shop/wholesale-b2b">WHOLESALE / B2B</NavLink>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <motion.button
                            suppressHydrationWarning
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={toggleTheme}
                            className="relative text-bg-main group cursor-pointer focus:outline-none"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </motion.button>

                        <div className="relative" ref={searchRef}>
                            <motion.div
                                className="flex items-center cursor-pointer relative group"
                                onClick={() => { setIsSearchOpen(true); if (!searchQuery) setSearchResults(products.slice(0, 4)); }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                            >
                                <Search className="w-5 h-5 text-bg-main hover:text-brand-primary transition-colors" />
                            </motion.div>

                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-100 bg-black/40 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
                                    >
                                        <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: -30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            className="w-full max-w-2xl bg-white dark:bg-bg-soft shadow-2xl rounded-3xl overflow-hidden z-10 flex flex-col max-h-[75vh] border dark:border-white/10"
                                        >
                                            <div className="flex items-center px-6 py-5 border-b dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                                <Search className="w-6 h-6 text-brand-primary mr-4" />
                                                <input
                                                    ref={searchInputRef}
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Explore collections..."
                                                    className="flex-1 bg-transparent text-xl outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                    suppressHydrationWarning
                                                />
                                                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                                    <X className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                                {searchResults.length === 0 ? (
                                                    <div className="py-20 text-center">
                                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Search className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                        <p className="text-gray-400 dark:text-gray-500 font-medium italic">No results found for "{searchQuery}"</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {searchResults.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => handleProductClick(item.id)}
                                                                className="group flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                                                            >
                                                                <div className="w-20 h-24 bg-gray-100 dark:bg-white/10 rounded-xl overflow-hidden shrink-0 relative">
                                                                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-bold truncate group-hover:text-brand-primary transition-colors text-gray-900 dark:text-white">{item.name}</h4>
                                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{item.category}</p>
                                                                    <p className="text-sm font-extrabold mt-2 text-brand-primary">{formatPrice(item.price)}</p>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative" ref={userRef}>
                            {user ? (
                                <>
                                    <button 
                                        onClick={() => setIsUserOpen(!isUserOpen)} 
                                        className="relative group focus:outline-none flex items-center"
                                    >
                                        <div className={`p-2 rounded-full transition-all duration-300 ${isUserOpen ? 'bg-brand-primary/20' : 'hover:bg-white/10'}`}>
                                            <User className={`w-5 h-5 transition-colors duration-300 ${isUserOpen ? 'text-brand-primary' : 'text-bg-main'}`} />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isUserOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                                                className="absolute right-0 mt-4 w-72 bg-[#0c0a09]/95 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-3xl border border-white/10 overflow-hidden z-50 transform-gpu origin-top-right"
                                            >
                                                {/* Header Section */}
                                                <div className="px-6 py-5 border-b border-white/5 bg-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
                                                            <User className="w-6 h-6 text-brand-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-base font-black truncate text-white tracking-tight">
                                                                {user.name}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-primary/80">
                                                                    Premium Member
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Links Section */}
                                                <div className="p-3">
                                                    {[
                                                        { href: '/profile', icon: IdCard, label: 'Profile Settings', desc: 'Manage your personal details' },
                                                        { href: '/orders', icon: Package, label: 'Order History', desc: 'Track and view your purchases' }
                                                    ].map((item) => (
                                                        <Link 
                                                            key={item.href}
                                                            href={item.href} 
                                                            className="flex items-center gap-4 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 group hover:bg-white/5 text-gray-300 hover:text-white" 
                                                            onClick={() => setIsUserOpen(false)}
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-primary/20 group-hover:scale-110">
                                                                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary" />
                                                            </div>
                                                            <div>
                                                                <span className="block">{item.label}</span>
                                                                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 transition-colors">{item.desc}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Logout Section */}
                                                <div className="p-3 border-t border-white/5 mt-1 bg-white/[0.02]">
                                                    <button 
                                                        onClick={() => { logout(); setIsUserOpen(false); }} 
                                                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                                                <LogOut className="w-5 h-5" />
                                                            </div>
                                                            Sign Out
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link href="/login"><User className="w-5 h-5 text-bg-main hover:text-brand-primary" /></Link>
                            )}
                        </div>

                        <Link href="/wishlist" className="relative text-bg-main">
                            <Heart className="w-5 h-5 hover:text-brand-primary transition-colors" />
                            {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
                        </Link>

                        <Link href="/cart" className="relative text-bg-main">
                            <ShoppingBag className="w-5 h-5 hover:text-brand-primary transition-colors" />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
                        </Link>
                    </div>

                    <button className="md:hidden text-bg-main" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed inset-0 top-0 bg-white dark:bg-bg-main z-[60] p-6 pt-24 flex flex-col space-y-2 overflow-y-auto"
                        >
                            <button className="absolute top-8 right-6 p-2 rounded-full bg-gray-100 dark:bg-white/5" onClick={() => setIsOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>

                            {[
                                { name: 'HOME', href: '/' },
                                { name: 'MEN', href: '/shop/men' },
                                { name: 'WOMEN', href: '/shop/women' },
                                { name: 'KIDS', href: '/shop/kids' },
                                { name: 'HOME TEXTILE', href: '/shop/home-textile' },
                                { name: 'WISHLIST', href: '/wishlist', count: wishlistCount },
                                { name: 'CART', href: '/cart', count: cartCount },
                            ].map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link 
                                        href={link.href} 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between py-4 text-2xl font-playfair font-bold border-b border-gray-100 dark:border-white/5 group"
                                    >
                                        <span className="group-hover:text-brand-primary transition-colors text-gray-900 dark:text-white">{link.name} {link.count !== undefined && <span className="text-sm font-roboto opacity-50 ml-2">({link.count})</span>}</span>
                                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </motion.div>
                            ))}
                            
                            <div className="pt-8">
                                {user ? (
                                    <motion.button 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        onClick={() => { logout(); setIsOpen(false); }} 
                                        className="flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 font-bold"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Link 
                                            href="/login" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-brand-primary text-white font-bold"
                                        >
                                            <User className="w-5 h-5" />
                                            LOGIN / REGISTER
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
            <CartDrawer />
        </>
    );
}
