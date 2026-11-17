import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreatePaymentOrder, useVerifyPayment } from '@/features/payments/api/usePayments';
import { toast } from 'react-hot-toast';
import { CreditCard } from 'lucide-react';
import { useRazorpay } from 'react-razorpay';
import { useAuth } from '@/lib/auth/AuthContext';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
}

export function PaymentButton({ bookingId, amount }: PaymentButtonProps) {
  const { Razorpay } = useRazorpay();
  const { user } = useAuth();
  const { mutateAsync: createOrder, isPending: isCreating } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const res = await createOrder({ bookingId });
      const orderData = res?.data || res;

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 2. Seamless Demo Mode: If Razorpay is not configured or backend generated demo order
      if (!razorpayKey || orderData.isDemoMode) {
        await verifyPayment({
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: `pay_demo_${Date.now()}`,
          razorpaySignature: 'demo_signature',
        });
        toast.success('Payment completed successfully! Rental is now active.');
        return;
      }

      // 3. Live Razorpay SDK checkout if key is configured
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RENTABLE',
        description: 'Rental Payment',
        order_id: orderData.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful! Rental is now active.');
          } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#647A67', // Enchanted Forest Whimsy primary color
        },
      };

      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', function (response: { error: { description: string } }) {
        toast.error('Payment failed: ' + response.error.description);
      });
      
      rzp.open();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isCreating || isVerifying || isProcessing}
      className="w-full sm:w-auto"
    >
      <CreditCard className="h-4 w-4 mr-2" />
      {isCreating || isVerifying || isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
    </Button>
  );
}
