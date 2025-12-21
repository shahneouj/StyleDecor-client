import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../component/ServiceCard/ServiceCard";
import useAxios from "../../Hook/useAxios";
import TopRatedDecorators from "../../component/TopRatedDecorator/TopRatedDecorator";
import BranchOfficeMap from "../../component/BranchOfficeMap/BranchOfficeMap";
import ImageSliderWithText from "../../component/ImageSliderWithText/ImageSliderWithText";
const Home = () => {
  const { data, isLoading, error } = useAxios("get", "/decoration-services");
  const services = data?.data || [];

  return (
    <div>
      <ImageSliderWithText services={services} isLoading={isLoading} error={error} />
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
