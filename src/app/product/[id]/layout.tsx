import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { ReactNode } from 'react';

// Next.js dynamic metadata generation
export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { id } = params;

    try {
        await connectDB();
        const product = await Product.findById(id);

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The requested product could not be found.',
            };
        }

        const title = product.name;
        // Basic fallback for description
        const description = product.description || `Buy ${product.name} at Modernist. Premium quality ${product.category}.`;
        const imageUrl = product.images?.[0] || '/hero-image.jpg';
        const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

        return {
            title,
            description,
            openGraph: {
                title: `${title} - $${price} | MODERNIST`,
                description,
                images: [
                    {
                        url: imageUrl,
                        width: 800,
                        height: 1000,
                        alt: title,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} | MODERNIST`,
                description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: 'Product',
        };
    }
}

export default function ProductLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
