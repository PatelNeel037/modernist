'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Info } from 'lucide-react';

export default function SizeGuidePage() {
    const [activeTab, setActiveTab] = useState('men');

    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Find Your Perfect Fit</h1>
                    <p className="text-gray-600 text-lg">Measure twice, order once. Reduce returns by finding your right size.</p>
                </div>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">

                    {/* Tabs */}
                    <div className="flex justify-center mb-12 gap-4">
                        {['men', 'women', 'kids'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-2 border border-gray-900 text-lg font-playfair transition-all ${activeTab === tab
                                        ? 'bg-black text-white'
                                        : 'bg-transparent text-gray-900 hover:bg-gray-50'
                                    } uppercase tracking-wide`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Men's Chart */}
                    <div className={`${activeTab === 'men' ? 'block' : 'hidden'} animate-fade-in`}>
                        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-sm uppercase tracking-wider text-gray-700">
                                        <th className="p-4 border-b border-gray-200">Size</th>
                                        <th className="p-4 border-b border-gray-200">Chest (in)</th>
                                        <th className="p-4 border-b border-gray-200">Waist (in)</th>
                                        <th className="p-4 border-b border-gray-200">Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {[
                                        { size: 'S', chest: '36 - 38', waist: '28 - 30', length: '27' },
                                        { size: 'M', chest: '38 - 40', waist: '30 - 32', length: '28' },
                                        { size: 'L', chest: '40 - 42', waist: '32 - 34', length: '29' },
                                        { size: 'XL', chest: '42 - 44', waist: '34 - 36', length: '30' },
                                        { size: 'XXL', chest: '44 - 46', waist: '36 - 38', length: '31' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                            <td className="p-4 font-medium text-black">{row.size}</td>
                                            <td className="p-4">{row.chest}</td>
                                            <td className="p-4">{row.waist}</td>
                                            <td className="p-4">{row.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Women's Chart */}
                    <div className={`${activeTab === 'women' ? 'block' : 'hidden'} animate-fade-in`}>
                        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-sm uppercase tracking-wider text-gray-700">
                                        <th className="p-4 border-b border-gray-200">Size</th>
                                        <th className="p-4 border-b border-gray-200">Bust (in)</th>
                                        <th className="p-4 border-b border-gray-200">Waist (in)</th>
                                        <th className="p-4 border-b border-gray-200">Hips (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {[
                                        { size: 'XS', bust: '31 - 33', waist: '23 - 25', hips: '33 - 35' },
                                        { size: 'S', bust: '33 - 35', waist: '25 - 27', hips: '35 - 37' },
                                        { size: 'M', bust: '35 - 37', waist: '27 - 29', hips: '37 - 39' },
                                        { size: 'L', bust: '37 - 39', waist: '29 - 31', hips: '39 - 41' },
                                        { size: 'XL', bust: '39 - 42', waist: '31 - 34', hips: '41 - 44' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                            <td className="p-4 font-medium text-black">{row.size}</td>
                                            <td className="p-4">{row.bust}</td>
                                            <td className="p-4">{row.waist}</td>
                                            <td className="p-4">{row.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Kid's Chart */}
                    <div className={`${activeTab === 'kids' ? 'block' : 'hidden'} animate-fade-in`}>
                        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-sm uppercase tracking-wider text-gray-700">
                                        <th className="p-4 border-b border-gray-200">Age (Years)</th>
                                        <th className="p-4 border-b border-gray-200">Height (cm)</th>
                                        <th className="p-4 border-b border-gray-200">Chest (cm)</th>
                                        <th className="p-4 border-b border-gray-200">Waist (cm)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {[
                                        { age: '2-3Y', height: '92 - 98', chest: '54', waist: '51' },
                                        { age: '4-5Y', height: '104 - 110', chest: '58', waist: '53' },
                                        { age: '6-7Y', height: '116 - 122', chest: '62', waist: '56' },
                                        { age: '8-9Y', height: '128 - 134', chest: '66', waist: '59' },
                                        { age: '10-11Y', height: '140 - 146', chest: '72', waist: '63' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                            <td className="p-4 font-medium text-black">{row.age}</td>
                                            <td className="p-4">{row.height}</td>
                                            <td className="p-4">{row.chest}</td>
                                            <td className="p-4">{row.waist}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-lg text-center text-blue-900 flex flex-col md:flex-row items-center justify-center gap-2">
                        <Info size={20} className="shrink-0" />
                        <p><strong>Pro Tip:</strong> If you measure between two sizes, we recommend going one size up for a more comfortable fit.</p>
                    </div>

                    {/* Fit Guide */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-playfair font-bold text-center mb-10">Fit Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-lg mb-2">Slim Fit</h4>
                                <p className="text-gray-600">Tailored close to the body. Sharp & Modern.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-lg mb-2">Regular Fit</h4>
                                <p className="text-gray-600">Classic cut. Comfortable room to move.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-lg mb-2">Relaxed / Loose</h4>
                                <p className="text-gray-600">Oversized silhouette. Streetwear vibe.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-12 border-t border-gray-100 text-center">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-playfair font-bold mb-4">Still need help?</h3>
                    <p className="text-gray-600 mb-8">Your comfort matters to us.</p>
                    <Link href="/customer-service" className="inline-block px-8 py-3 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition-colors">
                        Ask Our Stylist
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
