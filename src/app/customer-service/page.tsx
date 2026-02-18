'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CustomerServicePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navbar />

            {/* Header */}
            <header className="pt-32 pb-16 text-center bg-gray-100">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-playfair font-bold mb-4">We’re Here to Help 🤝</h1>
                    <p className="text-gray-600 text-lg">Questions? Concerns? We are always ready to assist you.</p>
                </div>
            </header>

            <section className="container mx-auto px-6 py-12">

                {/* Response Promise */}
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg text-center shadow-sm border-l-4 border-gray-900 mb-12">
                    <p className="flex items-center justify-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5" /> We usually respond within <strong>24 hours</strong>.
                    </p>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center transform transition duration-300 hover:-translate-y-1">
                        <div className="text-gray-900 mb-6 flex justify-center"><Mail size={48} /></div>
                        <h3 className="text-xl font-playfair font-bold mb-4">Email Us</h3>
                        <p className="text-gray-600 text-lg mb-2">support@modernist.com</p>
                        <p className="text-sm text-gray-400">Available Mon–Sat, 10 AM – 7 PM</p>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm text-center transform transition duration-300 hover:-translate-y-1">
                        <div className="text-gray-900 mb-6 flex justify-center"><Phone size={48} /></div>
                        <h3 className="text-xl font-playfair font-bold mb-4">Call Us</h3>
                        <p className="text-gray-600 text-lg mb-2">+1 (555) 123-4567</p>
                        <p className="text-sm text-gray-400">Available Mon–Sat, 10 AM – 7 PM</p>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm text-center transform transition duration-300 hover:-translate-y-1">
                        <div className="text-gray-900 mb-6 flex justify-center"><MessageCircle size={48} /></div>
                        <h3 className="text-xl font-playfair font-bold mb-4">WhatsApp</h3>
                        <p className="text-gray-600 text-lg mb-2">+1 (555) 987-6543</p>
                        <p className="text-sm text-gray-400">Instant answers for quick queries</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-playfair font-bold mb-8 text-center">Send a Message</h2>

                    {isSuccess ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                            <button onClick={() => setIsSuccess(false)} className="mt-6 text-sm text-gray-500 underline hover:text-gray-900">Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors resize-y"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-70"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Extras */}
                <div className="text-center mt-16">
                    <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                    <p className="text-gray-600 mb-6">Your comfort matters to us.</p>
                    <Link href="/" className="inline-block px-8 py-3 border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors">
                        Continue Shopping
                    </Link>
                </div>

            </section>

            <Footer />
        </main>
    );
}
