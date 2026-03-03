import type { Metadata } from 'next';
import { Playfair_Display, Roboto } from 'next/font/google';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SmoothScroll } from '@/components/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Preloader from '@/components/ui/Preloader';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | MODERNIST',
    default: 'MODERNIST | Redefining Everyday Fashion',
  },
  description: 'Discover premium fabrics for the modern lifestyle. Shop our exclusive collection of minimalist, timeless fashion for both men and women.',
  keywords: ['fashion', 'modernist', 'clothing', 'minimalist style', 'premium fabrics', 'streetwear', 'online boutique'],
  openGraph: {
    title: 'MODERNIST | Redefining Everyday Fashion',
    description: 'Discover premium fabrics for the modern lifestyle. Shop our exclusive collection.',
    url: 'https://modernist.com',
    siteName: 'MODERNIST',
    images: [
      {
        url: '/hero-image.jpg', // Assuming you have a default hero image in public
        width: 1200,
        height: 630,
        alt: 'MODERNIST Fashion Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MODERNIST | Redefining Everyday Fashion',
    description: 'Discover premium fabrics for the modern lifestyle. Shop our exclusive collection.',
    images: ['/hero-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="antialiased">
        <Preloader />
        <CustomCursor />
        <SmoothScroll>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <WishlistProvider>
                  <CartProvider>
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#331C08',
                          color: '#fff',
                          padding: '16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                        },
                        success: {
                          iconTheme: {
                            primary: '#4ade80',
                            secondary: '#331C08',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: '#ef4444',
                            secondary: '#331C08',
                          },
                        },
                      }}
                    />
                    {children}
                  </CartProvider>
                </WishlistProvider>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
