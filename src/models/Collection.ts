import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    img: { type: String, required: true },
    href: { type: String, required: true },
    className: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Collection = mongoose.models?.Collection || mongoose.model('Collection', collectionSchema);
