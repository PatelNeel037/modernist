import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    material: { type: String },
    sizes: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    status: { type: String, default: "active", enum: ["active", "hidden", "deleted", "new", "featured", "bestseller"] },
    sale: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
