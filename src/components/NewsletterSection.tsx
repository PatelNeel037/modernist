'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';
import { DB } from '@/services/db';
import toast from 'react-hot-toast';

import { validateEmail } from '@/lib/validation';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend Validation
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            toast.error(emailValidation.message || 'Invalid email');
            return;
        }

        setStatus('loading');

        try {
            const data = await DB.subscribeNewsletter(email);

            if (data.success || data.message === 'You are already subscribed!') {
                setStatus('success');
                setEmail('');
                toast.success(data.message || 'Subscribed successfully!');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('idle');
                toast.error(data.message || 'Subscription failed');
            }
        } catch (error) {
            setStatus('idle');
            toast.error('Network Error');
        }
    };

    return (
        <section className="py-32 bg-[#E3CFB8] text-brand-dark relative overflow-hidden">
            {/* Artistic background elements */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-dark/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-brand-dark/10 to-transparent" />

            <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
                <ScrollReveal direction="up" className="inline-block p-1 px-3 bg-[#F1E4D4] rounded-full border border-white/50 mb-6 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_#ffffff]">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8F4E34]/60">Exclusive Access</span>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                    <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: "100%", opacity: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-px bg-[#8F4E34]/20 flex-1"
                        />
                        <h2 className="text-4xl md:text-6xl font-playfair font-black text-[#1E1713] tracking-tight leading-tight whitespace-nowrap drop-shadow-md">
                            Newsletter
                        </h2>
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: "100%", opacity: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-px bg-[#8F4E34]/20 flex-1"
                        />
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.2}>
                    <p className="text-[#68584D] mb-12 text-xl max-w-lg mx-auto font-medium leading-relaxed italic">
                        Sign up & receive a <span className="text-[#1E1713] font-black not-italic border-b-2 border-[#8F4E34]/20">15% discount</span> on your premier order.
                    </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.3}>
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className="bg-white p-12 rounded-[3rem] shadow-[20px_20px_40px_rgba(107,79,79,0.1),-20px_-20px_40px_#ffffff] border border-white/50 inline-flex flex-col items-center"
                            >
                                <CheckCircle className="w-16 h-16 text-[#8F4E34] mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-[#1E1713]">Welcome Aboard</h3>
                                <p className="text-[#68584D] font-medium">Check your inbox for your exclusive code.</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleSubmit}
                                className="relative flex flex-col md:flex-row gap-6 max-w-xl mx-auto items-center"
                            >
                                <div className="relative w-full group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F4E34]/30 group-focus-within:text-[#8F4E34] transition-colors z-20" />
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 rounded-full bg-[#fcfbf9] border border-white text-[#1E1713] placeholder-[#8F4E34]/40 focus:outline-none focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),6px_6px_15px_rgba(107,79,79,0.1)] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_#ffffff] transition-all duration-500 font-bold"
                                        required
                                        disabled={status === 'loading'}
                                        suppressHydrationWarning
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full md:w-auto bg-[#8F4E34] text-white pl-8 pr-12 py-5 rounded-full font-black hover:bg-[#1E1713] transition-all duration-500 uppercase tracking-[0.2em] text-xs shadow-[8px_8px_16px_rgba(107,79,79,0.2),-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_rgba(107,79,79,0.1),-4px_-4px_8px_#ffffff] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 group flex items-center justify-center relative overflow-hidden"
                                    suppressHydrationWarning
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Subscribe</span>
                                            <ArrowRight className="w-4 h-4 absolute right-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </ScrollReveal>
            </div>

            {/* Background floating decor */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 4, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[15%] w-32 h-32 border border-brand-dark/5 rounded-full -z-10"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -4, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-[10%] w-48 h-48 bg-brand-dark/2 rounded-full -z-10"
            />
        </section>
    );
}
