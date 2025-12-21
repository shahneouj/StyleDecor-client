import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router";


const ImageSliderWithText = ({ services, isLoading, error }) => {

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const AUTO_SLIDE_INTERVAL = 4000;
  // Update images when data loads
  useEffect(() => {
    if (services) {
      // Assuming each service object has an image URL property, e.g., image or serviceImage
      const loadedImages = services
        .map((service) => service.image) // adapt property name accordingly
        .filter(Boolean); // filter out undefined/null

      setImages(loadedImages);
      setIndex(0);
    }
  }, [services]);
  // Auto slide effect
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer); // cleanup on unmount or images change
  }, [images]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error py-10">
        Failed to load decoration services
      </div>
    );
  }

  // Handle empty images gracefully
  if (!images.length) {
    return (
      <div className="text-center py-10">
        No images available for decoration services.
      </div>
    );
  }

  return (
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
        <NavLink to='/service' className="btn btn-primary text-lg px-6">
          Book Decoration Service
        </NavLink>
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
  );
};

export default ImageSliderWithText;
