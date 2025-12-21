import { useState } from "react";
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";

const MyBookings = () => {
  const { user } = useAuth();

  // Fetch bookings of this user
  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
  } = useAxios("get", `/bookings?userEmail=${user?.email}`);

  // Cancel booking mutation
  const cancelBooking = useAxios("delete", "", {}, {
    onSuccess: () => {
      alert("Booking cancelled");
      refetch();
    },
    onError: () => alert("Failed to cancel booking"),
  });

  // Update booking mutation (example: update status to "rescheduled")
  const updateBooking = useAxios("patch", "", {}, {
    onSuccess: () => {
      alert("Booking updated");
      refetch();
    },
    onError: () => alert("Failed to update booking"),
  });

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking.mutate(`/bookings/${id}`);
    }
  };

  const handleUpdate = (id) => {
    // Example update: just toggling status for demo
    const newStatus = "rescheduled";
    updateBooking.mutate({
      url: `/bookings/${id}`,
      data: { status: newStatus },
    });
  };

  if (isLoading) return <div className="p-4">Loading bookings...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">Failed to load bookings</div>
    );

  if (!bookings || bookings.length === 0)
    return <div className="p-4">No bookings found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="card bg-base-100 shadow-md p-4 flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <p>
                <strong>Service:</strong> {booking.serviceName}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status || "pending"}
              </p>
              <p>
                <strong>Price:</strong> ${booking.price?.toFixed(2) || "N/A"}
              </p>
            </div>
            <div className="space-x-2 mt-4 md:mt-0">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleUpdate(booking._id)}
                disabled={updateBooking.isPending}
              >
                Update
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleCancel(booking._id)}
                disabled={cancelBooking.isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
