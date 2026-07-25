import { useState } from 'react';
import api from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCheckout = async (amount: number, metadata: any = {}) => {
    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load Razorpay checkout (check adblocker).');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Create order on backend
      const order: any = await api.post('/payments/create-order', {
        amount,
        currency: 'INR',
        receiptId: metadata.receiptId || `receipt_${Date.now()}`,
      });

      // 2. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SoVyCbeWSJWBW1',
        amount: order.amount,
        currency: order.currency,
        name: 'Airion (Ease2event)',
        description: metadata.description || 'Event Booking Payment',
        image: '/logo.svg',
        order_id: order.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            // 3. Verify payment on backend
            const verification: any = await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verification.success || verification === true) {
              toast.success('Payment successful!');
              if (metadata.onSuccess) metadata.onSuccess(response);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification Error:', error);
            toast.error('Failed to verify payment');
          }
        },
        prefill: {
          name: metadata.userName || '',
          email: metadata.userEmail || '',
          contact: metadata.userPhone || '',
        },
        theme: {
          color: '#ef4444', // red-500
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (metadata.onCancel) metadata.onCancel();
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description);
        if (metadata.onError) metadata.onError(response.error);
      });

      rzp.open();
    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
};
