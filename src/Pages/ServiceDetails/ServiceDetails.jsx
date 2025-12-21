import { useParams } from "react-router";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAxios from "../../Hook/useAxios";
import PaymentForm from "../../component/PaymentFrom/PaymentFrom";

export default function ServiceDetails() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAxios("get", `/decoration-services/${id}`, {}, { enabled: !!id });
  const service = data?.data;
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error max-w-md">
          <span>{error?.message || "Failed to load service"}</span>
        </div>
      </div>
    );
  }
  const availableDays = [
    "2025-12-16",
    "2025-12-18",
    "2025-12-20",
    "2025-12-25",
  ];


  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 ">
      {/* <PaymentForm service={service} availableDays={availableDays} className={'absolute'} /> */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <figure>
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-[320px] object-cover"
            />
          </figure>
          <div className="card-body">
            <h1 className="card-title text-3xl">{service.title}</h1>
            <p className="text-gray-500">Category: {service.category}</p>
            <div className="flex gap-4 mt-4">
              <div className="badge badge-primary badge-lg">
                ${service.price}
              </div>
              <div className="badge badge-outline badge-lg">
                {service.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="text-2xl font-semibold mb-2">
                  Service Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">
                  What’s Included
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {service.features?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card bg-base-100 shadow-lg sticky top-6">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4">
                  Book This Service
                </h3>
                <p className="text-gray-600 mb-4">
                  Ready to get started? Book this service now.
                </p>
                <button className="btn btn-primary w-full" onClick={() => setOpen(true)}>
                  Book Now
                </button>

              </div>
            </div>
          </div>
        </div>
      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed right-0 top-0 h-full z-50 w-full sm:w-96 p-4 overflow-auto bg-base-100 shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              aria-modal="true"
              role="dialog"
            >
              <PaymentForm service={service} availableDays={availableDays} onSuccess={() => setOpen(false)} onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
