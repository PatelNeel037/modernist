'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (searchParams.get('deleted') === 'true') {
            setError('Your account session has expired. Please log in again.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            if (result.success) {
                router.push('/');
            } else if ((result as any).requireVerification) {
                router.push(`/signup?verify_email=${encodeURIComponent(email)}`);
            } else {
                setError(result.message);
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
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
                ease: "easeOut"
            }
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA]">
            {/* Left Side: Brand Visual with dynamic elements */}
            <div className="hidden lg:flex relative bg-gray-900 overflow-hidden items-center justify-center">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2620&auto=format&fit=crop"
                        alt="Fashion Model"
                        className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>
                
                <div className="relative z-10 px-12 text-center max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-[0.2em] uppercase border border-white/30 text-white/80 rounded-full bg-white/5 backdrop-blur-sm">
                            Exclusive Collection 2024
                        </span>
                        <h2 className="text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            Redefining <br /> 
                            <span className="italic font-normal">Modern</span> Style
                        </h2>
                        <div className="w-16 h-[2px] bg-white mx-auto mb-8 opacity-50" />
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            Log in to rediscover luxury in every detail of your personalized fashion journey.
                        </p>
                    </motion.div>
                </div>

                {/* Ambient Grain Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 brightness-150 mix-blend-screen" 
                     style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
            </div>

            {/* Right Side: Re-imagined Login Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md space-y-10 relative z-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <Link href="/" className="inline-block group">
                            <span className="text-4xl font-playfair font-black text-gray-900 tracking-[-0.05em] transition-transform duration-300 group-hover:scale-105 block">
                                MODERNIST
                            </span>
                        </Link>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
                            <p className="text-gray-500 font-medium tracking-tight">Enter your credentials to access your account</p>
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div variants={itemVariants} className="bg-white p-1 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
                        <form className="p-7 space-y-6" onSubmit={handleLogin}>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-red-100"
                                    >
                                        <ShieldCheck className="h-4 w-4 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all duration-200 bg-gray-50/30 font-medium"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all duration-200 bg-gray-50/30 font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" />
                                        <div className="w-4 h-4 border border-gray-300 rounded group-hover:border-gray-900 transition-colors flex items-center justify-center">
                                            <div className="w-2 h-2 bg-transparent group-active:bg-gray-900 rounded-sm scale-0 group-checked:scale-100 transition-transform" />
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative py-4 px-6 bg-gray-900 text-white font-bold rounded-xl overflow-hidden group hover:bg-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <motion.div 
                                    className="absolute inset-x-0 bottom-0 h-1 bg-white/20 origin-left"
                                    initial={{ scaleX: 0 }}
                                    animate={isLoading ? { scaleX: 1 } : { scaleX: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Footer text */}
                    <motion.div variants={itemVariants} className="pt-2 text-center space-y-6">
                        <p className="text-sm font-medium text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-gray-900 font-bold hover:underline underline-offset-4 decoration-2">
                                Create an account
                            </Link>
                        </p>
                        
                        <div className="flex items-center justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secured AES-256</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
