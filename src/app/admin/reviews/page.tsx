'use client';
import { useState, useEffect } from 'react';
import styles from './reviews.module.css';
import { RefreshCw, Check, X, Trash2, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface Review {
    _id: string;
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    userName: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function AdminReviewsPage() {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    async function loadReviews() {
        setLoading(true);
        try {
            const token = localStorage.getItem('modernist_admin_token');
            const response = await fetch('/api/admin/reviews', {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAllReviews(data);
                setFilteredReviews(data);
            }
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReviews();
    }, []);

    // Apply Filters whenever inputs change
    useEffect(() => {
        let result = [...allReviews];

        // 1. Status Filter
        if (statusFilter) {
            result = result.filter(rev => rev.status === statusFilter);
        }

        // 2. Search Filter (Product Name, User Name, Comment)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(rev => {
                const productName = rev.product?.name?.toLowerCase() || '';
                const userName = rev.userName?.toLowerCase() || '';
                const comment = rev.comment?.toLowerCase() || '';
                
                return productName.includes(lowerSearch) || 
                       userName.includes(lowerSearch) || 
                       comment.includes(lowerSearch);
            });
        }

        setFilteredReviews(result);
    }, [statusFilter, searchTerm, allReviews]);

    const updateReviewStatus = async (id: string, newStatus: string, newRating?: number) => {
        try {
            const token = localStorage.getItem('modernist_admin_token');
            const updateData: any = { status: newStatus };
            if (newRating !== undefined) updateData.rating = newRating;

            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
                showToast(`Review updated successfully`, 'success');
                setAllReviews(prev => prev.map(rev => 
                    rev._id === id ? { ...rev, ...updateData } : rev
                ));
            } else {
                showToast('Failed to update review status', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    const deleteReview = async (id: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        
        try {
            const token = localStorage.getItem('modernist_admin_token');
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            
            if (response.ok) {
                showToast('Review deleted successfully', 'success');
                setAllReviews(prev => prev.filter(rev => rev._id !== id));
            } else {
                showToast('Failed to delete review', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    return (
        <div className={styles.reviewsContent}>
            <h2 className={styles.headerTitle}>Product Reviews Management</h2>

            {/* Filters */}
            <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                    <label>Status</label>
                    <select
                        className={styles.filterInput}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option className="bg-[#161b22] text-white" value="pending">Pending</option>
                        <option className="bg-[#161b22] text-white" value="approved">Approved</option>
                        <option className="bg-[#161b22] text-white" value="rejected">Rejected</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>Search Reviews</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={styles.filterInput}
                            placeholder="Product name, user, or comment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterGroup} style={{ flex: '0 0 auto' }}>
                    <button className={styles.btnFilter} onClick={loadReviews} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.adminTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">Loading reviews...</td>
                                </tr>
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map(review => (
                                    <tr key={review._id}>
                                        <td className="text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-gray-800 shrink-0 overflow-hidden">
                                                    {review.product?.images?.[0] ? (
                                                        <img src={review.product.images[0]} alt={review.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">N/A</div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-sm max-w-[150px] truncate" title={review.product?.name || 'Unknown Product'}>
                                                    {review.product?.name || 'Unknown Product'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-slate-300 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{review.userName}</span>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center text-yellow-500 gap-1 bg-gray-800/50 p-1.5 rounded-lg w-fit hover:bg-gray-800 transition-colors">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateReviewStatus(review._id, review.status, star);
                                                        }}
                                                        className="transition-transform hover:scale-125"
                                                        title={`Set rating to ${star}`}
                                                    >
                                                        <Star 
                                                            size={14} 
                                                            className={star <= review.rating ? 'fill-current' : 'text-slate-600'} 
                                                            strokeWidth={star <= review.rating ? 0 : 2}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-slate-300 w-1/3">
                                            <p className="line-clamp-2 text-sm" title={review.comment}>{review.comment}</p>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[`status${review.status}`]}`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                {review.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review._id, 'approved')}
                                                        className={`${styles.btnAction} ${styles.btnApprove}`}
                                                        title="Approve Review"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review._id, 'rejected')}
                                                        className={`${styles.btnAction} ${styles.btnReject}`}
                                                        title="Reject Review"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteReview(review._id)}
                                                    className={`${styles.btnAction} ${styles.btnDelete}`}
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-500 uppercase tracking-widest text-sm font-semibold">
                                        No reviews found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
