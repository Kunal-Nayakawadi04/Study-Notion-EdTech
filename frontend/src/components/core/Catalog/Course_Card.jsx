import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img'

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  return (
    <div className='hover:scale-[1.02] transition-all duration-200 w-full max-w-full overflow-hidden'>
      <Link to={`/courses/${course?._id}`} className="block w-full">
        <div className="flex flex-col w-full">
          {/* Responsive 16:9 Aspect Ratio Thumbnail */}
          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-richblack-800 border border-richblack-700/50">
            <Img
              src={course?.thumbnail}
              alt={course?.courseName || "Course thumbnail"}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 px-1 py-3 w-full">
            <p className="text-base sm:text-lg font-semibold text-richblack-5 line-clamp-1 hover:text-yellow-50 transition-colors">
              {course?.courseName}
            </p>
            <p className="text-xs sm:text-sm text-richblack-300 capitalize">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-yellow-50 font-bold">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400 text-xs">
                ({course?.ratingAndReviews?.length || 0})
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-richblack-5">
              ₹{course?.price || 0}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card
