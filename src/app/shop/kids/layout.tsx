import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Kids' Clothing & Fashion",
    description: 'Shop comfortable and durable clothing for kids. Modern styles for the little ones.',
    keywords: ['kids fashion', 'kids clothing', 'modern kids'],
    openGraph: {
        title: "Kids' Clothing & Fashion | MODERNIST",
        description: "Shop comfortable and durable clothing for kids.",
        url: 'https://modernist.com/shop/kids',
        images: ['/category-kids.jpg'],
    }
};

export default function KidsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
