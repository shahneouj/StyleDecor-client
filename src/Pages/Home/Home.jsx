import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../component/ServiceCard/ServiceCard";
import useAxios from "../../Hook/useAxios";
const Home = () => {
  const { data, isLoading } = useAxios("get", "/decoration-services");
  const services = data?.data || [];
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-[60vh] flex items-center justify-center text-center px-6"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Smart Home & Ceremony Decoration Booking
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Book expert decorators for your home, events, and ceremonies — fast,
            reliable, and beautifully organized.
          </p>
          <button className="btn btn-primary text-lg px-6">
            Book Decoration Service
          </button>
        </div>
      </motion.section>
      <section className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Decoration Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={index} service={service}></ServiceCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
