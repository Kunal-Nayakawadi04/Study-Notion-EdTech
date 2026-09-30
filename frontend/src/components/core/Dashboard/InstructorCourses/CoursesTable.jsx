
import { useDispatch, useSelector } from "react-redux"

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses, } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import Img from './../../../common/Img';
import toast from 'react-hot-toast'





export default function CoursesTable({ courses, setCourses, loading, setLoading }) {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 25

  // delete course
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    const toastId = toast.loading('Deleting...');
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
    toast.dismiss(toastId)
    // console.log("All Course ", courses)
  }


  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex flex-col sm:flex-row border-b border-richblack-800 px-4 sm:px-6 py-6 sm:py-8 w-full gap-4">
        <div className="h-[148px] w-full sm:w-[220px] md:w-[260px] rounded-xl skeleton flex-shrink-0"></div>
        <div className="flex flex-col flex-1 gap-2">
          <p className="h-5 w-[60%] rounded-xl skeleton"></p>
          <p className="h-14 w-[90%] rounded-xl mt-2 skeleton"></p>
          <p className="h-3 w-[30%] rounded-xl skeleton mt-2"></p>
          <p className="h-3 w-[30%] rounded-xl skeleton"></p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-richblack-800">
        <Table className="w-full">
          {/* heading */}
          <Thead>
            <Tr className="flex gap-x-6 sm:gap-x-10 rounded-t-2xl border-b border-b-richblack-800 px-4 sm:px-6 py-3 bg-richblack-800/40">
              <Th className="flex-1 text-left text-xs sm:text-sm font-medium uppercase text-richblack-100">
                Courses
              </Th>
              <Th className="text-left text-xs sm:text-sm font-medium uppercase text-richblack-100 hidden sm:block">
                Duration
              </Th>
              <Th className="text-left text-xs sm:text-sm font-medium uppercase text-richblack-100 hidden sm:block">
                Price
              </Th>
              <Th className="text-left text-xs sm:text-sm font-medium uppercase text-richblack-100">
                Actions
              </Th>
            </Tr>
          </Thead>

          {/* loading Skeleton */}
          {loading && (
            <div>
              {skItem()}
              {skItem()}
              {skItem()}
            </div>
          )}

          <Tbody>
            {!loading && courses?.length === 0 ? (
              <Tr>
                <Td className="py-10 text-center text-xl sm:text-2xl font-medium text-richblack-100">
                  No courses found
                </Td>
              </Tr>
            ) : (
              courses?.map((course) => (
                <Tr
                  key={course._id}
                  className="flex flex-col lg:flex-row gap-4 lg:gap-x-10 border-b border-richblack-800 px-4 sm:px-6 py-6 sm:py-8 lg:items-center justify-between"
                >
                  <Td className="flex flex-col sm:flex-row flex-1 gap-4 relative">
                    {/* course Thumbnail */}
                    <Img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[160px] sm:h-[130px] md:h-[148px] w-full sm:w-[220px] md:w-[260px] flex-shrink-0 rounded-lg object-cover"
                    />

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-base sm:text-lg font-semibold text-richblack-5 capitalize">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-richblack-300 mt-1 line-clamp-2">
                          {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                            ? course.courseDescription
                                .split(" ")
                                .slice(0, TRUNCATE_LENGTH)
                                .join(" ") + "..."
                            : course.courseDescription}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-richblack-300">
                        <span>Created: {formatDate(course?.createdAt)}</span>
                        <span>Updated: {formatDate(course?.updatedAt)}</span>
                      </div>

                      {/* course status */}
                      <div className="mt-2 flex items-center gap-3">
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <p className="flex w-fit flex-row items-center gap-1.5 rounded-full bg-pink-900/40 border border-pink-700 px-2.5 py-0.5 text-[12px] font-medium text-pink-100">
                            <HiClock size={14} />
                            Drafted
                          </p>
                        ) : (
                          <div className="flex w-fit flex-row items-center gap-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 px-2.5 py-0.5 text-[12px] font-medium text-yellow-100">
                            <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                              <FaCheck size={8} />
                            </p>
                            Published
                          </div>
                        )}

                        {/* Mobile view metadata */}
                        <span className="text-xs font-semibold text-richblack-100 lg:hidden">
                          ⏱ {course.totalDuration || "0s"}
                        </span>
                        <span className="text-xs font-bold text-yellow-50 lg:hidden">
                          ₹{course.price}
                        </span>
                      </div>
                    </div>
                  </Td>

                  {/* Desktop course duration & price */}
                  <Td className="text-sm font-medium text-richblack-100 hidden lg:block">
                    {course.totalDuration || "0s"}
                  </Td>
                  <Td className="text-sm font-bold text-yellow-50 hidden lg:block">
                    ₹{course.price}
                  </Td>

                  <Td className="text-sm font-medium text-richblack-100 flex items-center gap-x-2 pt-2 lg:pt-0 border-t border-richblack-700/50 lg:border-t-0">
                    {/* Edit button */}
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }}
                      title="Edit"
                      className="flex items-center gap-x-1 rounded-md bg-richblack-700 px-3 py-1.5 text-xs text-richblack-200 transition-all hover:bg-richblack-600 hover:text-caribbeangreen-300"
                    >
                      <FiEdit2 size={16} />
                      <span className="lg:hidden">Edit</span>
                    </button>

                    {/* Delete button */}
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1Text: !loading ? "Delete" : "Loading...  ",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }}
                      title="Delete"
                      className="flex items-center gap-x-1 rounded-md bg-pink-900/50 px-3 py-1.5 text-xs text-pink-200 transition-all hover:bg-pink-800 hover:text-white"
                    >
                      <RiDeleteBin6Line size={16} />
                      <span className="lg:hidden">Delete</span>
                    </button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
