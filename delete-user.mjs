import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function deleteTestUser() {
    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        const result = await db.collection('users').deleteOne({ email: 'patelronit644@gmail.com' });
        console.log(`Deleted ${result.deletedCount} user(s) with email patelronit644@gmail.com`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

deleteTestUser();
