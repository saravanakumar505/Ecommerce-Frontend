import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Nike",
    icon: "https://pngimg.com/uploads/nike/nike_PNG11.png",
    path: "nike",
  },
  {
    name: "Adidas",
    icon: "https://www.freepnglogos.com/uploads/adidas-logo-png-black-0.png",
    path: "adidas",
  },
  {
    name: "Puma",
    icon: "https://www.freepnglogos.com/uploads/puma-logo-png-1.png",
    path: "puma",
  },
  {
    name: "Skechers",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/SKECHERS_logo.png/1200px-SKECHERS_logo.png?20191205095926",
    path: "skechers",
  },
  {
    name: "Crocs",
    icon: "https://1000logos.net/wp-content/uploads/2018/12/Crocs-logo-640x429.png",
    path: "crocs",
  },
  {
    name: "VF Corporation",
    icon: "/idRhxqX_NJ_1759041526546.png",
    path: "vfcorporation",
  },
  {
    name: "Deckers Brands",
    icon: "/idr4KXtFWZ_1759041795850.png",
    path: "deckersbrands",
  },
];

export default function Icon() {
  return (
    <div
      className="w-full px-4 py-6 flex overflow-x-auto gap-6 scroll-smooth 
                 scrollbar-hide md:justify-center"
    >
      {categories.map((cat, index) => (
        <Link key={index} to={`/brand/${cat.path.toLowerCase()}`}>
          <div
            className="flex flex-col items-center cursor-pointer 
                       min-w-[70px] md:min-w-[90px] hover:scale-105 transition-transform"
          >
            {/* Icon Box */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                         bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100"
            >
              {cat.icon ? (
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-10 h-10 md:w-14 md:h-14 object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500">No Icon</span>
              )}
            </div>

            {/* Text */}
            <p className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center capitalize">
              {cat.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
