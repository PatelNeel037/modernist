'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';
import {
    Home,
    Package,
    Shirt,
    Users,
    LogOut,
    Menu,
    Star,
    MessageSquare,
    Instagram,
    Mail
} from 'lucide-react';
import { DB } from '@/services/db'; // Direct DB access for Admin

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [adminUser, setAdminUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isLoginPage = pathname === '/admin/login';

    // Sidebar Toggle for mobile
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        // Build-time / server-side check
        if (typeof window === 'undefined') return;

        const user = DB.getAdminUser();
        setAdminUser(user);
        setLoading(false);

        // If on login page, don't enforce auth immediately
        if (isLoginPage) {
            // But if we ARE logged in as admin, go to dashboard
            if (user && user.role === 'admin') {
                router.push('/admin');
            }
            return;
        }

        // Protect other admin routes
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        }
    }, [pathname, isLoginPage, router]);

    // Initial Loading State Logic
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading Admin Panel...</div>;
    }

    // If it IS login page, just render children (the login form)
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Wait until we have a verified admin user before showing layout
    if (!adminUser || adminUser.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    const menuItems = [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Orders', href: '/admin/orders', icon: Package },
        { label: 'Products', href: '/admin/products', icon: Shirt },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Reviews', href: '/admin/reviews', icon: Star },
        { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
        { label: 'Instagram', href: '/admin/instagram', icon: Instagram },
        { label: 'Subscribers', href: '/admin/subscribers', icon: Mail },
    ];

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-4 z-50">
                <button onClick={toggleSidebar}>
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div className="ml-4 flex items-center gap-2">
                    <span className="font-bold text-gray-700">MODERNIST ADMIN</span>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                <div className={styles.logo}>MODERNIST ADMIN</div>
                <div className="px-6 py-2 mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Logged in as</div>
                    <div className="text-sm font-medium text-white truncate">{adminUser.name}</div>
                </div>
                <nav className={styles.menu}>
                    <ul>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`${styles.menuLink} ${isActive ? styles.activeLink : ''}`}
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div onClick={() => { DB.adminLogout(); }} className={`${styles.menuLink} ${styles.logout} cursor-pointer`}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`${styles.mainContent} ${isSidebarOpen ? '' : 'ml-0 w-full'}`}>
                <div className="md:hidden h-16"></div> {/* Spacer for mobile header */}
                {children}
            </main>
        </div>
    );
}
