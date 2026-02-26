import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Women's Clothing & Fashion",
    description: 'Discover beautiful, timeless styles in our women\'s collection. Premium quality dresses, tops, outerwear, and accessories.',
    keywords: ['women fashion', 'women clothing', 'minimalist women', 'modernist women', 'dresses'],
    openGraph: {
        title: "Women's Clothing & Fashion | MODERNIST",
        description: "Discover beautiful, timeless styles in our women's collection.",
        url: 'https://modernist.com/shop/women',
        images: ['/category-women.jpg'],
    }
};

export default function WomenLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
