import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";

const PaymentHistory = () => {
  const { user } = useAuth();

  const {
    data: payments,
    isLoading,
    isError,
  } = useAxios("get", `/payments/user`);


  if (isLoading) return <div className="p-4">Loading payments...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">Failed to load payments</div>
    );

  if (!payments || payments.length === 0)
    return <div className="p-4">No payment history found.</div>;

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
            {payments.data && payments.data.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.serviceName}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.amount?.toFixed(2)}</td>
                <td>{payment.status}</td>
                <td>{payment.transactionId || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
