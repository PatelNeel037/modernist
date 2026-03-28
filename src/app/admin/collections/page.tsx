'use client';
import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Plus, Trash2, Edit2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        img: '',
        href: '',
        className: '',
        order: 0
    });

    const loadCollections = async () => {
        setIsLoading(true);
        const data = await DB.fetchCollections();
        setCollections(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadCollections();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (editingCollection) {
            result = await DB.updateCollection(editingCollection._id, formData);
        } else {
            result = await DB.addCollection(formData);
        }

        if (result && !result.error) {
            toast.success(editingCollection ? 'Collection updated' : 'Collection added');
            setIsModalOpen(false);
            loadCollections();
        } else {
            toast.error(result?.error || 'Failed to save collection');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this collection section?')) {
            const result = await DB.deleteCollection(id);
            if (result && !result.error) {
                toast.success('Collection deleted');
                loadCollections();
            } else {
                toast.error('Failed to delete collection');
            }
        }
    };

    const openModal = (collection?: any) => {
        if (collection) {
            setEditingCollection(collection);
            setFormData({
                title: collection.title,
                subtitle: collection.subtitle,
                img: collection.img,
                href: collection.href,
                className: collection.className,
                order: collection.order
            });
        } else {
            setEditingCollection(null);
            setFormData({
                title: '',
                subtitle: '',
                img: '',
                href: '',
                className: 'md:col-span-1 h-[300px]',
                order: collections.length
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-playfair font-bold text-white tracking-tight">
                        Discover Collections
                    </h1>
                    <p className="text-gray-400 text-sm">Manage the images and links for the homepage collections grid.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-brand-primary text-bg-main px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Plus size={20} strokeWidth={3} /> Add Collection Card
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse font-medium">Loading collections...</p>
                </div>
            ) : (
                <div className="bg-bg-accent/5 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5 text-gray-300 font-bold uppercase text-[11px] tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Image Preview</th>
                                <th className="px-8 py-5">Title & Subtitle</th>
                                <th className="px-8 py-5">Link</th>
                                <th className="px-8 py-5">Grid Class</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {collections.map((col) => (
                                <tr key={col._id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 relative bg-gray-900">
                                            <img src={col.img} alt={col.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Error'; }} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-white text-lg leading-none mb-2">{col.title}</div>
                                        <div className="text-gray-400 text-sm">{col.subtitle}</div>
                                    </td>
                                    <td className="px-8 py-6 text-emerald-400 font-medium font-mono text-sm max-w-[200px] truncate">
                                        {col.href}
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="px-2 py-1 bg-white/10 rounded text-xs truncate max-w-[150px] inline-block">{col.className}</code>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openModal(col)} 
                                                className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                                                title="Edit Collection"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(col._id)} 
                                                className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110"
                                                title="Delete Collection"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {collections.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 font-medium">No collections found. Click "Add Collection Card" to build your homepage grid.</p>
                            <p className="text-gray-600 text-sm mt-2">Note: If this list is empty, the website will show the default collections.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-lg bg-black/60">
                    <div className="bg-bg-accent/10 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-100 animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-2xl font-playfair font-bold text-white">
                                    {editingCollection ? 'Edit Collection' : 'New Collection Card'}
                                </h2>
                                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Homepage Grid Setup</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                        placeholder="e.g. Men"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Subtitle</label>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                        placeholder="e.g. Elevated essentials"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Image URL</label>
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                    placeholder="https://images.unsplash.com/... or /local-image.jpg"
                                    value={formData.img}
                                    onChange={(e) => setFormData({...formData, img: e.target.value})}
                                    required
                                />
                                {formData.img && (
                                    <div className="mt-2 text-xs text-gray-400 ml-2">Preview will be visible in the table.</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Link URL</label>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                        placeholder="e.g. /shop/men"
                                        value={formData.href}
                                        onChange={(e) => setFormData({...formData, href: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">CSS Class (Grid Layout)</label>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium font-mono text-xs"
                                        placeholder="e.g. md:col-span-2 md:row-span-2 h-[600px]"
                                        value={formData.className}
                                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Order Index (Sort)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                    value={formData.order}
                                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="flex-2 bg-brand-primary text-bg-main py-5 rounded-4xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all duration-300 w-full">
                                    {editingCollection ? 'Save Changes' : 'Add to Grid'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-gray-400 py-5 rounded-4xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 px-6">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
