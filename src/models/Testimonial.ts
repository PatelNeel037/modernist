import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    avatar: { type: String },
    date: { type: String }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
