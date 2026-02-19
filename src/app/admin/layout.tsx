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
    Menu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const isLoginPage = pathname === '/admin/login';

    // Sidebar Toggle for mobile
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        // If on login page, don't enforce auth immediately or redirect to /login
        if (isLoginPage) {
            // But if we ARE logged in as admin, go to dashboard
            if (user && user.role === 'admin') {
                router.push('/admin');
            }
            return;
        }

        // Protect other admin routes
        if (!isAuthenticated) return; // Wait for auth to load

        if (user && user.role !== 'admin') {
            router.push('/');
        } else if (!user) {
            router.push('/admin/login'); // Redirect to admin login
        }
    }, [user, isAuthenticated, router, isLoginPage, pathname]);

    // Initial Loading State Logic
    // If NOT on login page AND (no user OR not admin), show loading
    if (!isLoginPage && (!user || user.role !== 'admin')) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading Admin Panel...</div>;
    }

    // If it IS login page, just render children (the login form)
    if (isLoginPage) {
        return <>{children}</>;
    }

    const menuItems = [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Orders', href: '/admin/orders', icon: Package },
        { label: 'Products', href: '/admin/products', icon: Shirt },
        { label: 'Customers', href: '/admin/customers', icon: Users },
    ];

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-4 z-50">
                <button onClick={toggleSidebar}>
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <span className="ml-4 font-bold text-gray-700">MODERNIST ADMIN</span>
            </div>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                <div className={styles.logo}>MODERNIST ADMIN</div>
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
                <div onClick={() => { logout(); router.push('/admin/login'); }} className={`${styles.menuLink} ${styles.logout} cursor-pointer`}>
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
