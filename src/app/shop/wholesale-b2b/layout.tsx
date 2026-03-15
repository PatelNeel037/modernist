import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Wholesale & B2B",
    description: "Partner with MODERNIST for wholesale and B2B orders. Premium quality products available in bulk for your business.",
    keywords: ['wholesale', 'b2b', 'bulk clothing', 'apparel wholesale', 'modernist b2b'],
    openGraph: {
        title: "Wholesale & B2B | MODERNIST",
        description: "Partner with MODERNIST for wholesale and B2B orders.",
        url: 'https://modernist.com/shop/wholesale-b2b',
        images: ['/category-wholesale.jpg'],
    }
};

export default function WholesaleB2BLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
