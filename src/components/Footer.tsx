import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

                {/* Brand Column */}
                <div className="space-y-6">
                    <Link href="/" className="text-2xl font-playfair font-bold tracking-wider block">
                        MODERNIST
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                        Redefining everyday fashion with timeless essentials.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-all duration-300">
                            <i className="fab fa-instagram text-lg"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-all duration-300">
                            <i className="fab fa-facebook-f text-lg"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-all duration-300">
                            <i className="fab fa-twitter text-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Shop Column */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Shop</h4>
                    <ul className="space-y-4">
                        <li><Link href="/shop/men" className="text-gray-400 hover:text-white transition-colors text-sm">Men</Link></li>
                        <li><Link href="/shop/women" className="text-gray-400 hover:text-white transition-colors text-sm">Women</Link></li>
                        <li><Link href="/shop/kids" className="text-gray-400 hover:text-white transition-colors text-sm">Kids</Link></li>
                        <li><Link href="#new-arrivals" className="text-gray-400 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Help Column */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Help</h4>
                    <ul className="space-y-4">
                        <li><Link href="/customer-service" className="text-gray-400 hover:text-white transition-colors text-sm">Customer Service</Link></li>
                        <li><Link href="/returns-exchanges" className="text-gray-400 hover:text-white transition-colors text-sm">Returns & Exchanges</Link></li>
                        <li><Link href="/shipping-info" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping Info</Link></li>
                        <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors text-sm">Size Guide</Link></li>
                    </ul>
                </div>

                {/* Legal Column */}
                <div>
                    <h4 className="text-lg font-semibold mb-6">Legal</h4>
                    <ul className="space-y-4 mb-8">
                        <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                    </ul>
                    <div className="flex justify-center md:justify-start gap-4 text-2xl text-gray-400">
                        {/* Genuine Payment Icons via FontAwesome */}
                        <i className="fab fa-cc-visa hover:text-white transition-colors"></i>
                        <i className="fab fa-cc-mastercard hover:text-white transition-colors"></i>
                        <i className="fab fa-cc-paypal hover:text-white transition-colors"></i>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-600">
                <p>&copy; {currentYear} MODERNIST. All rights reserved.</p>
            </div>
        </footer>
    );
}
