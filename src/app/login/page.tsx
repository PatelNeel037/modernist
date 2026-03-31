'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Mail, Check } from 'lucide-react';
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
    const [rememberMe, setRememberMe] = useState(false);

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
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden bg-[#E6E9EF]">
                {/* Skeuomorphic background gradients */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-gray-400/20 rounded-full blur-[100px] pointer-events-none" />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[440px] space-y-10 relative z-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <Link href="/" className="inline-block group">
                            <span className="text-4xl font-playfair font-black text-gray-900 tracking-[-0.05em] transition-transform duration-300 group-hover:scale-105 block drop-shadow-sm">
                                MODERNIST
                            </span>
                        </Link>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Welcome Back</h3>
                            <p className="text-gray-500 font-medium tracking-tight">Enter your credentials to access your account</p>
                        </div>
                    </motion.div>

                    {/* Form Container: Heavy Skeuomorphism */}
                    <motion.div 
                        variants={itemVariants} 
                        className="bg-[#E6E9EF] p-2 rounded-[40px] shadow-[20px_20px_60px_#c2c6ce,-20px_-20px_60px_#ffffff] border border-white/40"
                    >
                        <form className="p-8 space-y-8" onSubmit={handleLogin}>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-50/50 text-red-600 text-sm px-4 py-3 rounded-2xl flex items-center gap-3 border border-red-200/50 shadow-[inset_2px_2px_5px_#fca5a550]"
                                    >
                                        <ShieldCheck className="h-4 w-4 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-14 pr-6 py-4.5 bg-[#E6E9EF] shadow-[inset_6px_6px_12px_#c2c6ce,inset_-6px_-6px_12px_#ffffff] rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 border-none transition-all duration-300 font-semibold"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-2">
                                        <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-14 pr-14 py-4.5 bg-[#E6E9EF] shadow-[inset_6px_6px_12px_#c2c6ce,inset_-6px_-6px_12px_#ffffff] rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 border-none transition-all duration-300 font-semibold"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-900 transition-colors focus:outline-none z-10"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer group select-none">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={rememberMe} 
                                            onChange={(e) => setRememberMe(e.target.checked)} 
                                        />
                                        <div className="w-6 h-6 bg-[#E6E9EF] shadow-[inset_3px_3px_6px_#c2c6ce,inset_-3px_-3px_6px_#ffffff] rounded-lg group-hover:shadow-[inset_2px_2px_4px_#c2c6ce,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center justify-center">
                                            <Check className={`w-3.5 h-3.5 text-blue-600 transition-all duration-200 stroke-[3.5] ${rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                                        </div>
                                    </div>
                                    <span className="ml-4 text-[11px] font-black text-gray-500 group-hover:text-gray-900 uppercase tracking-widest transition-colors">Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative py-5 px-8 bg-gray-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-[8px_8px_20px_rgba(0,0,0,0.3),-4px_-4px_15px_rgba(255,255,255,0.05)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Checking...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Footer text */}
                    <motion.div variants={itemVariants} className="pt-2 text-center space-y-8">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-gray-900 font-black hover:text-black transition-colors decoration-gray-400 decoration-2 underline underline-offset-4">
                                Join Now
                            </Link>
                        </p>
                        
                        <div className="flex items-center justify-center pt-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-[#E6E9EF] shadow-[4px_4px_8px_#c2c6ce,-4px_-4px_8px_#ffffff] rounded-full opacity-60">
                                <ShieldCheck className="h-4 w-4 text-gray-900" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-900">Encrypted AES-256</span>
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
