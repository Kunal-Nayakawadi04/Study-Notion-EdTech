import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import Img from "../../common/Img";
import { formatDate } from "../../../services/formatDate";
import { HiOutlineReceiptTax, HiOutlineShoppingBag } from "react-icons/hi";

export default function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getUserEnrolledCourses(token);
        setCourses(res || []);
      } catch (error) {
        console.error("Could not fetch purchase history", error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [token]);

  // Loading skeleton
  const SkeletonRow = () => (
    <div className="flex items-center justify-between border-b border-richblack-700 px-6 py-4">
      <div className="flex items-center gap-4 w-1/2">
        <div className="h-16 w-16 rounded-lg skeleton"></div>
        <div className="flex flex-col gap-2 w-3/5">
          <div className="h-4 w-4/5 rounded skeleton"></div>
          <div className="h-3 w-1/2 rounded skeleton"></div>
        </div>
      </div>
      <div className="h-4 w-20 rounded skeleton"></div>
      <div className="h-4 w-20 rounded skeleton"></div>
      <div className="h-6 w-24 rounded-full skeleton"></div>
    </div>
  );

  return (
    <div className="text-richblack-5">
      <div className="flex items-center gap-x-3 mb-8">
        <HiOutlineShoppingBag className="text-3xl text-yellow-50" />
        <h1 className="text-3xl font-medium font-boogaloo tracking-wide">
          Purchase History
        </h1>
      </div>

      {loading ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : courses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] rounded-2xl border border-dashed border-richblack-700 bg-richblack-800/40 p-10 text-center">
          <HiOutlineReceiptTax className="text-6xl text-richblack-500 mb-4" />
          <h2 className="text-2xl font-semibold text-richblack-100 mb-2">
            No Purchases Yet
          </h2>
          <p className="text-richblack-400 max-w-md mb-6 text-sm">
            You have not purchased or enrolled in any courses yet. Browse our catalog to start learning!
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-md bg-yellow-50 px-6 py-2.5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-richblack-700 bg-richblack-800 overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 bg-richblack-700/60 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-richblack-200">
            <div className="col-span-6">Course</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Purchased On</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-richblack-700">
            {courses.map((course, index) => (
              <div
                key={course._id || index}
                className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center px-6 py-5 gap-4 hover:bg-richblack-750/50 transition-colors"
              >
                {/* Course Details */}
                <div
                  className="col-span-6 flex items-center gap-4 cursor-pointer w-full"
                  onClick={() =>
                    navigate(
                      `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                    )
                  }
                >
                  <Img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-16 w-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-semibold text-richblack-5 text-base hover:text-yellow-50 transition-colors line-clamp-1">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-400 line-clamp-1">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-left sm:text-center text-sm font-semibold text-richblack-50">
                  <span className="sm:hidden text-richblack-400 font-normal">Price: </span>
                  ₹{course.price || 0}
                </div>

                {/* Purchase Date */}
                <div className="col-span-2 text-left sm:text-center text-xs text-richblack-300">
                  <span className="sm:hidden text-richblack-400">Date: </span>
                  {course.createdAt ? formatDate(course.createdAt) : "Recently"}
                </div>

                {/* Status */}
                <div className="col-span-2 flex justify-start sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-caribbeangreen-900/60 text-caribbeangreen-200 border border-caribbeangreen-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-caribbeangreen-300"></span>
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
