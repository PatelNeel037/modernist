'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, User, Heart, ChevronRight, LogOut, Package, IdCard } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { allProducts, Product } from '@/data/products';
import { DB } from '@/services/db';
import CartDrawer from './CartDrawer';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { getCartCount, openCart } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Helper to render Links with underline animation
    const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
        <Link href={href} className={`relative group text-sm font-medium transition-colors ${isActive(href) ? 'text-brand-primary' : 'text-gray-300 hover:text-white'}`}>
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

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${(isVisible || isOpen || isSearchOpen || isUserOpen) ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-brand-dark/95 backdrop-blur-md shadow-md py-2' : 'bg-brand-dark py-4'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="text-2xl font-playfair font-bold tracking-wider text-white">
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
                    {/* Search Component */}
                    <div className="relative" ref={searchRef}>
                        <div className="flex items-center" onClick={() => { setIsSearchOpen(true); if (!searchQuery) setSearchResults(products.slice(0, 4)); }}>
                            <Search className="w-5 h-5 cursor-pointer hover:text-brand-primary transition-colors text-white" />
                        </div>

                        {isSearchOpen && (
                            <div className="absolute right-0 mt-4 w-80 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 p-0 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 border-b border-gray-100">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full px-3 py-2 text-sm bg-gray-50 rounded border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 transition-colors outline-none text-black"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            No products found.
                                        </div>
                                    ) : (
                                        <>
                                            {!searchQuery && <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trending Now</div>}
                                            {searchResults.map(item => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleProductClick(item.id)}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="w-10 h-12 bg-gray-100 shrink-0 rounded overflow-hidden">
                                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                                        <p className="text-xs text-brand-primary font-bold">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Auth Dropdown */}
                    <div className="relative" ref={userRef}>
                        {user ? (
                            <>
                                <button onClick={() => setIsUserOpen(!isUserOpen)} className="focus:outline-none" title={`Signed in as ${user.name}`}>
                                    <User className="w-5 h-5 hover:text-brand-primary transition-colors text-white fill-current" />
                                </button>
                                {isUserOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md overflow-hidden border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                                            <p className="text-sm font-medium text-gray-900 truncate">Hello, {user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setIsUserOpen(false)}>
                                            <IdCard className="w-4 h-4 mr-2" /> My Profile
                                        </Link>
                                        <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setIsUserOpen(false)}>
                                            <Package className="w-4 h-4 mr-2" /> My Orders
                                        </Link>
                                        <button onClick={() => { logout(); setIsUserOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link href="/login" title="Login / Sign Up"><User className="w-5 h-5 text-white hover:text-brand-primary transition-colors" /></Link>
                        )}
                    </div>

                    <Link href="/wishlist" className="relative group text-white">
                        <Heart className="w-5 h-5 hover:text-brand-primary transition-colors" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <button onClick={openCart} className="relative text-white group cursor-pointer" aria-label="Open cart">
                        <ShoppingBag className="w-5 h-5 hover:text-brand-primary transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden focus:outline-none text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 h-screen">
                    <Link href="/" className={`text-sm font-medium ${isActive('/') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>HOME</Link>
                    <Link href="/shop/men" className={`text-sm font-medium ${isActive('/shop/men') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>MEN</Link>
                    <Link href="/shop/women" className={`text-sm font-medium ${isActive('/shop/women') ? 'text-brand-primary' : 'hover:text-brand-primary'}`} onClick={() => setIsOpen(false)}>WOMEN</Link>
                    <Link href="/#new-arrivals" className="text-sm font-medium hover:text-brand-primary" onClick={() => setIsOpen(false)}>NEW ARRIVALS</Link>
                    <Link href="/#about" className="text-sm font-medium hover:text-brand-primary" onClick={() => setIsOpen(false)}>ABOUT</Link>
                    <div className="flex space-x-6 pt-6 border-t mt-4">
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
            <CartDrawer />
        </nav>
    );
}
