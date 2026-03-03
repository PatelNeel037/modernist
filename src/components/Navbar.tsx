'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, Heart, ChevronRight, LogOut, Package, IdCard, Sun, Moon } from 'lucide-react';
import { motion, useScroll, useVelocity, useTransform, useSpring, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { DB } from '@/services/db';
import CartDrawer from './CartDrawer';

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

    // Helper to render Links with underline animation
    const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
        <Link href={href} className={`relative group text-sm font-medium transition-colors ${isActive(href) ? 'text-brand-primary' : 'text-bg-main/80 hover:text-bg-main'}`}>
            {children}
            <span className={`absolute left-0 -bottom-1 h-[2px] bg-brand-primary transition-all duration-300 ${isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
    );

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // Use any to allow different price types or update Product interface
    const [products, setProducts] = useState<any[]>([]); // Dynamic product list
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSearchOpen(false);
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
                if (!searchQuery && products.length > 0) setSearchResults(products.slice(0, 4));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery, products]);

    // Fetch products for search
    useEffect(() => {
        const loadProducts = async () => {
            const data = await DB.fetchProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    // ... (refs)

    // ... (skip other effects)

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults(products.slice(0, 4)); // Trending suggestions from dynamic list
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

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Determine if scrolled past top (for glassmorphism effect)
                    setIsScrolled(currentScrollY > 20);

                    // Bounce fix for macOS / iOS
                    if (currentScrollY <= 0) {
                        setIsVisible(true);
                    } else {
                        const difference = currentScrollY - lastScrollY.current;

                        if (currentScrollY > 80 && difference > 8) {
                            // Scrolling down by more than 8px -> hide
                            setIsVisible(false);
                        } else if (difference < -8 || currentScrollY <= 80) {
                            // Scrolling up by more than 8px or near top -> show
                            setIsVisible(true);
                        }
                    }

                    // Update last scroll position only if moved enough
                    if (Math.abs(currentScrollY - lastScrollY.current) > 8 || currentScrollY <= 80) {
                        lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // or ''
        }
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    // ... (removed duplicate handleSearch)

    const handleProductClick = (id: number) => {
        router.push(`/product/${id}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Viscous/Jelly Scroll Physics Engine
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Convert scroll velocity into physical "squish" and "drag" (scale & skew)
    const scaleY = useTransform(smoothVelocity, [-1000, 0, 1000], [1.05, 1, 1.05]);
    const skewY = useTransform(smoothVelocity, [-1000, 0, 1000], [-1.5, 0, 1.5]);

    const isNavVisible = isVisible || isOpen || isSearchOpen || isUserOpen;

    return (
        <>
            <motion.nav
                initial={false}
                animate={{ y: isNavVisible ? 0 : '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ scaleY, skewY, transformOrigin: 'top' }}
                className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-md py-2' : 'bg-brand-dark py-4'}`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-playfair font-bold tracking-wider text-bg-main">
                        MODERNIST
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/">HOME</NavLink>
                        <NavLink href="/shop/men">MEN</NavLink>
                        <NavLink href="/shop/women">WOMEN</NavLink>
                        <NavLink href="/#new-arrivals">NEW ARRIVALS</NavLink>
                        <NavLink href="/#about">ABOUT</NavLink>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={toggleTheme}
                            className="relative text-bg-main group cursor-pointer focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 hover:text-brand-primary transition-colors" />
                            ) : (
                                <Sun className="w-5 h-5 hover:text-brand-primary transition-colors" />
                            )}
                        </motion.button>

                        {/* Search Component */}
                        <div className="relative" ref={searchRef}>
                            <div className="flex items-center" onClick={() => { setIsSearchOpen(true); if (!searchQuery) setSearchResults(products.slice(0, 4)); }}>
                                <Search className="w-5 h-5 cursor-pointer hover:text-brand-primary transition-colors text-bg-main" />
                            </div>

                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-100 bg-bg-main/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
                                    >
                                        <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="w-full max-w-2xl bg-bg-main shadow-2xl rounded-2xl overflow-hidden border border-bg-accent p-0 z-10 flex flex-col max-h-[70vh]"
                                        >
                                            <div className="flex items-center px-4 py-4 border-b border-bg-accent bg-bg-main relative z-20">
                                                <Search className="w-6 h-6 text-content-body mr-3 shrink-0" />
                                                <input
                                                    ref={searchInputRef}
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search premium products..."
                                                    className="flex-1 bg-transparent text-lg outline-none text-content-heading placeholder:text-content-body min-w-0"
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                />
                                                <div className="flex items-center gap-2 ml-3 shrink-0">
                                                    <span className="hidden sm:flex text-[10px] font-bold tracking-widest text-content-body border border-bg-accent px-2 py-1 rounded">ESC</span>
                                                    <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-bg-soft hover:bg-bg-accent rounded-full transition-colors focus:outline-none">
                                                        <X className="w-5 h-5 text-content-heading" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-bg-main">
                                                {searchResults.length === 0 ? (
                                                    <div className="py-12 text-center text-content-body flex flex-col items-center">
                                                        <Search className="w-12 h-12 text-bg-accent mb-4" />
                                                        <p className="text-lg">No products found for "{searchQuery}"</p>
                                                        <p className="text-sm mt-2 opacity-70">Try searching for a different term or category.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {searchResults.map((item, index) => (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                key={item.id}
                                                                onClick={() => handleProductClick(item.id)}
                                                                className="flex items-center gap-4 p-3 hover:bg-bg-soft cursor-pointer transition-colors rounded-xl border border-transparent hover:border-bg-accent group"
                                                            >
                                                                <div className="w-16 h-20 bg-bg-accent shrink-0 rounded-lg overflow-hidden relative">
                                                                    <img src={item.images?.[0] || item.image || '/images/fallback-product.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = '/images/fallback-product.png'; }} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-bold text-content-heading truncate leading-tight group-hover:text-brand-primary transition-colors">{item.name}</h4>
                                                                    <p className="text-xs text-content-body mt-1">{item.category}</p>
                                                                    <p className="text-sm text-content-heading font-medium mt-2">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Footer hint */}
                                            <div className="px-4 py-3 border-t border-bg-accent bg-bg-soft text-xs text-content-body hidden sm:flex justify-between items-center">
                                                <span><span className="font-bold">Pro Tip:</span> Use <kbd className="px-1.5 py-0.5 border border-bg-accent rounded bg-bg-main font-mono text-[10px]">Cmd</kbd> + <kbd className="px-1.5 py-0.5 border border-bg-accent rounded bg-bg-main font-mono text-[10px]">K</kbd> to quick search</span>
                                                <span className="flex items-center gap-1">Navigate with arrows <ChevronRight className="w-3 h-3" /></span>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Auth Dropdown */}
                        <div className="relative" ref={userRef}>
                            {user ? (
                                <>
                                    <button onClick={() => setIsUserOpen(!isUserOpen)} className="focus:outline-none" title={`Signed in as ${user.name}`}>
                                        <User className="w-5 h-5 hover:text-brand-primary transition-colors text-bg-main fill-current" />
                                    </button>
                                    {isUserOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-bg-main shadow-xl rounded-md overflow-hidden border border-bg-accent z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="px-4 py-3 border-b border-bg-soft bg-bg-soft">
                                                <p className="text-sm font-medium text-content-heading truncate">Hello, {user.name}</p>
                                                <p className="text-xs text-content-body truncate">{user.email}</p>
                                            </div>
                                            <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-content-body hover:bg-bg-soft hover:text-content-heading transition-colors" onClick={() => setIsUserOpen(false)}>
                                                <IdCard className="w-4 h-4 mr-2" /> My Profile
                                            </Link>
                                            <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-content-body hover:bg-bg-soft hover:text-content-heading transition-colors" onClick={() => setIsUserOpen(false)}>
                                                <Package className="w-4 h-4 mr-2" /> My Orders
                                            </Link>
                                            <button onClick={() => { logout(); setIsUserOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-900/10 transition-colors text-left">
                                                <LogOut className="w-4 h-4 mr-2" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/login" title="Login / Sign Up"><User className="w-5 h-5 text-bg-main hover:text-brand-primary transition-colors" /></Link>
                            )}
                        </div>

                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                            <Link href="/wishlist" className="relative group text-bg-main">
                                <Heart className="w-5 h-5 hover:text-brand-primary transition-colors" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-primary text-bg-main text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={openCart}
                            className="relative text-bg-main group cursor-pointer"
                            aria-label="Open cart"
                        >
                            <ShoppingBag className="w-5 h-5 hover:text-brand-primary transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-primary text-bg-main text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden focus:outline-none text-bg-main" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-bg-main shadow-lg py-4 px-6 flex flex-col space-y-4 h-screen">
                        <Link href="/" className={`text-sm font-medium ${isActive('/') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>HOME</Link>
                        <Link href="/shop/men" className={`text-sm font-medium ${isActive('/shop/men') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>MEN</Link>
                        <Link href="/shop/women" className={`text-sm font-medium ${isActive('/shop/women') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>WOMEN</Link>
                        <Link href="/#new-arrivals" className="text-sm font-medium hover:text-brand-primary" onClick={() => setIsOpen(false)}>NEW ARRIVALS</Link>
                        <Link href="/#about" className="text-sm font-medium hover:text-brand-primary" onClick={() => setIsOpen(false)}>ABOUT</Link>
                        <div className="flex space-x-6 pt-6 border-t border-bg-accent mt-4">
                            {user ? (
                                <button onClick={() => { setIsOpen(false); router.push('/profile'); }} className="flex items-center">
                                    <User className="w-6 h-6 text-content-heading fill-current mr-2" />
                                </button>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)}><User className="w-6 h-6" /></Link>
                            )}
                            <Link href="/wishlist"><Heart className="w-6 h-6" /></Link>
                            <button onClick={() => { setIsOpen(false); openCart(); }}><ShoppingBag className="w-6 h-6" /></button>
                        </div>
                    </div>
                )}
            </motion.nav>
            <CartDrawer />
        </>
    );
}
