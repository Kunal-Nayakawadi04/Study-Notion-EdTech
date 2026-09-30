import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import Img from './Img'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

// Icons
import { FaStar } from "react-icons/fa"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

// Default showcase reviews if no reviews in DB yet
const defaultReviews = [
  {
    user: {
      firstName: "Aman",
      lastName: "Verma",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Aman Verma",
    },
    course: { courseName: "Full Stack Web Development" },
    review: "The curriculum is well structured and hands-on projects helped me crack my first developer role!",
    rating: 5,
  },
  {
    user: {
      firstName: "Priya",
      lastName: "Sharma",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Priya Sharma",
    },
    course: { courseName: "Complete HTML5 Bootcamp" },
    review: "Loved the teaching style! Every topic from semantic tags to modern responsive layouts was explained in depth.",
    rating: 5,
  },
  {
    user: {
      firstName: "Rahul",
      lastName: "Patel",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Rahul Patel",
    },
    course: { courseName: "Frontend Mastery with React" },
    review: "Clear explanations, great doubt support and real world projects. Best platform for coding enthusiasts!",
    rating: 5,
  },
  {
    user: {
      firstName: "Sneha",
      lastName: "Deshmukh",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Sneha Deshmukh",
    },
    course: { courseName: "Backend Architecture with Node.js" },
    review: "High quality lectures and practical insights on database schemas, authentication, and REST APIs.",
    rating: 5,
  },
]

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (response?.data?.success && response?.data?.data?.length > 0) {
          setReviews(response.data.data)
        } else {
          setReviews(defaultReviews)
        }
      } catch (error) {
        console.log("Could not fetch reviews, using defaults", error)
        setReviews(defaultReviews)
      }
    })()
  }, [])

  const displayedReviews = reviews.length > 0 ? reviews : defaultReviews

  return (
    <div className="text-white w-full">
      <div className="my-[40px] max-w-maxContentTab lg:max-w-maxContent mx-auto px-2">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={displayedReviews.length > 2}
          freeMode={true}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="w-full py-4"
        >
          {displayedReviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col justify-between gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 min-h-[190px] rounded-xl border border-richblack-700/60 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 min-w-[40px] max-w-[40px] aspect-square rounded-full overflow-hidden border border-richblack-600 flex-shrink-0 bg-richblack-700">
                    <img
                      src={
                        review?.user?.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || "Student"} ${review?.user?.lastName || ""}`
                      }
                      alt={`${review?.user?.firstName || "Student"}`}
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="font-semibold text-richblack-5 capitalize text-sm truncate">
                      {`${review?.user?.firstName || "Student"} ${review?.user?.lastName || ""}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-400 truncate">
                      {review?.course?.courseName || "Coding Course"}
                    </h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-100 text-xs sm:text-sm line-clamp-3">
                  {review?.review?.split(" ")?.length > truncateWords
                    ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                    : review?.review}
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-richblack-700/40">
                  <span className="font-semibold text-yellow-100 text-xs">
                    {review?.rating ? Number(review.rating).toFixed(1) : "5.0"}
                  </span>
                  <ReactStars
                    count={5}
                    value={parseInt(review?.rating) || 5}
                    size={16}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
