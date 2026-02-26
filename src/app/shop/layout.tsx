import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Shop All Collections",
    description: 'Browse the full collection of modern, minimalist clothing for men and women at MODERNIST. Premium fabrics, timeless styles.',
    keywords: ['shop fashion', 'buy clothes online', 'minimalist fashion', 'modernist apparel'],
    openGraph: {
        title: "Shop All Collections | MODERNIST",
        description: "Browse the full collection of modern, minimalist clothing.",
        url: 'https://modernist.com/shop',
        images: ['/shop-hero.jpg'],
    }
};

export default function ShopLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
