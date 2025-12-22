import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useAxios from "../../Hook/useAxios";
import useAuth from "../../Hook/useAuth";

export default function PaymentForm({
  service,
  availableDays = [],
  className = "",
  onSuccess,
  onClose,
}) {
  const { user } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      method: "",
      bookingDate: null,
    },
  });

  const paymentMutation = useAxios("post", "/payments", {}, {
    onSuccess: (res) => {
      reset();
      alert("Payment & Booking Successful!");
      if (onSuccess) onSuccess(res);
    },
    onError: (err) => {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    },
  });

  // Helper: Check if date is in availableDays (array of "YYYY-MM-DD" strings)
  const isDayAvailable = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().slice(0, 10);
    return availableDays.includes(dateStr);
  };

  const onSubmit = (data) => {
    // Safety check — service must exist
    if (!service?._id) {
      alert("Service information is missing. Please refresh and try again.");
      console.error("Service object:", service);
      return;
    }

    const bookingDateStr = data.bookingDate
      ? data.bookingDate.toISOString().slice(0, 10)
      : null;

    const paymentData = {
      serviceId: String(service._id), // Ensure it's a string
      serviceName: service.service_name || service.name || "Unknown Service",
      amount: Number(service.cost || service.price || 0),
      customerName: data.name.trim(),
      customerEmail: data.email.trim(),
      phone: data.phone.trim(),
      paymentMethod: data.method,
      bookingDate: bookingDateStr,
      progress: 0,
      status: "unpaid", // Better to set on frontend too (backend can override)
    };

    console.log("Sending payment data:", paymentData); // Debug!

    paymentMutation.mutateAsync(paymentData);
  };

  return (
    <div className={className}>
      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Payment & Booking</h2>
            {onClose && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                defaultValue={user?.email || ""}
                readOnly={!!user?.email} // Optional: prevent edit if logged in
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="01XXXXXXXXX"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "Invalid Bangladeshi mobile number",
                  },
                })}
              />
              {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Payment Method</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("method", { required: "Please select a payment method" })}
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="card">Credit/Debit Card</option>
              </select>
              {errors.method && <p className="text-error text-sm mt-1">{errors.method.message}</p>}
            </div>

            {/* Booking Date Picker */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Select Booking Date</span>
              </label>
              <Controller
                control={control}
                name="bookingDate"
                rules={{ required: "Please select a booking date" }}
                render={({ field }) => (
                  <DayPicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromDate={new Date()} // blocks past dates
                    disabled={(date) => {
                      if (!date) return true;
                      const dateStr = date.toISOString().slice(0, 10);
                      return !availableDays.includes(dateStr);
                    }}
                    modifiers={{
                      available: availableDays.map((dayStr) => {
                        // Create Date representing midnight UTC for that day
                        // This avoids timezone shift
                        const [year, month, day] = dayStr.split('-').map(Number);
                        return new Date(Date.UTC(year, month - 1, day + 1));
                      }),
                    }}
                    modifiersClassNames={{
                      available: "bg-green-400 text-white font-bold rounded-full hover:bg-green-500",
                    }}
                    className="border rounded-lg p-4 bg-white shadow"
                  />
                )}
              />
              {errors.bookingDate && (
                <p className="text-error text-sm mt-1">{errors.bookingDate.message}</p>
              )}
            </div>

            {/* Amount (Read-only) */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Total Amount</span>
              </label>
              <input
                readOnly
                value={`৳ ${(service.cost || service.price || 0).toLocaleString()}`}
                className="input input-bordered w-full bg-base-200 font-semibold"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={paymentMutation.isPending || isSubmitting}
              className="btn btn-primary w-full text-lg"
            >
              {paymentMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>Pay & Book Now</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}