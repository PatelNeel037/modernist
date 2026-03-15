'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Eye, EyeOff, Instagram, Loader2 } from 'lucide-react';
import { DB } from '@/services/db';
import toast from 'react-hot-toast';

export default function AdminInstagramPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [formData, setFormData] = useState({
        imageUrl: '',
        link: '#',
        isActive: true,
        order: 0
    });

    const loadPosts = async () => {
        setIsLoading(true);
        const data = await DB.fetchInstagramPosts(true);
        setPosts(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await DB.updateInstagramPost(editingPost._id, formData);
                toast.success('Post updated');
            } else {
                await DB.addInstagramPost(formData);
                toast.success('Post added');
            }
            setIsModalOpen(false);
            loadPosts();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const toggleStatus = async (post: any) => {
        await DB.updateInstagramPost(post._id, { isActive: !post.isActive });
        loadPosts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        await DB.deleteInstagramPost(id);
        toast.success('Deleted');
        loadPosts();
    };

    const openModal = (post: any = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                imageUrl: post.imageUrl,
                link: post.link,
                isActive: post.isActive,
                order: post.order
            });
        } else {
            setEditingPost(null);
            setFormData({ imageUrl: '', link: '#', isActive: true, order: 0 });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-playfair font-bold text-white tracking-tight">
                        Instagram Control
                    </h1>
                    <p className="text-gray-400 text-sm">Manage the images displayed in your storefront's Instagram section.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-brand-primary text-bg-main px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Plus size={20} /> Add Post
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <p className="text-gray-400 font-medium font-playfair italic">Loading feed...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-bg-accent/5 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden group shadow-2xl transition-all duration-500 hover:border-white/20">
                            <div className="aspect-square relative overflow-hidden">
                                <img src={post.imageUrl} alt="Insta" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => toggleStatus(post)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
                                        {post.isActive ? <Eye size={20} /> : <EyeOff size={20} className="text-red-400" />}
                                    </button>
                                    <button onClick={() => openModal(post)} className="p-3 bg-brand-primary text-bg-main rounded-full font-bold transition-all hover:scale-110">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(post._id)} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500 backdrop-blur-md transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                {!post.isActive && (
                                    <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white tracking-widest shadow-lg">
                                        Hidden
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500 text-xs truncate max-w-[70%]">
                                    <LinkIcon size={12} />
                                    <span className="truncate">{post.link}</span>
                                </div>
                                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter bg-white/5 px-2 py-1 rounded">
                                    Order: {post.order}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-bg-accent/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
                        <h2 className="text-3xl font-playfair font-bold text-white mb-8">
                            {editingPost ? 'Update Entry' : 'New Instagram Feed'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest text-emerald-500 font-black">Image URL</label>
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-all font-medium"
                                    placeholder="Unsplash or Image Link..."
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest text-emerald-500 font-black">Link (Optional)</label>
                                <input
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-all font-medium"
                                    placeholder="https://instagram.com/p/..."
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest text-emerald-500 font-black">Display Order</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary transition-all font-medium"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-end flex-1 pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'left-7' : 'left-1'}`} />
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Visible</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="flex-2 bg-brand-primary text-bg-main py-5 rounded-4xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all duration-300">
                                    {editingPost ? 'Sync Feed' : 'Launch Post'}
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
