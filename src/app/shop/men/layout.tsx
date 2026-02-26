import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Men's Clothing & Fashion",
    description: 'Shop the latest men\'s clothing and accessories. Explore our minimalist, premium fabrics designed for the modern-day man.',
    keywords: ['men fashion', 'men clothing', 'minimalist men', 'modernist men'],
    openGraph: {
        title: "Men's Clothing & Fashion | MODERNIST",
        description: "Shop the latest men's clothing and accessories.",
        url: 'https://modernist.com/shop/men',
        images: ['/hero-image.jpg'],
    }
};

export default function MenLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
