'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, BezierDefinition } from 'framer-motion';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!token) {
            setError('Missing reset token. Please use the link sent to your email.');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
            >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 mb-2">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Password Updated</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        Your new password has been set. You can now use it to log in to your account.
                    </p>
                </div>
                <Link href="/login" className="w-full flex justify-center py-4 px-6 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                    Go to Login
                </Link>
            </motion.div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {!token && (
                <div className="bg-amber-50 text-amber-700 text-xs px-4 py-3 rounded-lg flex items-center gap-3 border border-amber-100 font-medium">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Invalid or missing token. Use the link in your email.
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 text-xs px-4 py-3 rounded-lg flex items-center gap-3 border border-red-100 font-medium">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl py-3.5 pl-11 pr-12 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
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

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-gray-900 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>
            </div>

            <button 
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 group"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                    <>Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">Loading...</div>}>
            <ResetPasswordPageContent />
        </Suspense>
    );
}

function ResetPasswordPageContent() {
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
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670&auto=format&fit=crop"
                        alt="Reset Password"
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
                            Account Recovery
                        </span>
                        <h2 className="text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            Create New <br /> 
                            <span className="italic font-normal">Credentials</span>
                        </h2>
                        <div className="w-16 h-px bg-white mx-auto mb-8 opacity-50" />
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            Almost there. Choose a strong password to keep your fashion journey secure.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Reset Form */}
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
                            <h3 className="text-2xl font-bold text-gray-900">Set New Password</h3>
                            <p className="text-gray-500 font-medium tracking-tight">Enter your new secure password below.</p>
                        </div>
                    </motion.div>

                    {/* Form Container */}
                    <motion.div variants={itemVariants} className="bg-white p-1 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 mb-4">
                        <div className="p-7">
                            <Suspense fallback={<div className="text-center py-4">Loading Form...</div>}>
                                <ResetPasswordForm />
                            </Suspense>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Remembered your password?{' '}
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
