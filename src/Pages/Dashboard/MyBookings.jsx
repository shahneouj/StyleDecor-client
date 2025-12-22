import { useState } from "react";
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";
import { useForm } from 'react-hook-form'
const MyBookings = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selectedBooking, setSelectedBooking] = useState(null);
  // Fetch bookings of this user
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAxios("get", `/payments/unpaid`);
  const bookings = data?.data || []

  // Cancel booking mutation
  const cancelBooking = useAxios("delete", "", {}, {
    invalidateQueries: ["/bookings"],
    onSuccess: () => alert("Booking cancelled"),
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
      cancelBooking.mutate({
        url: `/bookings/${id}`,
      });
    }
  };

  const onSubmitUpdate = (data) => {
    updateBooking.mutate({
      url: `/bookings/${id}`,
      data: {
        date: newDate,
        status: "rescheduled",
      },
    });

    document.getElementById("update_modal").close();
  };

  if (isLoading) return <div className="p-4">Loading bookings...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">Failed to load bookings</div>
    );

  if (!bookings || bookings.length === 0)
    return <div className="p-4">No bookings found.</div>;

  return (
    <>
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
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status || "pending"}
                </p>
                <p>
                  <strong>Price:</strong> {booking.amount?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="space-x-2 mt-4 md:mt-0">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setSelectedBooking(booking);
                    reset({
                      bookingDate: booking.bookingDate,
                      status: booking.status || "rescheduled",
                    });
                    document.getElementById("update_modal").showModal();
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleCancel(booking.serviceId)}
                  disabled={cancelBooking.isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <dialog id="update_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Booking</h3>

          <form onSubmit={handleSubmit(onSubmitUpdate)}>
            {/* Date */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Booking Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                {...register("bookingDate", { required: "Date is required" })}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.bookingDate && (
                <p className="text-error text-sm mt-1">
                  {errors.bookingDate.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                {...register("status")}
              >
                <option value="rescheduled">Rescheduled</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateBooking.isPending}
              >
                Save Changes
              </button>

              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("update_modal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

    </>
  );
};

export default MyBookings;
