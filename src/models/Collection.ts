import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    img: { type: String, required: true },
    href: { type: String, required: true },
    className: { type: String, required: true },
    imgClass: { type: String, default: 'object-cover' },
    imgPosition: { type: String, default: 'object-center' },
    imgScale: { type: Number, default: 100 },
    order: { type: Number, default: 0 },
}, { timestamps: true });

if (mongoose.models.Collection) {
    delete mongoose.models.Collection;
}
export const Collection = mongoose.model('Collection', collectionSchema);
