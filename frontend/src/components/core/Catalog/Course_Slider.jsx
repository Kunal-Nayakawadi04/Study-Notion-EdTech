import React from "react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import Course_Card from "./Course_Card"

function Course_Slider({ Courses }) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={Courses.length > 2}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
          }}
          className="w-full pt-4 pb-2"
        >
          {Courses.map((course, i) => (
            <SwiperSlide key={course?._id || i}>
              <Course_Card course={course} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <p className="h-[201px] w-full rounded-xl skeleton"></p>
          <p className="h-[201px] w-full rounded-xl hidden sm:block skeleton"></p>
          <p className="h-[201px] w-full rounded-xl hidden lg:block skeleton"></p>
        </div>
      )}
    </div>
  )
}

export default Course_Slider
