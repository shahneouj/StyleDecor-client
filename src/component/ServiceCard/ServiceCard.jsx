export default function ServiceCard({ service }) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition">
      <figure>
        <img
          src={service.image}
          alt={service.name}
          className="h-48 w-full object-cover rounded-t-xl"
        />
      </figure>

      <div className="card-body space-y-2">
        <h3 className="card-title text-lg font-bold">{service.name}</h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {service.description}
        </p>

        {/* Price + Duration */}
        <div className="flex justify-between text-sm mt-3">
          <span className="font-bold">৳ {service.price}</span>
          <span className="text-gray-500">{service.duration}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500">
          <span>⭐</span>
          <span className="font-medium">{service.rating}</span>
        </div>

        <div className="card-actions mt-4">
          <button className="btn btn-primary w-full">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
