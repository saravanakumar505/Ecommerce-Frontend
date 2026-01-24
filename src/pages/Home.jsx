import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Correct slide array (no JSX inside)
 const slides = [
  "/images/nike.png",
  "/images/skechers_sale.jpg",
  "/images/nike_air_force.jpg"
];

  const totalSlides = slides.length;

  // Move slider to specific index
  const goToSlide = (index) => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].clientWidth;
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  // Move when currentSlide changes
  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => goToSlide(currentSlide);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full overflow-hidden bg-gray-100"
    >
      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex transition-transform duration-700 ease-in-out"
      >
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            className="w-full h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] object-cover flex-shrink-0"
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition text-white shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-3 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition text-white shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Dots/Indicators (Optional Enhancement) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white w-6 md:w-8" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
