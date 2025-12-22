// components/PaymentSuccessPage.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, amount, serviceName } = location.state || {};

  useEffect(() => {
    if (!paymentId) {
      navigate('/');
    }
  }, [paymentId, navigate]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>

            {/* Order Details */}
            {paymentId && (
              <div className="bg-base-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-lg mb-3">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{paymentId}</span>
                  </div>
                  {serviceName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{serviceName}</span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${(amount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">What's Next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  You will receive a confirmation email shortly
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  Our team will contact you to schedule the service
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></span>
                  You can track your booking in your dashboard
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/dashboard/bookings" className="btn btn-primary w-full">
                View My Bookings
              </Link>
              <Link to="/services" className="btn btn-outline w-full">
                Browse More Services
              </Link>
              <button
                onClick={() => navigate('/')}
                className="btn btn-ghost w-full"
              >
                Back to Home
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@styledecor.com" className="text-primary hover:underline">
                  support@styledecor.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;