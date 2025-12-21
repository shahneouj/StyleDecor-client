const About = () => {
  return (
    <section className="min-h-screen px-4 py-16 bg-base-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-3 text-sm opacity-70">
            Who we are & why people trust us
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              We Create Memorable Events
            </h2>
            <p className="opacity-80 mb-4">
              We are a platform that connects clients with professional
              decorators for weddings, parties, corporate events, and special
              occasions. Our goal is to make event planning easy, transparent,
              and reliable.
            </p>

            <p className="opacity-80 mb-4">
              All decorators on our platform are verified and rated by real
              customers. We focus on quality, creativity, and customer
              satisfaction.
            </p>

            <div className="flex gap-4 mt-6">
              <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Decorators</div>
                <div className="stat-value text-primary">200+</div>
              </div>
              <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Events Completed</div>
                <div className="stat-value text-secondary">1,500+</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="About us"
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>

        {/* Mission */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Our Mission</h3>
              <p className="opacity-80">
                To simplify event decoration booking with trusted professionals.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Our Vision</h3>
              <p className="opacity-80">
                To become the most reliable event service platform in the
                country.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Our Values</h3>
              <p className="opacity-80">
                Trust, creativity, transparency, and customer happiness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
