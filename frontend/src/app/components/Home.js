'use client'; // Ensure this file is marked as a client component in Next.js

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

export default function Home({ data }) {
  const { title, subtitle, backgroundImage = [] } = data; // Ensure `backgroundImage` is an array
  const allParagraph = (subtitle || []).filter((item) => item.type === 'paragraph').flatMap((item) => item?.children);
  const subtitleText = (allParagraph || []).filter((item) => item.type === 'text').flatMap((item) => item?.text);

  const strapi_url = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-full"
      >
        {backgroundImage.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={`${strapi_url}/admin/${slide.url}`}
                alt={`Slide ${index + 1}`}
                className="object-cover object-center w-full h-full"
              />
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
                <h1 className="text-5xl font-bold leading-tight mb-4">{slide.title || title}</h1>
                <p className="text-lg text-gray-300 mb-8">{slide.subtitle || subtitleText}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}