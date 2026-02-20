import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Read old mock database
        const filePath = path.join(process.cwd(), 'src', 'data', 'mock_db.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: 'No mock data found to seed.' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const mockData = JSON.parse(fileContent);

        let productsSeeded = 0;
        let usersSeeded = 0;

        // Seed Products if empty
        const productCount = await Product.countDocuments();
        if (productCount === 0 && mockData.products && mockData.products.length > 0) {
            // Adapt mock products to mongoose schema
            const productsToInsert = mockData.products.map((p: any) => {
                const { id, ...rest } = p; // Remove numerical id
                return rest;
            });
            await Product.insertMany(productsToInsert);
            productsSeeded = productsToInsert.length;
        }

        // Seed Users if empty
        const userCount = await User.countDocuments();
        if (userCount === 0 && mockData.users && mockData.users.length > 0) {
            const usersToInsert = await Promise.all(mockData.users.map(async (u: any) => {
                const { id, password, ...rest } = u;
                // Secure the mock passwords by hashing them for real DB
                const hashedPassword = await bcrypt.hash(password || 'password123', 10);
                return {
                    ...rest,
                    password: hashedPassword
                };
            }));
            await User.insertMany(usersToInsert);
            usersSeeded = usersToInsert.length;
        }

        return NextResponse.json({
            success: true,
            message: 'Database connection verified!',
            details: `Seeded ${productsSeeded} products and ${usersSeeded} users from mock data.`
        });

    } catch (e) {
        console.error("Seeding Error:", e);
        return NextResponse.json({ success: false, message: 'Failed to connect or seed database', error: String(e) }, { status: 500 });
    }
}
