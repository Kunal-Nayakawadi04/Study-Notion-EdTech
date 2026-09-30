import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import Img from './../../common/Img';



export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])


  // get Instructor Data
  useEffect(() => {
    ; (async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      // console.log('INSTRUCTOR_API_RESPONSE.....', instructorApiData)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)

  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)


  // skeleton loading
  const skItem = () => {
    return (
      <div className="mt-5 w-full flex flex-col justify-between  rounded-xl ">
        <div className="flex border p-4 border-richblack-600 ">
          <div className="w-full">
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            <div className="mt-3 flex gap-x-5">
              <p className="w-[200px] h-4 rounded-xl skeleton"></p>
              <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            </div>

            <div className="flex justify-center items-center flex-col">
              <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
              {/* circle */}
              <div className="w-60 h-60 rounded-full  mt-4 grid place-items-center skeleton"></div>
            </div>
          </div>
          {/* right column */}
          <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
        </div>

        {/* bottom row */}
        <div className="flex flex-col gap-y-6  mt-5">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-richblack-5 pl-5">Your Courses</p>
            <Link to="/dashboard/my-courses">
              <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">View All</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row  gap-6 ">
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5 text-center sm:text-left">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-center sm:text-left">
          Let's start something new
        </p>
      </div>


      {loading ? (
        <div>
          {skItem()}
        </div>
      )
        :
        courses.length > 0 ? (
          <div>
            <div className="my-6 flex flex-col lg:flex-row gap-6">
              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <div className="flex-1 rounded-xl bg-richblack-800 p-4 sm:p-6 min-h-[360px] sm:min-h-[420px]">
                  <InstructorChart courses={instructorData} />
                </div>
              ) : (
                <div className="flex-1 rounded-xl bg-richblack-800 p-6 flex flex-col justify-center items-center min-h-[250px]">
                  <p className="text-lg font-bold text-richblack-5">Visualize</p>
                  <p className="mt-4 text-base sm:text-xl font-medium text-richblack-50 text-center">
                    Not Enough Data To Visualize
                  </p>
                </div>
              )}

              {/* Total Statistics */}
              <div className="flex w-full lg:w-[280px] lg:min-w-[260px] flex-col rounded-xl bg-richblack-800 p-4 sm:p-6">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  <div className="rounded-lg bg-richblack-700/40 p-3 sm:p-4 lg:bg-transparent lg:p-0">
                    <p className="text-sm text-richblack-300">Total Courses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-richblack-50 mt-1">
                      {courses.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-richblack-700/40 p-3 sm:p-4 lg:bg-transparent lg:p-0">
                    <p className="text-sm text-richblack-300">Total Students</p>
                    <p className="text-2xl sm:text-3xl font-bold text-richblack-50 mt-1">
                      {totalStudents || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-richblack-700/40 p-3 sm:p-4 lg:bg-transparent lg:p-0">
                    <p className="text-sm text-richblack-300">Total Income</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-50 mt-1">
                      ₹{totalAmount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Render 3 courses */}
            <div className="rounded-xl bg-richblack-800 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="flex flex-col rounded-xl overflow-hidden bg-richblack-700/30 border border-richblack-700 p-3 hover:scale-[1.01] transition-transform duration-200">
                    <Img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-[180px] w-full rounded-lg object-cover"
                    />

                    <div className="mt-3 flex flex-col flex-1 justify-between">
                      <p className="text-sm font-semibold text-richblack-50 line-clamp-1">
                        {course.courseName}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-richblack-300">
                        <p>{course.studentsEnrolled.length} students</p>
                        <p className="font-semibold text-yellow-50">₹{course.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5">
              You have not created any courses yet
            </p>

            <Link to="/dashboard/add-course">
              <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                Create a course
              </p>
            </Link>
          </div>
        )}
    </div>
  )
}
