"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { PostImage } from "@/lib/types";

import "swiper/css";
import "swiper/css/pagination";

export function ImageCarousel({ images }: { images: PostImage[] }) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-100 text-gray-400">
        No Image
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={images[0].image_url}
          alt={images[0].alt_text || ""}
          fill
          sizes="(max-width: 1024px) 100vw, 512px"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={0}
      slidesPerView={1}
      className="aspect-square bg-gray-100 [&_.swiper-pagination-bullet-active]:!bg-gray-900"
    >
      {images.map((image) => (
        <SwiperSlide key={image.id}>
          <div className="relative aspect-square">
            <Image
              src={image.image_url}
              alt={image.alt_text || ""}
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
