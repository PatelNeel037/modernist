'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './admin-login.module.css';
import { DB } from '@/services/db';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, logout } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Attempt login
            const result = await login(email, password);

            if (result.success) {
                // Check role explicitly
                const currentUser = DB.getCurrentUser();

                if (currentUser && currentUser.role === 'admin') {
                    // Success
                    router.push('/admin');
                } else {
                    // Login successful but NOT admin
                    logout(); // Logout immediately
                    setError('Access Denied: You do not have admin privileges.');
                    setLoading(false);
                }
            } else {
                setError(result.message || 'Invalid email or password.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className={styles.loginContainer}>
                <div className={styles.adminLogo}>MODERNIST ADMIN</div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@modernist.com"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="password"
                        />
                    </div>
                    <button type="submit" className={styles.btnLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                    {error && <p className={styles.errorMsg}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
