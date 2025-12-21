import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../component/ServiceCard/ServiceCard";
import useAxios from "../../Hook/useAxios";
import TopRatedDecorators from "../../component/TopRatedDecorator/TopRatedDecorator";
import BranchOfficeMap from "../../component/BranchOfficeMap/BranchOfficeMap";
const Home = () => {
  const { data, isLoading } = useAxios("get", "/decoration-services");
  const [index, setIndex] = useState(0);
  const services = data?.data || [];
  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  return (
    <div>
      <section className="min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-6 gap-12 max-w-7xl mx-auto">
        {/* Left Side Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold mb-4">
            Smart Home & Ceremony Decoration Booking
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto md:mx-0 mb-6">
            Book expert decorators for your home, events, and ceremonies — fast,
            reliable, and beautifully organized.
          </p>
          <button className="btn btn-primary text-lg px-6">
            Book Decoration Service
          </button>
        </motion.div>

        {/* Right Side Image Slider */}
        <div className="relative flex-1 max-w-md">
          {/* Picture frame */}
          <div className="border-8 border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`Slide ${index + 1}`}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ duration: 0.6 }}
                className="w-full h-72 object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="btn btn-circle btn-outline absolute top-1/2 left-2 -translate-y-1/2"
            aria-label="Previous Slide"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="btn btn-circle btn-outline absolute top-1/2 right-2 -translate-y-1/2"
            aria-label="Next Slide"
          >
            ❯
          </button>
        </div>
      </section>
      <section className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Decoration Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={index} service={service}></ServiceCard>
          ))}
        </div>
      </section>
      <TopRatedDecorators />
      <BranchOfficeMap />
    </div>
  );
};

export default Home;
