import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/modernist";

export async function connectDB() {
    if (mongoose.connections[0].readyState) {
        return true;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return false;
    }
}
