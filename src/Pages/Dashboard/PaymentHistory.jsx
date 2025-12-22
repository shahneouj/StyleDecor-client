import { Navigate, useNavigate } from "react-router";
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";

const PaymentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
  } = useAxios("get", `/payments/user`);
  const payments = data?.data || []
  if (isLoading) return <div className="p-4">Loading payments...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">Failed to load payments</div>
    );

  if (!payments || payments.length === 0)
    return <div className="p-4">No payment history found.</div>;
  const handlePay = (data) => {
    navigate('/stripe-checkout', {
      state: {
        paymentData: {
          paymentId: data.serviceId,
          serviceName: data.serviceName || data.name || "Unknown Service",
          amount: Number(data.cost || data.price || 0 || data.amount) * 100, // Convert to cents
          customerName: data.customerName,

          serviceId: String(data._id),
        }
      }
    });
  }
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Service</th>
              <th>Payment Date</th>
              <th>Amount ($)</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.map((payment, index) => (
              <>
                <tr key={payment._id}>
                  <td>{payment.serviceName}</td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>{payment.amount?.toFixed(2)}</td>
                  <td>{payment.status}</td>
                  <td>{payment.transactionId || "N/A"}</td>
                  <button onClick={() => handlePay(payment)} key={index} className="btn btn-error "> pay</button>
                </tr>
              </>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
