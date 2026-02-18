'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ShippingInfoPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Shipping Information</h1>
                    <p className="text-gray-600 text-lg">From our warehouse to your wardrobe. Fast & Secure.</p>
                </div>
            </div>

            <section className="pb-20">
                <div className="container mx-auto px-6">

                    <h2 className="text-3xl font-playfair font-bold text-center mb-16">Delivery Timelines</h2>

                    {/* Timeline */}
                    <div className="relative max-w-4xl mx-auto mb-20">
                        {/* Vertical Line (Desktop only) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2"></div>

                        {/* Timeline Items */}
                        <div className="space-y-8 md:space-y-0">

                            {/* Item 1 - Left */}
                            <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                                <div className="md:w-[45%] bg-white p-6 rounded-lg shadow-sm text-center md:text-right relative z-10">
                                    <i className="fas fa-box-open text-3xl text-gray-800 mb-4 block"></i>
                                    <h3 className="font-bold text-xl mb-2 font-playfair">Order Processing</h3>
                                    <p className="text-gray-600">We pack your order with care within <strong>24 hours</strong> of confirmation.</p>

                                    {/* Arrow for Desktop Left */}
                                    <div className="hidden md:block absolute top-1/2 right-[-20px] transform -translate-y-1/2 border-l-[10px] border-l-white border-y-[10px] border-y-transparent"></div>
                                </div>
                                {/* Dot */}
                                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-black rounded-full z-20"></div>
                                <div className="md:w-[45%]"></div>
                            </div>

                            {/* Item 2 - Right */}
                            <div className="relative flex flex-col md:flex-row items-center md:justify-between group md:mt-[-50px]"> {/* Adjust margin for overlap aesthetics if needed, or just standard flow */}
                                <div className="md:w-[45%]"></div>
                                {/* Dot */}
                                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-black rounded-full z-20"></div>
                                <div className="md:w-[45%] bg-white p-6 rounded-lg shadow-sm text-center md:text-left relative z-10 md:mt-12">
                                    <i className="fas fa-city text-3xl text-gray-800 mb-4 block"></i>
                                    <h3 className="font-bold text-xl mb-2 font-playfair">Metro Cities</h3>
                                    <p className="text-gray-600">Delivery within <strong>2-3 business days</strong>.</p>
                                    <p className="text-xs text-gray-400 mt-2">New York, Los Angeles, Chicago, etc.</p>

                                    {/* Arrow for Desktop Right */}
                                    <div className="hidden md:block absolute top-1/2 left-[-20px] transform -translate-y-1/2 border-r-[10px] border-r-white border-y-[10px] border-y-transparent"></div>
                                </div>
                            </div>

                            {/* Item 3 - Left */}
                            <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                                <div className="md:w-[45%] bg-white p-6 rounded-lg shadow-sm text-center md:text-right relative z-10 md:mt-12">
                                    <i className="fas fa-truck text-3xl text-gray-800 mb-4 block"></i>
                                    <h3 className="font-bold text-xl mb-2 font-playfair">Rest of Country</h3>
                                    <p className="text-gray-600">Delivery within <strong>4-7 business days</strong>.</p>

                                    {/* Arrow for Desktop Left */}
                                    <div className="hidden md:block absolute top-1/2 right-[-20px] transform -translate-y-1/2 border-l-[10px] border-l-white border-y-[10px] border-y-transparent"></div>
                                </div>
                                {/* Dot */}
                                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-black rounded-full z-20"></div>
                                <div className="md:w-[45%]"></div>
                            </div>

                            {/* Item 4 - Right */}
                            <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
                                <div className="md:w-[45%]"></div>
                                {/* Dot */}
                                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-black rounded-full z-20"></div>
                                <div className="md:w-[45%] bg-white p-6 rounded-lg shadow-sm text-center md:text-left relative z-10 md:mt-12">
                                    <i className="fas fa-check-circle text-3xl text-green-600 mb-4 block"></i>
                                    <h3 className="font-bold text-xl mb-2 font-playfair">Order Delivered</h3>
                                    <p className="text-gray-600">Receive your package and enjoy your new look!</p>

                                    {/* Arrow for Desktop Right */}
                                    <div className="hidden md:block absolute top-1/2 left-[-20px] transform -translate-y-1/2 border-r-[10px] border-r-white border-y-[10px] border-y-transparent"></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-24">
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                            <i className="fas fa-tag text-4xl text-gray-600 mb-4 inline-block"></i>
                            <h3 className="font-bold text-xl mb-2 font-playfair">Shipping Charges</h3>
                            <p className="text-gray-800 mb-1">Free shipping on all orders above <strong>$99</strong>.</p>
                            <p className="text-sm text-gray-500">Standard shipping fee: $5.99</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                            <i className="fas fa-map-marker-alt text-4xl text-gray-600 mb-4 inline-block"></i>
                            <h3 className="font-bold text-xl mb-2 font-playfair">Tracking</h3>
                            <p className="text-gray-800 mb-1">Live tracking link sent via SMS & Email.</p>
                            <p className="text-sm text-gray-500">Track typically active within 24 hours.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Extras */}
            <section className="bg-white py-20 border-t border-gray-100 text-center">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-playfair font-bold mb-4">Still need help?</h3>
                    <p className="text-gray-600 mb-8">Your comfort matters to us.</p>
                    <Link href="/customer-service" className="inline-block px-8 py-3 border border-gray-900 text-gray-900 rounded font-medium hover:bg-black hover:text-white transition-all">
                        Contact Support
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
