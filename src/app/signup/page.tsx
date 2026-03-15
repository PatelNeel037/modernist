'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateEmail } from '@/lib/validation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}

function SignupForm() {
    const router = useRouter();
    const { register, verifyEmail, resendOTP } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [timer, setTimer] = useState(0);

    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyEmailParam = searchParams.get('verify_email');
        if (verifyEmailParam) {
            setEmail(verifyEmailParam);
            setShowVerify(true);
        }
    }, [searchParams]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setOtpMessage('');

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.message || 'Invalid email');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(name, email, password);
            if (result.success) {
                if (result.requireVerification) {
                    setShowVerify(true);
                    setTimer(60);
                } else {
                    setIsSuccess(true);
                    setTimeout(() => {
                        router.push('/');
                    }, 1500);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a 6-digit code.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await verifyEmail(email, otp);
            if (result.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        setError('');
        setOtpMessage('');
        try {
            const result = await resendOTP(email);
            if (result.success) {
                setOtpMessage(result.message);
                setTimer(60);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut" as any
            }
        }
    };

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFA]">
            {/* Left Side: Brand Visual (Mirrored from Login) */}
            <div className="hidden lg:flex relative bg-gray-900 overflow-hidden items-center justify-center">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop"
                        alt="Fashion Minimal"
                        className="w-full h-full object-cover opacity-50 mix-blend-overlay"
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
                            Join the Club
                        </span>
                        <h2 className="text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            Elevate Your <br /> 
                            <span className="italic font-normal">Wardrobe</span>
                        </h2>
                        <div className="w-16 h-px bg-white mx-auto mb-8 opacity-50" />
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            Create an account to unlock exclusive access to our newest collections and personalized recommendations.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Re-imagined Signup Form */}
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
                                {showVerify ? 'Verify your identity' : 'Create an Account'}
                            </h3>
                            <p className="text-gray-500 font-medium tracking-tight">
                                {showVerify ? `Enter the 6-digit code sent to ${email}` : 'Start your luxury journey with us today'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div variants={itemVariants} className="bg-white p-1 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
                        <div className="p-7">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-red-100"
                                    >
                                        <ShieldCheck className="h-4 w-4 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                                {otpMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 bg-emerald-50 text-emerald-600 text-sm px-4 py-3 rounded-lg flex items-center gap-3 border border-emerald-100"
                                    >
                                        <Sparkles className="h-4 w-4 shrink-0" />
                                        {otpMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {showVerify ? (
                                    <motion.form 
                                        key="verify"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleVerify} 
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-center block">
                                                Verification Code
                                            </label>
                                            <input 
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl py-4 pr-4 px-4 text-gray-900 placeholder:text-gray-200 outline-none transition-all text-center tracking-[0.6em] text-2xl font-bold focus:ring-4 focus:ring-gray-900/5"
                                                placeholder="000000"
                                                required
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isLoading || isSuccess}
                                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : isSuccess ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <>Verify Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </button>

                                        <div className="text-center pt-2">
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={timer > 0 || isLoading}
                                                className={`text-sm font-semibold ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900 underline underline-offset-4'} transition-colors`}
                                            >
                                                {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive a code? Resend"}
                                            </button>
                                        </div>

                                        <button 
                                            type="button"
                                            onClick={() => setShowVerify(false)}
                                            className="w-full py-2 text-gray-400 hover:text-gray-900 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-3 h-3" /> Back to Signup
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.form 
                                        key="signup"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={handleSignup} 
                                        className="space-y-5"
                                    >
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                                    <input 
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-gray-900 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                                    <input 
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-gray-900 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
                                                        placeholder="name@email.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-gray-900 rounded-xl py-3.5 pl-11 pr-12 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isLoading || isSuccess}
                                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 group"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : isSuccess ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <>Join Modernist <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Footer text */}
                    <motion.div variants={itemVariants} className="text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-gray-900 font-bold hover:underline underline-offset-4 decoration-2">
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
