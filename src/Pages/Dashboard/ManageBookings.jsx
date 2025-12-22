import React from 'react';
import useAxios from '../../Hook/useAxios'; // Adjust path as needed

const ManageBookings = () => {
  // Fetch all unpaid/in-progress bookings
  const { data, isLoading, error } = useAxios('get', '/payments/unpaid', {}, {
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  const bookings = data?.data || [];

  // Mutation: Assign decorator
  const assignMutation = useAxios('patch', '', {}, {
    invalidateQueries: ['/api/payments/unpaid'],
    onSuccess: () => alert('Decorator assigned successfully!'),
    onError: () => alert('Failed to assign decorator'),
  });

  // Mutation: Mark as paid
  const paidMutation = useAxios('patch', '', {}, {
    invalidateQueries: ['/api/payments/unpaid'],
    onSuccess: () => alert('Payment marked as paid!'),
    onError: () => alert('Failed to update payment status'),
  });

  const handleAssignDecorator = (bookingId, decoratorId) => {
    assignMutation.mutate({
      url: `/api/payments/${bookingId}/assign`,
      data: { decoratorId, decoratorName: "Sample Decorator" }, // adjust as needed
    });
  };

  const handleMarkPaid = (bookingId) => {
    paidMutation.mutate({
      url: `/api/payments/${bookingId}/paid`,
    });
  };

  // Native date formatter (beautiful and locale-aware)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
    // Output example: "18 Dec 2025"
  };

  // Alternative simple fallback (if you want even lighter)
  // const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error loading bookings: {error.message || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold">Manage Bookings</h3>
          <p className="text-gray-600 mt-2">
            Approve/assign decorators & update payment status for unpaid bookings.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decorator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No unpaid or in-progress bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.serviceName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ৳{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{booking.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'unpaid' || booking.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.assignedDecorator ? (
                        <div>
                          <div>{booking.assignedDecorator.name}</div>
                          <div className="text-xs text-gray-500">{booking.assignedDecorator.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <select
                        disabled={!!booking.assignedDecorator || assignMutation.isPending}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignDecorator(booking._id, e.target.value);
                            e.target.value = ''; // reset select
                          }
                        }}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm disabled:opacity-50"
                      >
                        <option value="">Assign Decorator</option>
                        {/* Replace these with real data later */}
                        <option value="dec1">Rahim Decor</option>
                        <option value="dec2">Karim Events</option>
                        <option value="dec3">Salam Lights</option>
                      </select>

                      <button
                        onClick={() => handleMarkPaid(booking._id)}
                        disabled={paidMutation.isPending}
                        className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        {paidMutation.isPending ? 'Saving...' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;