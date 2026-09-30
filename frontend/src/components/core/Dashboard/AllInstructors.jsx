import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaCheck, FaChalkboardTeacher } from "react-icons/fa"
import { HiClock } from "react-icons/hi"

import { getAllInstructorDetails } from "../../../services/operations/adminApi"
import IconBtn from "../../common/IconBtn"
import user_logo from "../../../assets/Images/user.png"

// Loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="flex p-4 sm:p-6 flex-col gap-4 border-b border-richblack-800 bg-richblack-800/20">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
        <div className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] rounded-full skeleton flex-shrink-0"></div>
        <div className="flex flex-col gap-2 flex-1 w-full">
          <p className="h-5 w-[180px] mx-auto sm:mx-0 rounded-xl skeleton"></p>
          <p className="h-4 w-[240px] mx-auto sm:mx-0 rounded-xl skeleton"></p>
          <p className="h-3 w-[120px] mx-auto sm:mx-0 rounded-xl skeleton"></p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <p className="h-8 rounded-lg skeleton"></p>
        <p className="h-8 rounded-lg skeleton"></p>
      </div>
    </div>
  )
}

function AllInstructors() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [allInstructorDetails, setAllInstructorDetails] = useState([])
  const [instructorsCount, setInstructorsCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInstructorsData = async () => {
      setLoading(true)
      const { allInstructorsDetails, instructorsCount } = await getAllInstructorDetails(token)
      if (allInstructorsDetails) {
        setAllInstructorDetails(allInstructorsDetails)
        setInstructorsCount(instructorsCount || allInstructorsDetails.length)
      }
      setLoading(false)
    }

    fetchInstructorsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-medium text-richblack-5 font-boogaloo text-left">
            All Instructors Details
          </h1>
          <p className="text-xs sm:text-sm text-richblack-400 mt-1">
            Total Registered Instructors: <span className="text-yellow-50 font-semibold">{instructorsCount}</span>
          </p>
        </div>

        <IconBtn text="Add Instructor" onclick={() => navigate("/dashboard/all-instructors")}>
          <VscAdd />
        </IconBtn>
      </div>

      {/* Instructors Container */}
      <div className="rounded-2xl border border-richblack-800 bg-richblack-800/30 overflow-hidden shadow-lg">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-richblack-800 bg-richblack-800/70 px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-richblack-200">
          <div>Instructors List ({instructorsCount})</div>
          <div className="hidden sm:block text-right">Status & Approval</div>
        </div>

        {/* Skeletons */}
        {loading && (
          <div>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!loading && (!allInstructorDetails || allInstructorDetails.length === 0) && (
          <div className="py-16 px-4 text-center">
            <FaChalkboardTeacher className="mx-auto text-4xl text-richblack-500 mb-2" />
            <p className="text-xl font-semibold text-richblack-100">No Instructors Found</p>
          </div>
        )}

        {/* Instructor Items */}
        {!loading &&
          allInstructorDetails?.map((instructor) => (
            <div
              key={instructor._id}
              className="border-b border-richblack-800 p-4 sm:p-6 hover:bg-richblack-800/40 transition-colors"
            >
              {/* Profile Info Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 w-full sm:w-auto">
                  <img
                    src={instructor.image && instructor.image !== "/" ? instructor.image : user_logo}
                    alt="instructor"
                    className="h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] rounded-full object-cover border-2 border-richblack-700 flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-richblack-5 capitalize">
                      {instructor.firstName + " " + instructor.lastName}
                    </h2>
                    <p className="text-xs sm:text-sm text-richblack-300 break-all">{instructor.email}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-richblack-400 pt-1">
                      <span>Gender: <strong className="text-richblack-200">{instructor.additionalDetails?.gender || "Not defined"}</strong></span>
                      <span>Phone: <strong className="text-richblack-200">{instructor.additionalDetails?.contactNumber || "N/A"}</strong></span>
                      <span>DOB: <strong className="text-richblack-200">{instructor.additionalDetails?.dateOfBirth || "N/A"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 self-center sm:self-start">
                  {instructor.active ? (
                    <span className="flex items-center gap-1 rounded-full bg-caribbeangreen-900/40 border border-caribbeangreen-600 px-2.5 py-0.5 text-xs font-medium text-caribbeangreen-200">
                      <FaCheck size={10} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-pink-900/40 border border-pink-700 px-2.5 py-0.5 text-xs font-medium text-pink-200">
                      <HiClock size={12} /> Inactive
                    </span>
                  )}

                  {instructor.approved ? (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-900/40 border border-yellow-700 px-2.5 py-0.5 text-xs font-medium text-yellow-100">
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-richblack-700 border border-richblack-600 px-2.5 py-0.5 text-xs font-medium text-richblack-300">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Built Courses */}
              <div className="mt-4 pt-3 border-t border-richblack-700/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-50 mb-2">
                  Created Courses ({instructor.courses?.length || 0})
                </p>

                {instructor.courses && instructor.courses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {instructor.courses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between rounded-lg bg-richblack-900/60 border border-richblack-700/60 p-2.5 text-xs"
                      >
                        <span className="font-medium text-richblack-100 line-clamp-1 flex-1 pr-2">
                          {course.courseName}
                        </span>
                        <span className="font-bold text-yellow-50 flex-shrink-0">
                          ₹{course.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-richblack-400 italic">No courses created yet</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AllInstructors