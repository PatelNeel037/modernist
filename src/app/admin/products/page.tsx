'use client';

import { useState, useEffect } from 'react';
import styles from './products.module.css';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/currency';
// import { useAuth } from '@/context/AuthContext'; // Assume admin protection from layout

export default function AdminProductsPage() {
    // --- State ---
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Women',
        type: 'Shirt',
        price: '',
        discountPrice: '',
        stock: '',
        status: 'active',
        imagesText: '',
        description: '',
        material: '',
        fit: '',
        tags: '',
        sizes: [] as string[]
    });

    // --- Fetch Products ---
    async function loadProducts() {
        setLoading(true);
        try {
            const res = await fetch('/api/products?mode=admin');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (e) {
            console.error("Failed to load products", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // --- Filter Logic ---
    const filteredProducts = products.filter(p => {
        const matchesCategory = filterCategory ? p.category.toLowerCase() === filterCategory.toLowerCase() : true;
        const matchesSearch = p.name.toLowerCase().includes(filterSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // --- Modal Handlers ---
    const openModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                type: product.type,
                price: product.price,
                discountPrice: product.discountPrice || '',
                stock: product.stock,
                status: product.status || 'active',
                imagesText: product.images ? product.images.join('\n') : '',
                description: product.description || '',
                material: product.material || '',
                fit: product.fit || '',
                tags: product.tags ? product.tags.join(', ') : '',
                sizes: product.sizes || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'Women',
                type: 'Shirt',
                price: '',
                discountPrice: '',
                stock: '',
                status: 'active',
                imagesText: '',
                description: '',
                material: '',
                fit: '',
                tags: '',
                sizes: []
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // --- Form Handlers ---
    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setFormData(prev => ({
                    ...prev,
                    imagesText: prev.imagesText ? `${prev.imagesText}, ${data.url}` : data.url
                }));
            } else {
                toast.error('Image upload failed: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Upload error');
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: any) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) return { ...prev, sizes: [...prev.sizes, value] };
            return { ...prev, sizes: prev.sizes.filter(s => s !== value) };
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            images: formData.imagesText.split(/[\n,]+/).map(i => i.trim()).filter(Boolean)
        };
        delete (payload as any).imagesText;

        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Saved successfully!');
                closeModal();
                loadProducts();
            } else {
                toast.error('Save failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error occurred');
        }
    };

    const handleDelete = async (id: number, isHard: boolean = false) => {
        const msg = isHard
            ? 'Are you SURE you want to PERMANENTLY delete this product? This action cannot be undone.'
            : 'Are you sure you want to delete this product?';

        if (!confirm(msg)) return;

        try {
            const url = isHard ? `/api/products/${id}?hard=true` : `/api/products/${id}`;
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) {
                toast.success(isHard ? 'Product permanently deleted' : 'Product moved to trash');
                loadProducts();
            } else {
                toast.error('Failed to delete');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error occurred');
        }
    };

    // --- Render ---
    return (
        <div className={styles.productsContent}>
            <div className={styles.headerSection}>
                <h2 className={styles.headerTitle}>Inventory Management</h2>
                <button className={styles.btnAdd} onClick={() => openModal()}>
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <select
                    className={styles.filterInput}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option className="bg-[#0f172a] text-white" value="">All Categories</option>
                    <option className="bg-[#0f172a] text-white" value="Men">Men</option>
                    <option className="bg-[#0f172a] text-white" value="Women">Women</option>
                    <option className="bg-[#0f172a] text-white" value="Kids">Kids</option>
                    <option className="bg-[#0f172a] text-white" value="Home Textile">Home Textile</option>
                    <option className="bg-[#0f172a] text-white" value="Wholesale / B2B">Wholesale / B2B</option>
                </select>
                <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="Search product..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div>Loading Products...</div>
            ) : (
                <div className={styles.productsGrid}>
                    {filteredProducts.map((product: any) => (
                        <div
                            key={product.id}
                            className={styles.productCard}
                            style={{ opacity: product.status === 'deleted' ? 0.6 : 1 }}
                        >
                            <img
                                src={product.images?.[0] || '/images/placeholder.png'}
                                alt={product.name}
                                className={styles.productImg}
                                onError={(e: any) => { e.target.src = 'https://placehold.co/300x400?text=No+Image'; }}
                            />
                            <div className={styles.productInfo}>
                                <div className={styles.productCat}>
                                    {product.category}
                                    {product.status !== 'active' && (
                                        <span className={`${styles.statusBadge} ${product.status === 'deleted' ? styles.statusDeleted : product.status === 'new' ? styles.statusNew : product.status === 'featured' ? styles.statusFeatured : styles.statusHidden}`}>
                                            {product.status}
                                        </span>
                                    )}
                                </div>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <div className={styles.productMeta}>
                                    <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                                    <span className={`${styles.stockBadge} ${product.stock < 10 ? styles.stockLow : ''}`}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>
                            <div className={styles.productActions}>
                                <button className={styles.btnIcon} onClick={() => openModal(product)}>
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={`${styles.btnIcon} ${styles.btnIconDelete}`}
                                    onClick={() => handleDelete(product.id, product.status === 'deleted')}
                                    title={product.status === 'deleted' ? "Delete Permanently" : "Delete"}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} style={{ opacity: 1, pointerEvents: 'all' }}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className={styles.closeModal} onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.formControl}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={styles.formControl}>
                                        <option className="bg-[#0f172a] text-white" value="Men">Men</option>
                                        <option className="bg-[#0f172a] text-white" value="Women">Women</option>
                                        <option className="bg-[#0f172a] text-white" value="Kids">Kids</option>
                                        <option className="bg-[#0f172a] text-white" value="Home Textile">Home Textile</option>
                                        <option className="bg-[#0f172a] text-white" value="Wholesale / B2B">Wholesale / B2B</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Type</label>
                                    <input name="type" value={formData.type} onChange={handleChange} className={styles.formControl} list="typeList" />
                                    <datalist id="typeList">
                                        <option value="Shirt" />
                                        <option value="Pants" />
                                        <option value="Dress" />
                                        <option value="Jacket" />
                                    </datalist>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.formControl} step="0.01" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={styles.formControl} required />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className={styles.formControl}>
                                    <option className="bg-[#0f172a] text-white" value="active">Active</option>
                                    <option className="bg-[#0f172a] text-white" value="new">New Arrival</option>
                                    <option className="bg-[#0f172a] text-white" value="featured">Featured</option>
                                    <option className="bg-[#0f172a] text-white" value="hidden">Hidden</option>
                                    <option className="bg-[#0f172a] text-white" value="deleted">Deleted</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Images (Comma or Newline-separated URLs or Upload)</label>
                                <input type="file" onChange={handleImageUpload} className={styles.formControl} accept="image/*" style={{ marginBottom: '10px' }} />
                                <textarea name="imagesText" value={formData.imagesText} onChange={handleChange} className={styles.formControl} placeholder="https://...,&#10;https://..." rows={3} />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                                    {formData.imagesText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map((img, i) => (
                                        <img key={i} src={img} alt={`Preview ${i}`} style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className={styles.formControl} rows={3} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Material & Care</label>
                                <textarea name="material" value={formData.material} onChange={handleChange} className={styles.formControl} rows={2} placeholder="e.g. 100% Cotton. Machine wash cold." />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Available Sizes</label>
                                <div className={styles.checkboxGroup}>
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <label key={size} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                value={size}
                                                checked={formData.sizes.includes(size)}
                                                onChange={handleCheckboxChange}
                                            />
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
