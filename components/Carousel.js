import React from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Carousel({ items }) {
  return (
    <ResponsiveCarousel
      showArrows={true}
      showThumbs={false}
      itemClass='w-64'
      autoPlay={false}
      infiniteLoop={false}
      showStatus={false}
      transitionTime={500}
      interval={3000}
      stopOnHover={false}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className='w-64 h-full flex items-center justify-center'
        >
          {item}
        </div>
      ))}
    </ResponsiveCarousel>
  );
}

export default Carousel;
