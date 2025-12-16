import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useAxios from "../../Hook/useAxios";

export default function PaymentForm({ service, availableDays, className }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const paymentMutation = useAxios("post", "/payments", {}, {
    onSuccess: () => {
      reset();
      alert("✅ Payment Successful!");
    },
  });

  // Function to check if day is available
  const isDayAvailable = (date) => {
    // availableDays is array of strings: e.g. ['2025-12-16', '2025-12-18']
    const dateStr = date.toISOString().slice(0, 10);
    return availableDays.includes(dateStr);
  };

  const onSubmit = (data) => {
    const paymentData = {
      serviceId: service._id,
      serviceName: service.name,
      amount: service.price,
      customerName: data.name,
      customerEmail: data.email,
      phone: data.phone,
      paymentMethod: data.method,
      bookingDate: data.bookingDate, // send booking date to backend
    };

    paymentMutation.mutate(paymentData);
  };

  return (
    <div className={className}>

      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="text-2xl font-semibold mb-4">Payment & Booking</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                className="input input-bordered w-full"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone</label>
              <input
                className="input input-bordered w-full"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && <p className="text-error text-sm">{errors.phone.message}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="label">Payment Method</label>
              <select
                className="select select-bordered w-full"
                {...register("method", { required: "Select a payment method" })}
              >
                <option value="">Choose one</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Card</option>
              </select>
              {errors.method && <p className="text-error text-sm">{errors.method.message}</p>}
            </div>

            {/* Booking Date (Calendar) */}
            <div>
              <label className="label">Select Booking Date</label>
              <Controller
                control={control}
                name="bookingDate"
                rules={{ required: "Booking date is required" }}
                render={({ field }) => (
                  <DayPicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => !isDayAvailable(date)}
                    modifiers={{
                      available: (date) => isDayAvailable(date),
                    }}
                    modifiersClassNames={{
                      available: "bg-green-300 rounded-full",
                    }}
                    fromDate={new Date()}
                  />
                )}
              />
              {errors.bookingDate && (
                <p className="text-error text-sm">{errors.bookingDate.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="label">Amount</label>
              <input
                readOnly
                value={`৳${service.price}`}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={paymentMutation.isLoading || isSubmitting}
            >
              {paymentMutation.isLoading ? "Processing..." : "Pay & Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
