import { Metadata } from 'next';
import { CategoryClient } from './CategoryClient';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function formatCategoryName(slug?: string | null): string {
  if (!slug || typeof slug !== 'string') {
    return 'Products';
  }
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.category || '';
  const name = formatCategoryName(slug);

  return {
    title: `${name} Equipment Rentals | RENTABLE`,
    description: `Browse and rent verified ${name.toLowerCase()} assets from trusted local owners on RENTABLE. Insured with escrow protection.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams?.category ?? '';

  return <CategoryClient categorySlug={categorySlug} />;
}

