'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ReturnsExchangesPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Easy Returns & Exchanges</h1>
                    <p className="text-gray-600 text-lg">Hassle-free. No complicated questions. We keep it simple.</p>
                </div>
            </div>

            <section className="pb-20">
                <div className="container mx-auto px-6 max-w-5xl">

                    {/* Process Steps */}
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 mb-20 md:mb-24">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[40px] left-20 right-20 h-0.5 bg-gray-200 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center bg-gray-50 px-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 text-emerald-600">
                                <i className="fas fa-desktop text-3xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">1. Request Return</h3>
                            <p className="text-sm text-gray-600 max-w-[200px]">Initiate a return from your account.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center bg-gray-50 px-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 text-emerald-600">
                                <i className="fas fa-people-carry text-3xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">2. Pickup / Drop</h3>
                            <p className="text-sm text-gray-600 max-w-[200px]">We pick it up, or you drop it off.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center bg-gray-50 px-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 text-emerald-600">
                                <i className="fas fa-undo-alt text-3xl"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">3. Refund / Exchange</h3>
                            <p className="text-sm text-gray-600 max-w-[200px]">Get your money back or a new item.</p>
                        </div>
                    </div>

                    <div className="text-center italic text-xl text-gray-600 mb-16 font-playfair">
                        "No complicated questions. We keep it simple."
                    </div>

                    {/* Policies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Returns */}
                        <div className="bg-white p-10 rounded-lg shadow-sm border-l-4 border-black">
                            <h3 className="text-2xl font-playfair font-bold mb-6">Easy Returns</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600"><strong>14 Days</strong> Return Policy from delivery date.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600">Items must be unused, unwashed, and with original tags.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600">Full refund to original payment source within 5-7 days.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Exchanges */}
                        <div className="bg-white p-10 rounded-lg shadow-sm border-l-4 border-black">
                            <h3 className="text-2xl font-playfair font-bold mb-6">Hassle-Free Exchange</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600">Wrong size? Exchange it for free.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600">Defective item? Immediate replacement.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1 shrink-0"></i>
                                    <span className="text-gray-600">Exchange process is faster than refund.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Non-Returnable */}
                    <div className="bg-red-50 p-8 rounded-lg border border-red-100 flex items-start gap-4">
                        <i className="fas fa-exclamation-triangle text-red-500 mt-1 shrink-0 text-xl"></i>
                        <div>
                            <h3 className="text-lg font-bold text-red-800 mb-2">Non-Returnable Items</h3>
                            <p className="text-red-700">
                                For hygiene reasons, innerwear, swimwear, and accessories (jewelry) cannot be returned or exchanged unless defective.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help CTA */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-2xl font-playfair font-bold mb-4">Still need help?</h3>
                    <p className="text-gray-600 mb-8">Your comfort matters to us.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/customer-service" className="px-6 py-3 border border-gray-900 text-gray-900 rounded font-medium hover:bg-gray-50 transition-colors">
                            Contact Support
                        </Link>
                        <Link href="/" className="px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors">
                            Back to Shop
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
