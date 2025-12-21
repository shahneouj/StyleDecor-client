import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import useAxios from "../../Hook/useAxios";

const TopRatedDecoratorsSlider = () => {
  const { data, isLoading, error } = useAxios(
    "get",
    "/decorators/top-decorators"
  );

  const decorators = data?.data || [];
  const [startIndex, setStartIndex] = useState(0);

  // Responsive visible cards
  const visibleCount = useMemo(() => {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1;                                // sm
  }, []);

  const next = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= decorators.length ? 0 : prev + visibleCount
    );
  };

  const prev = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0
        ? Math.max(decorators.length - visibleCount, 0)
        : prev - visibleCount
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || decorators.length === 0) {
    return (
      <div className="text-center text-error py-10">
        Failed to load decorators
      </div>
    );
  }

  const visibleDecorators = decorators.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <section className="my-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Top Rated Decorators</h2>
        <p className="text-sm opacity-70 mt-2">
          Meet our highest-rated professionals
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Buttons */}
        <button
          onClick={prev}
          className="btn btn-circle btn-outline absolute -left-4 top-1/2 -translate-y-1/2 z-10"
        >
          ❮
        </button>

        <button
          onClick={next}
          className="btn btn-circle btn-outline absolute -right-4 top-1/2 -translate-y-1/2 z-10"
        >
          ❯
        </button>

        {/* Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleDecorators.map((d, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="avatar mb-3">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src="https://i.ibb.co.com/Zpmx73bY/user-profile-svgrepo-com.jpg" alt={d.name} />
                    </div>
                  </div>

                  <h3 className="card-title">{d.name}</h3>

                  <span className="badge badge-primary badge-sm">
                    ⭐ {d.rating}
                  </span>

                  <p className="text-sm opacity-80 mt-2 line-clamp-2">
                    {d.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {d.specialties.map((sp, i) => (
                      <span key={i} className="badge badge-outline">
                        {sp}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions justify-between w-full mt-4">
                    <span className="text-sm opacity-70">
                      📞 {d.phone}
                    </span>
                    <button className="btn btn-sm btn-primary">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TopRatedDecoratorsSlider;
