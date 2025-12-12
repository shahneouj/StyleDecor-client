import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../component/ServiceCard/ServiceCard";
const Home = () => {
  const services = [
    {
      id: 1,
      name: "Wedding Stage Premium",
      description:
        "A luxurious floral wedding stage with LED backdrops and elegant drapery.",
      image: "https://images.unsplash.com/photo-1605270492741-27b3ac7223de",
    },
    {
      id: 2,
      name: "Home Birthday Decoration",
      description:
        "Balloon arch, light backdrop, and themed interior decorations for birthdays.",
      image: "https://images.unsplash.com/photo-1604014237800-1c803b8363d0",
    },
    {
      id: 3,
      name: "Ceremony Flower Package",
      description: "Fresh flower arrangements for events and home ceremonies.",
      image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
    },
    {
      id: 4,
      name: "Home Interior Setup",
      description:
        "Modern minimal interior styling with elegant lighting and decor elements.",
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
    },
    {
      id: 5,
      name: "Engagement Decor Deluxe",
      description:
        "Stage, floral designs, table decor, and a premium photo booth wall.",
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77",
    },
    {
      id: 6,
      name: "Corporate Event Decoration",
      description:
        "Professional and clean event setup for conferences and business ceremonies.",
      image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    },
  ];
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
          {services.map((service, index) => (
            <ServiceCard key={index} service={service}></ServiceCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
