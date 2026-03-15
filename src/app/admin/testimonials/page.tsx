'use client';
import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        text: '',
        rating: 5,
        isActive: true,
        featured: false
    });

    const loadTestimonials = async () => {
        setIsLoading(true);
        const data = await DB.fetchTestimonials(true);
        setTestimonials(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (editingTestimonial) {
            result = await DB.updateTestimonial(editingTestimonial._id, formData);
        } else {
            result = await DB.addTestimonial(formData);
        }

        if (result.success) {
            toast.success(editingTestimonial ? 'Updated' : 'Created');
            setIsModalOpen(false);
            loadTestimonials();
        } else {
            toast.error(result.message || 'Error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            const result = await DB.deleteTestimonial(id);
            if (result.success) {
                toast.success('Deleted');
                loadTestimonials();
            } else {
                toast.error('Error');
            }
        }
    };

    const openModal = (test?: any) => {
        if (test) {
            setEditingTestimonial(test);
            setFormData({
                name: test.name,
                text: test.text,
                rating: test.rating,
                isActive: test.isActive,
                featured: test.featured || false
            });
        } else {
            setEditingTestimonial(null);
            setFormData({
                name: '',
                text: '',
                rating: 5,
                isActive: true,
                featured: false
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-playfair font-bold text-white tracking-tight">
                        Testimonials Management
                    </h1>
                    <p className="text-gray-400 text-sm">Manage and curate customer feedback for your storefront.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-brand-primary text-bg-main px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Plus size={20} strokeWidth={3} /> Add New Testimonial
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse font-medium">Curating feedback...</p>
                </div>
            ) : (
                <div className="bg-bg-accent/5 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5 text-gray-300 font-bold uppercase text-[11px] tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Customer Info</th>
                                <th className="px-8 py-5 w-1/2">Testimonial Content</th>
                                <th className="px-8 py-5 text-center">Visibility</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {testimonials.map((test) => (
                                <tr key={test._id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-white text-lg leading-none mb-2">{test.name}</div>
                                        <div className="flex text-emerald-400 gap-1.5 p-1 -ml-1 w-fit rounded-lg hover:bg-white/5 transition-all">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => DB.updateTestimonial(test._id, { ...test, rating: star }).then(loadTestimonials)}
                                                    className="transition-transform hover:scale-125"
                                                    title={`Set rating to ${star}`}
                                                >
                                                    <Star 
                                                        size={14} 
                                                        fill={test.rating >= star ? 'currentColor' : 'none'} 
                                                        strokeWidth={test.rating >= star ? 0 : 2}
                                                        className={test.rating >= star ? '' : 'text-white/20'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-400 italic font-medium leading-relaxed">
                                        <span className="text-emerald-500 opacity-40 text-2xl font-serif mr-1">"</span>
                                        {test.text}
                                        <span className="text-emerald-500 opacity-40 text-2xl font-serif ml-1">"</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                test.isActive 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {test.isActive ? 'Live' : 'Hidden'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openModal(test)} 
                                                className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                                                title="Edit Entry"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(test._id)} 
                                                className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                                                title="Delete Entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {testimonials.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 font-medium">No testimonials found. Start by adding one!</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-lg bg-black/60">
                    <div className="bg-bg-accent/10 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-100 animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-2xl font-playfair font-bold text-white">
                                    {editingTestimonial ? 'Update Feedback' : 'New Feedback Entry'}
                                </h2>
                                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Entry Configuration</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Customer Identity</label>
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                    placeholder="Enter full name..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">The Testimonial</label>
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none h-36 transition-all placeholder:text-gray-600 font-medium resize-none leading-relaxed"
                                    placeholder="Type the customer's comments here..."
                                    value={formData.text}
                                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="space-y-2 flex-1">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1 text-center">Satisfaction Rating</label>
                                    <div className="flex justify-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({...formData, rating: star})}
                                                className={`p-1 transition-all hover:scale-125 active:scale-95 ${formData.rating >= star ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-white/10'}`}
                                            >
                                                <Star size={32} fill={formData.rating >= star ? 'currentColor' : 'none'} strokeWidth={formData.rating >= star ? 0 : 2} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2 flex justify-center flex-col items-center">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500">Live Status</label>
                                    <label className="relative inline-flex items-center cursor-pointer group mt-2">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        />
                                        <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner group-hover:scale-105 transition-transform duration-300"></div>
                                    </label>
                                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${formData.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {formData.isActive ? 'Visible to Public' : 'Hidden from Site'}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="flex-2 bg-brand-primary text-bg-main py-5 rounded-4xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all duration-300">
                                    {editingTestimonial ? 'Sync Updates' : 'Publish Entry'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-gray-400 py-5 rounded-4xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300">
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
