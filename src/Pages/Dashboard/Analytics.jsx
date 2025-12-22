import React from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Analytics = () => {
  // Fetch earnings summary
  const { data: revenueData, isLoading: loadingRevenue, error: revenueError } = useAxios(
    "get",
    "/analytics/revenue-summary"
  );

  // Fetch service demand data
  const { data: demandData, isLoading: loadingDemand, error: demandError } = useAxios(
    "get",
    "/analytics/service-demand"
  );

  if (loadingRevenue || loadingDemand)
    return <div className="p-8 text-center">Loading analytics...</div>;

  if (revenueError || demandError)
    return (
      <div className="alert alert-error m-8">
        Failed to load analytics data.
      </div>
    );

  const revenueSummary = revenueData?.data || {};
  const serviceDemand = demandData?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Revenue & Analytics Dashboard</h1>

      {/* Earnings Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-primary">
            ${revenueSummary.totalRevenue?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold text-primary">
            {revenueSummary.totalBookings || 0}
          </p>
        </div>
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Average Revenue Per Booking</h2>
          <p className="text-3xl font-bold text-primary">
            {revenueSummary.totalBookings
              ? `$${(revenueSummary.totalRevenue / revenueSummary.totalBookings).toFixed(2)}`
              : "$0.00"}
          </p>
        </div>
      </section>

      {/* Service Demand Chart */}
      <section className="card bg-base-100 shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Service Demand</h2>
        {serviceDemand.length === 0 ? (
          <p>No service demand data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={serviceDemand} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="serviceName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookingsCount" fill="#3b82f6" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}


export default Analytics;
