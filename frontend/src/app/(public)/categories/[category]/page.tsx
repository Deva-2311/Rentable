import { redirect } from 'next/navigation';

export default function CategoryDetailPage({ params }: { params: { category: string } }) {
  // Redirect to explore page with the category slug
  // The explore page can handle fetching or filtering by category
  redirect(`/explore`);
}
