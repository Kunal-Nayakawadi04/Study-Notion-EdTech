import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import Img from "../../../common/Img"

export default function CoursesTable({ courses, setCourses, loading, setLoading }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 25

  // Delete Course
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    const toastId = toast.loading("Deleting course...")
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
    toast.dismiss(toastId)
  }

  // Skeleton Item
  const skItem = () => {
    return (
      <div className="flex flex-col sm:flex-row border-b border-richblack-800 p-4 sm:p-6 w-full gap-4">
        <div className="h-[160px] sm:h-[130px] w-full sm:w-[220px] rounded-xl skeleton flex-shrink-0"></div>
        <div className="flex flex-col flex-1 gap-2">
          <p className="h-5 w-[60%] rounded-xl skeleton"></p>
          <p className="h-12 w-[90%] rounded-xl mt-2 skeleton"></p>
          <p className="h-3 w-[40%] rounded-xl skeleton mt-2"></p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-richblack-800 bg-richblack-800/30 overflow-hidden shadow-lg">
        {/* Desktop Table Header */}
        <div className="hidden lg:flex items-center justify-between border-b border-richblack-800 bg-richblack-800/70 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-richblack-200">
          <div className="flex-1">Courses</div>
          <div className="w-[120px] text-left">Duration</div>
          <div className="w-[100px] text-left">Price</div>
          <div className="w-[110px] text-right">Actions</div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}

        {/* Empty State */}
        {!loading && (!courses || courses.length === 0) && (
          <div className="py-16 px-4 text-center">
            <p className="text-xl sm:text-2xl font-semibold text-richblack-100">
              No courses found
            </p>
            <p className="text-xs sm:text-sm text-richblack-400 mt-2">
              You haven't created any courses yet. Start by creating one!
            </p>
          </div>
        )}

        {/* Course Rows / Cards */}
        {!loading &&
          courses?.map((course) => (
            <div
              key={course._id}
              className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-richblack-800 p-4 sm:p-6 gap-4 hover:bg-richblack-800/40 transition-colors"
            >
              {/* Left Column: Thumbnail + Details */}
              <div className="flex flex-col sm:flex-row flex-1 gap-4 items-start">
                {/* Course Thumbnail with Status Overlay Badge */}
                <div className="relative w-full sm:w-[220px] flex-shrink-0 aspect-video sm:aspect-auto sm:h-[130px] rounded-xl overflow-hidden bg-richblack-900 border border-richblack-700/50">
                  <Img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-full w-full object-cover rounded-xl"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex items-center gap-1 rounded-full bg-pink-900/90 border border-pink-700 px-2 py-0.5 text-[11px] font-medium text-pink-100 backdrop-blur-sm">
                        <HiClock size={12} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 rounded-full bg-yellow-900/90 border border-yellow-700 px-2 py-0.5 text-[11px] font-medium text-yellow-100 backdrop-blur-sm">
                        <FaCheck size={10} />
                        Published
                      </p>
                    )}
                  </div>
                </div>

                {/* Course Information */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-richblack-5 capitalize line-clamp-1">
                      {course.courseName}
                    </h2>
                    <p className="text-xs text-richblack-300 mt-1 line-clamp-2 leading-relaxed">
                      {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-richblack-400">
                    <span>Created: {formatDate(course?.createdAt)}</span>
                    <span>Updated: {formatDate(course?.updatedAt)}</span>
                  </div>

                  {/* Mobile-only Duration and Price Row */}
                  <div className="mt-3 flex items-center justify-between border-t border-richblack-700/40 pt-2 lg:hidden">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-richblack-200">
                        ⏱ {course.totalDuration || "0s"}
                      </span>
                      <span className="font-bold text-yellow-50 text-sm">
                        ₹{course.price}
                      </span>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={loading}
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        title="Edit Course"
                        className="flex items-center gap-1 rounded-lg bg-richblack-700 px-3 py-1.5 text-xs font-medium text-richblack-100 hover:bg-richblack-600 hover:text-caribbeangreen-300 transition-all active:scale-95"
                      >
                        <FiEdit2 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        disabled={loading}
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Do you want to delete this course?",
                            text2: "All the sections and data related to this course will be deleted.",
                            btn1Text: !loading ? "Delete" : "Deleting...",
                            btn2Text: "Cancel",
                            btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                            btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                          })
                        }
                        title="Delete Course"
                        className="flex items-center gap-1 rounded-lg bg-pink-900/50 border border-pink-700/50 px-3 py-1.5 text-xs font-medium text-pink-200 hover:bg-pink-800 hover:text-white transition-all active:scale-95"
                      >
                        <RiDeleteBin6Line size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop-only Duration Column */}
              <div className="w-[120px] text-sm text-richblack-100 hidden lg:block">
                {course.totalDuration || "0s"}
              </div>

              {/* Desktop-only Price Column */}
              <div className="w-[100px] text-sm font-bold text-yellow-50 hidden lg:block">
                ₹{course.price}
              </div>

              {/* Desktop-only Actions Column */}
              <div className="w-[110px] hidden lg:flex items-center justify-end gap-x-3 text-richblack-300">
                <button
                  disabled={loading}
                  onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                  title="Edit"
                  className="p-1 rounded-md hover:text-caribbeangreen-300 hover:bg-richblack-700 transition-all"
                >
                  <FiEdit2 size={18} />
                </button>

                <button
                  disabled={loading}
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Do you want to delete this course?",
                      text2: "All the sections and data related to this course will be deleted.",
                      btn1Text: !loading ? "Delete" : "Deleting...",
                      btn2Text: "Cancel",
                      btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                      btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                    })
                  }
                  title="Delete"
                  className="p-1 rounded-md hover:text-pink-300 hover:bg-pink-900/30 transition-all"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
