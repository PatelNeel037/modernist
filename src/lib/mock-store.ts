import fs from 'fs';
import path from 'path';
import { allProducts as initialProducts, Product } from '@/data/products';

// JSON File Persistence
const DB_FILE = path.join(process.cwd(), 'src', 'data', 'mock_db.json');

interface Schema {
    users: any[];
    orders: any[];
    products: any[];
}

// Ensure the directory exists
function ensureDB() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
        const initialData: Schema = {
            users: [
                {
                    id: 100,
                    name: 'Admin User',
                    email: 'admin@modernist.com',
                    password: 'password',
                    role: 'admin',
                    createdAt: new Date('2023-01-01').toISOString()
                }
            ],
            orders: [],
            products: initialProducts.map(p => ({
                ...p,
                stock: Math.floor(Math.random() * 50) + 5,
                status: (p.status || 'active')
            }))
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Helpers
function readDB(): Schema {
    ensureDB();
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.orders)) {
            // If schema is invalid, re-initialize or return empty
            // Better to re-initialize if empty/corrupted? 
            // For now just return empty safe object to avoid crashes
            return { users: [], orders: [], products: [] };
        }
        return parsed;
    } catch (e) {
        console.error("DB Read Error", e);
        return { users: [], orders: [], products: [] };
    }
}

function writeDB(data: Schema) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("DB Write Error", e);
    }
}

// --- Stores ---

export const MockUserStore = {
    getAll: () => readDB().users,

    findByEmail: (email: string) => {
        return readDB().users.find(u => u.email === email);
    },

    create: (user: any) => {
        const db = readDB();
        const newUser = { ...user, id: Date.now(), createdAt: new Date().toISOString() };
        db.users.push(newUser);
        writeDB(db);
        return newUser;
    },

    validateCredentials: (email: string, password: string) => {
        const users = readDB().users;
        return users.find(u => u.email === email && u.password === password);
    },

    update: (email: string, updates: any) => {
        const db = readDB();
        const index = db.users.findIndex(u => u.email === email);
        if (index !== -1) {
            db.users[index] = { ...db.users[index], ...updates };
            writeDB(db);
            return db.users[index];
        }
        return null;
    },

    changePassword: (email: string, current: string, newPass: string) => {
        const db = readDB();
        const userIndex = db.users.findIndex(u => u.email === email && u.password === current);

        if (userIndex !== -1) {
            db.users[userIndex].password = newPass;
            writeDB(db);
            return true;
        }
        return false;
    },

    toggleBlockStatus: (email: string, isBlocked: boolean) => {
        const db = readDB();
        const userIndex = db.users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            db.users[userIndex].isBlocked = isBlocked;
            writeDB(db);
            return true;
        }
        return false;
    }
};

export const MockOrderStore = {
    getAll: () => readDB().orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

    getById: (id: string) => readDB().orders.find(o => o.id === id),

    create: (order: any) => {
        const db = readDB();

        // 1. Look up user by ID to get their name
        const user = order.userId ? db.users.find(u => u.id === order.userId) : null;

        const newOrder = {
            ...order,
            id: `ORD-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'Pending',
            // 2. Attach user info so Admin Panel can display it instead of "Guest"
            user: user ? { name: user.name, email: user.email } : null
        };
        db.orders.push(newOrder);
        writeDB(db);
        return newOrder;
    },

    update: (id: string, updates: any) => {
        const db = readDB();
        const orderIndex = db.orders.findIndex(o => o.id === id);
        if (orderIndex !== -1) {
            db.orders[orderIndex] = { ...db.orders[orderIndex], ...updates };
            writeDB(db);
            return db.orders[orderIndex];
        }
        return null;
    },

    getStats: () => {
        const db = readDB();
        const orders = db.orders;
        const products = db.products;

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        const pending = orders.filter(o => o.status === 'Pending').length;
        const processing = orders.filter(o => o.status === 'Processing').length;
        const shipped = orders.filter(o => o.status === 'Shipped').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const cancelled = orders.filter(o => o.status === 'Cancelled').length;

        const today = new Date().toISOString().split('T')[0];
        const revenueToday = orders
            .filter(o => o.createdAt.startsWith(today))
            .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

        // Low Stock Logic
        const lowStock = products.filter(p => (p as any).stock < 10);

        return {
            revenue: {
                total: totalRevenue,
                today: revenueToday,
                month: totalRevenue
            },
            customers: db.users.filter(u => u.role !== 'admin').length,
            orders: {
                Pending: pending,
                Processing: processing,
                Shipped: shipped,
                Delivered: delivered,
                Cancelled: cancelled
            },
            lowStock: lowStock.slice(0, 5),
            topSelling: []
        };
    }
};

export const MockProductStore = {
    getAll: () => readDB().products,

    getAllAdmin: () => readDB().products,

    getById: (id: number) => readDB().products.find(p => p.id === id),

    create: (product: any) => {
        const db = readDB();
        const newProduct = {
            ...product, // status, stock, etc.
            id: Date.now(), // Generate ID
            rating: 0,
            reviews: 0,
            images: product.image ? [product.image] : [] // Adapt single image input to array
        };
        db.products.push(newProduct);
        writeDB(db);
        return newProduct;
    },

    update: (id: number, updates: any) => {
        const db = readDB();
        const index = db.products.findIndex(p => p.id === Number(id));
        if (index === -1) return null;

        // Handle Image adapter
        const updatedProduct = {
            ...db.products[index],
            ...updates,
            images: updates.image ? [updates.image] : db.products[index].images
        };
        db.products[index] = updatedProduct;
        writeDB(db);
        return updatedProduct;
    },

    delete: (id: number) => {
        const db = readDB();
        const index = db.products.findIndex(p => p.id === Number(id));
        if (index === -1) return false;

        // Soft delete or Hard delete? User requested Soft delete in UI, but let's do soft.
        // Actually UI says "Soft Delete" but calls API DELETE.
        // Let's implement soft delete by setting status = 'deleted'
        db.products[index].status = 'deleted';
        writeDB(db);
        return true;
    }
};
