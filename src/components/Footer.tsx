'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ArrowUpRight, Github, Youtube } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: 'Men', href: '/shop/men' },
            { name: 'Women', href: '/shop/women' },
            { name: 'Kids', href: '/shop/kids' },
            { name: 'Home Textile', href: '/shop/home-textile' },
            { name: 'Wholesale / B2B', href: '/shop/wholesale-b2b' },
            { name: 'New Arrivals', href: '/#new-arrivals' },
        ],
        help: [
            { name: 'Customer Service', href: '/customer-service' },
            { name: 'Returns & Exchanges', href: '/returns-exchanges' },
            { name: 'Shipping Info', href: '/shipping-info' },
            { name: 'Size Guide', href: '/size-guide' },
            { name: 'Track Order', href: '/track-order' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms-of-service' },
            { name: 'Cookie Policy', href: '/cookies' },
        ]
    };

    return (
        <footer className="relative bg-brand-dark overflow-hidden pt-24 pb-12 border-t border-white/5">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-primary/30 to-transparent" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-content-body/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <Link href="/" className="text-3xl font-playfair font-bold tracking-tighter text-white hover:text-brand-primary transition-colors inline-block">
                                MODERNIST
                            </Link>
                            <p className="mt-6 text-white/70 text-base leading-relaxed max-w-sm font-light">
                                Crafting a new standard for modern tailoring. We redefine everyday fashion with timeless, ethically sourced essentials designed for the sophisticated individual.
                            </p>
                        </div>

                        <div className="flex items-center space-x-5">
                            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="https://instagram.com" />
                            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="https://facebook.com" />
                            <SocialIcon icon={<Youtube className="w-5 h-5" />} href="https://youtube.com" />
                            <SocialIcon icon={<Github className="w-5 h-5" />} href="https://github.com" />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Collections</h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <FooterLink href={link.href}>{link.name}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Experience</h4>
                        <ul className="space-y-4">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <FooterLink href={link.href}>{link.name}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact/Location Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Bespoke Services</h4>
                        <div className="space-y-6">
                            <div className="flex items-start group cursor-default">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-500">
                                    <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Flagship Boutique</p>
                                    <p className="text-sm text-white/60 font-light mt-1">22nd Street, Madison Ave, NY 10010</p>
                                </div>
                            </div>
                            <div className="flex items-start group cursor-default">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-500">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Inquiries</p>
                                    <p className="text-sm text-white/60 font-light mt-1">concierge@modernist.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-6">Payment Excellence</h4>
                            <div className="flex flex-wrap items-center gap-5">
                                <PaymentIcon src="https://cdn.simpleicons.org/visa/white" alt="Visa" h="h-6" />
                                <PaymentIcon src="https://cdn.simpleicons.org/mastercard/white" alt="Mastercard" h="h-9" />
                                <PaymentIcon src="https://cdn.simpleicons.org/paypal/white" alt="Paypal" h="h-6" />
                                <PaymentIcon src="https://cdn.simpleicons.org/applepay/white" alt="Apple Pay" h="h-9" />
                                <PaymentIcon src="https://cdn.simpleicons.org/googlepay/white" alt="Google Pay" h="h-8" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-8 text-[11px] uppercase tracking-widest text-white/40">
                        <span>&copy; {currentYear} Modernist Studio</span>
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>

                    <div className="flex items-center gap-3 text-white/40">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                        <span className="text-[11px] uppercase tracking-widest font-medium">Global Dispatch Operating</span>
                    </div>
                </div>
            </div>

            {/* Back to top - Hidden on mobile, subtle on desktop */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-12 bottom-12 p-4 rounded-full border border-white/10 text-white/30 hover:text-white transition-colors hidden lg:flex items-center justify-center group"
                suppressHydrationWarning
            >
                <ArrowUpRight className="w-5 h-5 -rotate-45 group-hover:text-brand-primary transition-colors" />
            </motion.button>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
                y: -5,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-500 group"
        >
            <div className="group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
        </motion.a>
    );
}

function PaymentIcon({ src, alt, h }: { src: string; alt: string; h: string }) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                opacity: 1,
                scale: 1.05,
                borderColor: 'rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.08)'
            }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.4 }}
            className="cursor-pointer transition-all duration-500 bg-white/3 border border-white/8 rounded-2xl px-7 py-4 flex items-center justify-center backdrop-blur-sm min-w-[110px]"
        >
            <img src={src} className={`${h} w-auto object-contain transition-transform duration-500`} alt={alt} />
        </motion.div>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="group relative text-white/50 hover:text-white text-sm font-light transition-colors duration-300 flex items-center"
        >
            <span className="w-0 group-hover:w-2 h-px bg-brand-primary mr-0 group-hover:mr-2 transition-all duration-300" />
            <span>{children}</span>
            <ArrowUpRight className="inline-block w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-brand-primary" />
        </Link>
    );
}
