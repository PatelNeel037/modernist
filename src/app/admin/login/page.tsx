'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DB } from '@/services/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await DB.adminLogin(email, password);

            if (result.success) {
                router.push('/admin');
            } else {
                setError(result.message || 'Invalid admin credentials.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const containerVariants = {
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
                ease: "easeOut"
            }
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0c0a09]">
            {/* Left Side: Professional/Stealth Visual */}
            <div className="hidden lg:flex relative bg-gray-900 overflow-hidden items-center justify-center border-r border-white/5">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 50% 50%, #331c08 0%, transparent 70%)` 
                    }}
                />
                
                <div className="relative z-10 px-12 text-center max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <ShieldCheck className="w-8 h-8 text-white/80" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-5xl font-playfair font-bold text-white mb-6 tracking-tight">
                            Admin <span className="text-white/40 italic">Terminal</span>
                        </h2>
                        <div className="w-12 h-px bg-white/30 mx-auto mb-8" />
                        <p className="text-lg text-gray-400 font-light leading-relaxed tracking-wide">
                            Secure access point for Modernist management. Please authenticate to manage your premium collections.
                        </p>
                    </motion.div>
                </div>

                {/* Ambient Grain Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 brightness-150 mix-blend-screen" 
                     style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden bg-[#0c0a09]">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Store
                </Link>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md space-y-12 relative z-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <span className="text-4xl font-playfair font-black text-white tracking-[-0.05em]">
                            MODERNIST
                        </span>
                        <div className="flex items-center justify-center gap-2 text-gray-500 font-medium tracking-widest text-[10px] uppercase">
                            <Lock className="w-3 h-3" /> Secure Administrator Login
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div variants={itemVariants} className="bg-white/2 border border-white/5 p-1 rounded-3xl backdrop-blur-2xl shadow-2xl">
                        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-500/10 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-3 border border-red-500/20"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                                        Email Terminal
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 font-light"
                                            placeholder="admin@modernist.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-3">
                                    <label htmlFor="password" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                                        Authentication Key
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 font-light"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative py-4 px-6 bg-white text-black font-bold rounded-2xl overflow-hidden group hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        <span>Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Initialize Session</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Footer text */}
                    <motion.div variants={itemVariants} className="text-center">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                            Restricted Access Zone
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
