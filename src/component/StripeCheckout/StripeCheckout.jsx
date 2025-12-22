// components/StripeCheckoutPage.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router';
import useAxios from '../../Hook/useAxios';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, metadata, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPaymentIntent = useAxios('post', '/create-payment-intent');
  const updatePaymentStatus = useAxios('patch', '/payments');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }

      // Create payment intent on your server
      const intentResult = await createPaymentIntent.mutateAsync({
        amount: amount,
        currency: 'usd',
        metadata: {
          ...metadata,
          customerEmail: metadata.customerEmail,
          serviceId: metadata.paymentId
        }
      });

      if (!intentResult.success) {
        throw new Error(intentResult.message || 'Failed to create payment intent');
      }
      console.log(metadata);
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: intentResult.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: metadata.customerName,
              email: metadata.customerEmail,
              phone: metadata.phone,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Update payment status in your database
        await updatePaymentStatus.mutateAsync({
          url: `/payments/${metadata.serviceId}/status-to-paid`,
          data: {
            stripePaymentId: paymentIntent.id,
            paymentMethod: 'stripe_card'
          }
        });

        // Navigate to success page
        navigate('/payment-success', {
          state: {
            paymentId: metadata.paymentId,
            amount: amount,
            serviceName: metadata.serviceName
          }
        });
      } else {
        setErrorMessage(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline flex-1"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary flex-1"
        >
          {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const StripeCheckoutPage = () => {
  const location = useLocation();
  const { paymentData } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!paymentData) {
      navigate('/'); // Redirect if no payment data
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Complete Your Payment</h2>
                <p className="text-gray-600">Pay securely with Stripe</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-base-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{paymentData.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${(paymentData.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{paymentData.customerName}</span>
                </div>
              </div>
            </div>

            {/* Stripe Checkout Form */}
            <Elements
              stripe={stripePromise}
              options={{
                mode: 'payment',
                amount: paymentData.amount,
                currency: 'usd',
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#4f46e5',
                  },
                },
              }}
            >
              <CheckoutForm
                amount={paymentData.amount}
                metadata={paymentData}
                onClose={() => navigate(-1)}
              />
            </Elements>

            <div className="mt-6 text-sm text-gray-500">
              <p className="text-center">
                Your payment is secure and encrypted. We use Stripe to process your payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutPage;