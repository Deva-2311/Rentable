import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | RENTABLE',
  description: 'Complete your rental request securely on RENTABLE.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
