'use client';
import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Plus, Trash2, Edit2, XCircle, Layout, Image as ImageIcon, Type, ExternalLink, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<any>(null);
    const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
    const [heroData, setHeroData] = useState({
        tagline: 'The New Standard',
        mainTitle: 'ELEVATED',
        subTitle: 'Everyday Wear',
        description: 'Premium fabrics. Uncompromising design. Redefining your wardrobe with essentials built for the modern lifestyle.',
        bgImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
        buttonText: 'Explore Collection',
        buttonHref: '/shop'
    });

    const [isSavingHero, setIsSavingHero] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        img: '',
        href: '',
        className: '',
        imgClass: 'object-cover',
        imgPosition: 'object-center',
        imgScale: 100,
        order: 0
    });

    const loadCollections = async () => {
        setIsLoading(true);
        const [collectionsData, homepageData] = await Promise.all([
            DB.fetchCollections(),
            DB.fetchHomepage()
        ]);
        setCollections(collectionsData);
        if (homepageData && homepageData.hero) {
            setHeroData(homepageData.hero);
        }
        setIsLoading(false);
    };

    const handleSaveHero = async () => {
        setIsSavingHero(true);
        const result = await DB.updateHomepage({ hero: heroData });
        if (result && !result.error) {
            toast.success('Hero section updated successfully');
            setIsHeroModalOpen(false);
        } else {
            toast.error(result?.error || 'Failed to save hero section');
        }
        setIsSavingHero(false);
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroData({ ...heroData, bgImg: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
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

    const seedDefaults = async () => {
        const defaults = [
            {
                title: 'Men',
                subtitle: 'Elevated essentials',
                img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1740&auto=format&fit=crop',
                href: '/shop/men',
                className: 'md:col-span-2 md:row-span-2 h-[600px]',
                order: 0
            },
            {
                title: 'Women',
                subtitle: 'Modern silhouettes',
                img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1778&auto=format&fit=crop',
                href: '/shop/women',
                className: 'md:col-span-1 md:row-span-1 h-[300px] md:h-auto',
                order: 1
            },
            {
                title: 'Kids',
                subtitle: 'Playful comfort',
                img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1972&auto=format&fit=crop',
                href: '/shop/kids',
                className: 'md:col-span-1 md:row-span-1 h-[300px] md:h-auto',
                order: 2
            },
            {
                title: 'Home Textile',
                subtitle: 'Living refined',
                img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2000&auto=format&fit=crop',
                href: '/shop/home-textile',
                className: 'md:col-span-2 h-[350px]',
                order: 3
            },
            {
                title: 'Wholesale / B2B',
                subtitle: 'Partner with us',
                img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2000&auto=format&fit=crop',
                href: '/shop/wholesale-b2b',
                className: 'md:col-span-1 h-[350px]',
                order: 4
            }
        ];

        setIsLoading(true);
        try {
            for (const section of defaults) {
                await DB.addCollection(section);
            }
            toast.success('Successfully imported all default sections!');
            loadCollections();
        } catch (err) {
            toast.error('Error importing defaults');
        } finally {
            setIsLoading(false);
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
                imgClass: collection.imgClass || 'object-cover',
                imgPosition: collection.imgPosition || 'object-center',
                imgScale: collection.imgScale || 100,
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
                imgClass: 'object-cover',
                imgPosition: 'object-center',
                imgScale: 100,
                order: collections.length
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 min-h-screen">
            {/* NEW: Hero Section Editor */}
            <div className="mb-12">
                <div className="bg-bg-accent/5 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl p-8 relative">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Live Preview Column */}
                        <div className="w-full lg:w-1/3 aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/10 relative group bg-black/40">
                            <img 
                                src={heroData.bgImg} 
                                alt="Hero Preview" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center p-4">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">{heroData.tagline}</div>
                                    <div className="text-xl font-bold font-playfair text-white leading-tight">{heroData.mainTitle}</div>
                                    <div className="text-sm italic text-gray-300">{heroData.subTitle}</div>
                                </div>
                            </div>
                            <label className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/10 flex items-center gap-2 pointer-events-auto">
                                <ImageIcon size={14} /> Change Background
                                <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageChange} />
                            </label>
                        </div>

                        {/* Settings Column */}
                        <div className="flex-1 space-y-6 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                    <Layout size={20} className="text-brand-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Homepage Hero Manager</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                        <Type size={12} /> Small Tagline
                                    </label>
                                    <input 
                                        value={heroData.tagline}
                                        onChange={(e) => setHeroData({...heroData, tagline: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="The New Standard"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                        <ImageIcon size={12} /> Full BG Image URL (Fallback)
                                    </label>
                                    <input 
                                        value={heroData.bgImg.startsWith('data:') ? 'Custom Upload (Base64)' : heroData.bgImg}
                                        onChange={(e) => !e.target.value.startsWith('Custom') && setHeroData({...heroData, bgImg: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all placeholder:text-gray-600 font-mono text-xs"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                        <Type size={12} /> Main Bold Title
                                    </label>
                                    <input 
                                        value={heroData.mainTitle}
                                        onChange={(e) => setHeroData({...heroData, mainTitle: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all"
                                        placeholder="ELEVATED"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                        <Type size={12} /> Subtitle (Italic)
                                    </label>
                                    <input 
                                        value={heroData.subTitle}
                                        onChange={(e) => setHeroData({...heroData, subTitle: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all italic"
                                        placeholder="Everyday Wear"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                                    <Type size={12} /> Main Description Paragraph
                                </label>
                                <textarea 
                                    value={heroData.description}
                                    onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all resize-none"
                                    placeholder="Premium fabrics..."
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-2">
                                <button 
                                    onClick={handleSaveHero}
                                    disabled={isSavingHero}
                                    className="bg-brand-primary text-bg-main px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSavingHero ? (
                                        <div className="w-5 h-5 border-2 border-bg-main/20 border-t-bg-main rounded-full animate-spin"></div>
                                    ) : (
                                        <Save size={18} strokeWidth={3} />
                                    )}
                                    Save Hero Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                        <div className="py-24 text-center bg-white/5 rounded-b-3xl border-t border-white/5">
                            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Plus size={32} className="text-brand-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No active collections in database</h3>
                            <p className="text-gray-400 font-medium max-w-md mx-auto mb-10">
                                Your shop is currently showing the fallback default sections. 
                                Import them now to start editing their images and layouts.
                            </p>
                            <button 
                                onClick={seedDefaults}
                                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-all border border-white/10 hover:border-brand-primary/50"
                            >
                                <Edit2 size={18} className="text-brand-primary" />
                                Import Default Sections (Men, Women, etc.)
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
                    <div className="bg-bg-accent/10 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-2xl flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-100 animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
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
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar isolate will-change-transform">
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

                            <div className="space-y-4">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Collection Image</label>
                                
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Preview */}
                                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 relative flex items-center justify-center shrink-0 isolate">
                                        {formData.img ? (
                                            <div className="w-full h-full relative overflow-hidden">
                                                <img 
                                                    src={formData.img} 
                                                    className={`w-full h-full transition-transform duration-300 ${formData.imgClass} ${formData.imgPosition}`} 
                                                    style={{ transform: `scale(${formData.imgScale / 100})` }}
                                                    alt="Preview" 
                                                />
                                            </div>
                                        ) : (
                                            <Plus size={24} className="text-gray-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4 w-full">
                                        {/* File Upload Button */}
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                id="file-upload"
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({...formData, img: reader.result as string});
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <label 
                                                autoFocus
                                                htmlFor="file-upload"
                                                className="w-full bg-white/10 hover:bg-white/20 text-white px-5 py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all border border-white/5 hover:border-brand-primary/50 group"
                                            >
                                                <Edit2 size={18} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                                <span className="font-bold">Select Local Image</span>
                                            </label>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image Fit</span>
                                                <div className="flex gap-2">
                                                    {[
                                                        { label: 'Fill (Cover)', val: 'object-cover' },
                                                        { label: 'Fit (Contain)', val: 'object-contain' }
                                                    ].map(fit => (
                                                        <button
                                                            key={fit.val}
                                                            type="button"
                                                            onClick={() => setFormData({...formData, imgClass: fit.val})}
                                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                                formData.imgClass === fit.val 
                                                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' 
                                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {fit.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Crop Alignment</span>
                                                <div className="flex gap-2">
                                                    {[
                                                        { label: 'Top', val: 'object-top' },
                                                        { label: 'Center', val: 'object-center' },
                                                        { label: 'Bottom', val: 'object-bottom' }
                                                    ].map(pos => (
                                                        <button
                                                            key={pos.val}
                                                            type="button"
                                                            onClick={() => setFormData({...formData, imgPosition: pos.val})}
                                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                                formData.imgPosition === pos.val 
                                                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' 
                                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {pos.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    <span>Image Zoom</span>
                                                    <span className="text-brand-primary">{formData.imgScale}%</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="100"
                                                    max="200"
                                                    step="5"
                                                    className="w-full accent-brand-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                                    value={formData.imgScale}
                                                    onChange={(e) => setFormData({...formData, imgScale: parseInt(e.target.value)})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Card Layout & Size (Container)</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Featured (Large)', class: 'md:col-span-2 md:row-span-2 h-[600px]' },
                                        { label: 'Standard (Box)', class: 'md:col-span-1 md:row-span-1 h-[300px] md:h-auto' },
                                        { label: 'Wide (Banner)', class: 'md:col-span-2 h-[400px]' },
                                        { label: 'Small (Row)', class: 'md:col-span-1 h-[400px]' }
                                    ].map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => setFormData({...formData, className: preset.class})}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                                formData.className === preset.class 
                                                ? 'bg-brand-primary/20 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10' 
                                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">{preset.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <input 
                                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-white/20 font-mono transition-opacity"
                                        placeholder="Advanced CSS classes..."
                                        value={formData.className}
                                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                                    />
                                    <p className="text-[10px] text-gray-500 ml-1 italic opacity-60">The field above updates automatically based on your size choice.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Grid Display Order</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-gray-600 font-medium"
                                    placeholder="e.g. 0 for first, 1 for second..."
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
