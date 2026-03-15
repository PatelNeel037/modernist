import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Home Textile",
    description: "Discover beautiful, modern, and high-quality home textile products. Elevate your living spaces with our premium collection.",
    keywords: ['home textile', 'bedding', 'towels', 'rugs', 'decor'],
    openGraph: {
        title: "Home Textile | MODERNIST",
        description: "Discover beautiful, modern, and high-quality home textile products.",
        url: 'https://modernist.com/shop/home-textile',
        images: ['/category-hometextile.jpg'],
    }
};

export default function HomeTextileLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
