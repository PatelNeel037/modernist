import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isActive: { type: Boolean, default: true },
    addresses: [{
        id: String,
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        isDefault: Boolean,
        type: String
    }],
    notifications: {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        newArrivals: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    theme: { type: String, default: 'light', enum: ['light', 'dark'] }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
