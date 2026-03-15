'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, BezierDefinition } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
                setMessage(data.message || 'If you have an account with us, a reset link will be sent shortly.');
            } else {
                setError(data.message || 'Failed to request password reset. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1] as BezierDefinition
                }
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA]">
            {/* Left Side: Brand Visual */}
            <div className="hidden lg:flex relative bg-gray-900 overflow-hidden items-center justify-center">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as BezierDefinition }}
                    className="absolute inset-0"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop"
                        alt="Security"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/20 to-transparent" />
                </motion.div>
                
                <div className="relative z-10 px-12 text-center max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-[0.2em] uppercase border border-white/30 text-white/80 rounded-full bg-white/5 backdrop-blur-sm">
                            Account Security
                        </span>
                        <h2 className="text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            Secure your <br /> 
                            <span className="italic font-normal">Account</span>
                        </h2>
                        <div className="w-16 h-px bg-white mx-auto mb-8 opacity-50" />
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            Don&apos;t worry, even the best travelers lose their way sometimes. We&apos;ll help you get back to your wishlist.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Recover Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-3">
                        <Link href="/" className="inline-block group">
                            <span className="text-3xl font-playfair font-black text-gray-900 tracking-[-0.05em] transition-transform duration-300 group-hover:scale-105 block">
                                MODERNIST
                            </span>
                        </Link>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {isSubmitted ? 'Check your inbox' : 'Recover Password'}
                            </h3>
                            <p className="text-gray-500 font-medium tracking-tight">
                                {isSubmitted ? "We've sent recovery instructions to your email." : "We'll send you a link to reset your account."}
                            </p>
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div variants={itemVariants} className="bg-white p-1 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
                        <div className="p-7">
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6 space-y-6"
                                    >
                                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 mb-2">
                                            <Sparkles className="h-8 w-8 text-emerald-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                {message}
                                            </p>
                                        </div>
                                        <Link href="/login" className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all group">
                                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Back to Login
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <form key="form" className="space-y-6" onSubmit={handleSubmit}>
                                        {error && (
                                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-red-100">
                                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                                Email Address
                                            </label>
                                            <div className="group relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                                </div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Send Recovery Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </button>

                                        <div className="text-center pt-2">
                                            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                                                <ArrowLeft className="w-4 h-4" /> I remember my password
                                            </Link>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
