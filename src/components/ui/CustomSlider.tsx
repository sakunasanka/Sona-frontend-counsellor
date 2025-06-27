import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CustomSliderProps {
  children: React.ReactNode[];
  slidesToShow?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  children,
  slidesToShow = 3,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  className = ''
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalSlides = children.length;
  const maxSlides = Math.max(0, totalSlides - slidesToShow);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, autoPlay, autoPlayInterval]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev >= maxSlides ? 0 : prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev <= 0 ? maxSlides : prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning || slideIndex === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(slideIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Calculate responsive slides to show
  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(slidesToShow);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setResponsiveSlidesToShow(1);
      } else if (width < 1024) {
        setResponsiveSlidesToShow(2);
      } else {
        setResponsiveSlidesToShow(slidesToShow);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  const slideWidth = 100 / responsiveSlidesToShow;
  const translateX = -(currentSlide * slideWidth);

  // Calculate dots
  const dotsCount = Math.ceil(totalSlides / responsiveSlidesToShow);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main slider container */}
      <div className="overflow-hidden relative">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${(totalSlides / responsiveSlidesToShow) * 100}%`
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${slideWidth}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > responsiveSlidesToShow && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 z-10"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 z-10"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && dotsCount > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: dotsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                Math.floor(currentSlide / responsiveSlidesToShow) === index
                  ? 'bg-gray-800 scale-110'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSlider;
