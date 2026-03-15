'use client';
import { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, Search, Loader2 } from 'lucide-react';
import { DB } from '@/services/db';
import toast from 'react-hot-toast';

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadSubscribers = async () => {
        setIsLoading(true);
        try {
            const data = await DB.fetchSubscribers();
            setSubscribers(data);
        } catch (error) {
            toast.error('Failed to load subscribers');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-playfair font-bold text-white tracking-tight">
                        Subscribers
                    </h1>
                    <p className="text-gray-400 text-sm">Manage your newsletter audience and marketing list.</p>
                </div>
                
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary transition-all"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <p className="text-gray-400 font-medium font-playfair italic">Gathering your list...</p>
                </div>
            ) : (
                <div className="bg-bg-accent/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-left">
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-emerald-500 font-black">Subscriber</th>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-emerald-500 font-black">Joined Date</th>
                                    <th className="p-6 text-[10px] uppercase tracking-widest text-emerald-500 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                    <Mail size={18} />
                                                </div>
                                                <span className="text-white font-medium">{subscriber.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Calendar size={14} />
                                                {new Date(subscriber.createdAt).toLocaleDateString(undefined, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button 
                                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                                onClick={() => {
                                                    // In a real app, we'd add functionality here.
                                                    toast.error('Deletion disabled in demo mode');
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSubscribers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Mail size={48} className="text-gray-600" />
                                                <p className="text-gray-500 font-medium font-playfair italic">No subscribers found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
                            Total: {filteredSubscribers.length} Subscribers
                        </span>
                        <div className="flex gap-2">
                            {/* Pagination would go here */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
