import { useState } from "react";
import useAxios from "../../Hook/useAxios";
import ServiceCard from "../../component/ServiceCard/ServiceCard";
import { data } from "react-router";

const Services = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading } = useAxios("get", "/decoration-services");

  const services = data?.data || [];
  console.log(services.data);
  const filteredServices = services.filter(service => {
    const matchName = service.name.toLowerCase().includes(search.toLowerCase());
    const matchType = type ? service.category === type : true;
    const matchMin = minPrice ? service.price >= minPrice : true;
    const matchMax = maxPrice ? service.price <= maxPrice : true;

    return matchName && matchType && matchMin && matchMax;
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          className="input input-bordered"
          placeholder="Search service"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate">Corporate</option>
        </select>

        <input
          type="number"
          className="input input-bordered"
          placeholder="Min Budget"
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          className="input input-bordered"
          placeholder="Max Budget"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
