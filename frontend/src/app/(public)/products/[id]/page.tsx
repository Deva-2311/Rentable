import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // Fetch product details for metadata
    const response = await fetch(`${baseUrl}/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) throw new Error('Failed to fetch product');
    
    const { data: product } = await response.json();
    const coverImage = product.images?.[0] || 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80';

    return {
      title: product.name,
      description: product.description.substring(0, 160),
      openGraph: {
        title: `${product.name} | RENTABLE`,
        description: product.description.substring(0, 160),
        images: [{ url: coverImage, width: 1200, height: 630, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description.substring(0, 160),
        images: [coverImage],
      }
    };
  } catch (error) {
    return {
      title: 'Product Details',
      description: 'View premium product rental details on RENTABLE.',
    };
  }
}

export default function ProductPage() {
  return <ProductDetailClient />;
}
