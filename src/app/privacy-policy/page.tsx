'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-8 text-center bg-gray-50">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 text-lg">Your privacy matters to us. Here’s how we keep your data safe.</p>
                </div>
            </div>

            <div className="text-center text-gray-500 italic text-sm mb-12">
                Last updated on: February 1, 2026
            </div>

            <section className="pb-20">
                <div className="container mx-auto px-6 max-w-4xl bg-white p-8 md:p-12 rounded-lg shadow-sm">

                    <div className="mb-12 text-center">
                        <p className="text-xl text-gray-800 leading-relaxed">
                            Welcome to Modernist! We believe in transparency. This policy explains clearly what data we collect and why—no complicated legal terms, just the facts.
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 bg-gray-50 p-8 rounded-lg text-center">
                        <div className="flex flex-col items-center">
                            <i className="fas fa-lock text-4xl text-emerald-600 mb-4"></i>
                            <h4 className="font-bold text-lg mb-2">We never sell your data</h4>
                            <p className="text-sm text-gray-600">Your info stays with us.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fas fa-shield-alt text-4xl text-emerald-600 mb-4"></i>
                            <h4 className="font-bold text-lg mb-2">Secure Payments</h4>
                            <p className="text-sm text-gray-600">Encrypted & safe transactions.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fas fa-envelope-open-text text-4xl text-emerald-600 mb-4"></i>
                            <h4 className="font-bold text-lg mb-2">No Spam</h4>
                            <p className="text-sm text-gray-600">We only send what you ask for.</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-2xl font-playfair font-bold mb-6 border-b-2 border-gray-100 pb-2 inline-block">1. What We Collect</h2>
                            <p className="text-gray-600 mb-4">We only collect information that helps us serve you better:</p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    <strong className="text-gray-900">Name & Contact Details:</strong> So we can address you properly and deliver your orders.
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    <strong className="text-gray-900">Order Information:</strong> The products you buy, so we can handle returns or issues.
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    <strong className="text-gray-900">Payment Info:</strong> Handled securely by our payment partners (we do not store your full card details).
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    <strong className="text-gray-900">Browsing Behavior:</strong> Anonymous data to help us improve our website speed and design.
                                </li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-2xl font-playfair font-bold mb-6 border-b-2 border-gray-100 pb-2 inline-block">2. How We Use Your Data</h2>
                            <p className="text-gray-600 mb-4">Your data is used solely to improve your shopping experience:</p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    To process and deliver your orders accurately.
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    To provide customer support if you face any issues.
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    To recommend products we think you’ll love (if you opt-in).
                                </li>
                                <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                    To send order updates and shipping notifications.
                                </li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-2xl font-playfair font-bold mb-6 border-b-2 border-gray-100 pb-2 inline-block">3. Your Rights</h2>
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                                <p className="text-gray-600 mb-4">You have full control over your personal information. You have the right to:</p>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                        <strong className="text-gray-900">Access:</strong> Request a copy of the data we hold about you.
                                    </li>
                                    <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                        <strong className="text-gray-900">Delete:</strong> Ask us to delete your account and personal data.
                                    </li>
                                    <li className="pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-gray-900 before:font-bold">
                                        <strong className="text-gray-900">Unsubscribe:</strong> Opt-out of marketing emails at any time with one click.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="pt-8 border-t border-gray-100 text-center">
                            <p className="text-lg text-gray-800">
                                Questions about your privacy? Contact us at <a href="mailto:privacy@modernist.com" className="font-bold underline hover:text-gray-600 transition-colors">privacy@modernist.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
