import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema({
    hero: {
        tagline: { type: String, default: 'The New Standard' },
        mainTitle: { type: String, default: 'ELEVATED' },
        subTitle: { type: String, default: 'Everyday Wear' },
        description: { type: String, default: 'Premium fabrics. Uncompromising design. Redefining your wardrobe with essentials built for the modern lifestyle.' },
        bgImg: { type: String, default: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
        buttonText: { type: String, default: 'Explore Collection' },
        buttonHref: { type: String, default: '/shop' },
    }
}, { timestamps: true });

if (mongoose.models.Homepage) {
    delete mongoose.models.Homepage;
}
export const Homepage = mongoose.model('Homepage', homepageSchema);
