import useAxios from "../../hooks/useAxios";

export default function TopDecorators() {
  const { data, isLoading, isError } = useAxios("get", "/decorators/top-decorators");

  const decorators = data?.data || [];

  if (isLoading) return <p>Loading decorators...</p>;
  if (isError) return <p>Failed to load decorators.</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Top Decorators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {decorators.map((decorator) => (
          <div
            key={decorator._id}
            className="card bg-base-100 shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={decorator.profileImage}
              alt={decorator.name}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="card-body">
              <h3 className="card-title">{decorator.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{decorator.bio}</p>

              <div className="flex items-center mb-2">
                <span className="badge badge-secondary mr-2">
                  ⭐ {decorator.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {decorator.specialties.map((spec, i) => (
                  <span key={i} className="badge badge-outline">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
