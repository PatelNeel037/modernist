import mongoose from 'mongoose';

const InstagramPostSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    link: { type: String, default: '#' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.InstagramPost || mongoose.model('InstagramPost', InstagramPostSchema);
