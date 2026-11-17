import { Metadata } from 'next';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore Products',
  description: 'Browse our extensive catalog of rental products. Filter by category, location, and price.',
  openGraph: {
    title: 'Explore Products | RENTABLE',
    description: 'Browse our extensive catalog of rental products. Filter by category, location, and price.',
  },
};

export default function ExplorePage() {
  return <ExploreClient />;
}
