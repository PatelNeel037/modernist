'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-8 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Terms of Service</h1>
                    <p className="text-gray-600 text-lg">Clear rules, fair play, and mutual respect.</p>
                </div>
            </div>

            <div className="text-center text-gray-500 italic text-sm mb-12">
                Last updated on: February 1, 2026
            </div>

            <section className="pb-20">
                <div className="container mx-auto px-6 max-w-4xl bg-white p-8 md:p-12 rounded-lg shadow-sm">

                    {/* Quick Summary Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12 rounded-r-md">
                        <h3 className="text-blue-700 font-bold text-xl mb-2 font-playfair flex items-center gap-2">
                            <i className="fas fa-info-circle"></i> Quick Summary
                        </h3>
                        <p className="text-gray-700 m-0 leading-relaxed">
                            These terms explain how you can use our website and shop with us. They cover ordering, payments, and what we expect from each other. By shopping with us, you agree to these simple rules.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-playfair font-bold mb-4 text-gray-900">1. Using Our Website</h2>
                        <div className="flex gap-4 items-start">
                            <i className="fas fa-check text-gray-900 mt-1 shrink-0"></i>
                            <div>
                                <strong className="block text-gray-900 mb-1">Fair Use</strong>
                                <p className="text-gray-600 leading-relaxed">
                                    You agree to use our site for personal shopping and not for any illegal activities or to harm our platform. Please respect our content and community.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-playfair font-bold mb-4 text-gray-900">2. Placing Orders</h2>
                        <p className="text-gray-600 leading-relaxed">
                            When you place an order, you agree that your details are correct and that you are authorized to use the payment method provided. We reserve the right to cancel orders if we suspect fraud or if stock is unavailable (you will be fully refunded).
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-playfair font-bold mb-4 text-gray-900">3. Payments & Pricing</h2>
                        <p className="text-gray-600 leading-relaxed">
                            All prices are listed clearly. We accept secure payments via credit/debit cards and other listed methods. Prices include applicable taxes, but shipping may be extra as detailed at checkout.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-playfair font-bold mb-4 text-gray-900">4. Returns & Cancellations</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We want you to be happy! You can return items within our standard return window. Please see our <Link href="/returns-exchanges" className="text-black underline hover:no-underline">Returns & Exchanges</Link> page for the full process. Cancellations are accepted before the item is shipped.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-playfair font-bold mb-4 text-gray-900">5. Limitation of Responsibility</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We try our best to ensure everything is perfect. However, sometimes external factors (like shipping delays or technical glitches) happen. We are not liable for delayed deliveries caused by third-party couriers, but we will always assist you in resolving issues.
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-600">
                            Questions about these terms? Reach out to <strong className="text-gray-900">legal@modernist.com</strong>.
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
