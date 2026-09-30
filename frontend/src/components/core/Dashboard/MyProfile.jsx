import { useEffect } from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import Img from './../../common/Img';



export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate();


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <h1 className="mb-6 sm:mb-12 text-2xl sm:text-3xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        My Profile
      </h1>

      {/* Section 1 */}
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-4 sm:px-12 gap-y-4 gap-x-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <Img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[72px] sm:w-[78px] rounded-full object-cover border-2 border-richblack-600"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5 capitalize">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300 break-all">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* Section 2 */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-4 sm:gap-y-6 rounded-xl border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-4 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${user?.additionalDetails?.about
            ? "text-richblack-5"
            : "text-richblack-400"
            } text-sm font-medium leading-relaxed`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Section 3 */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 rounded-xl border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-4 sm:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-full">
          <div className="flex flex-col gap-y-4 sm:gap-y-5">
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">First Name</p>
              <p className="text-sm font-semibold text-richblack-5 capitalize">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">Email</p>
              <p className="text-sm font-semibold text-richblack-5 break-all">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">Gender</p>
              <p className="text-sm font-semibold text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 sm:gap-y-5">
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">Last Name</p>
              <p className="text-sm font-semibold text-richblack-5 capitalize">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">Phone Number</p>
              <p className="text-sm font-semibold text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs sm:text-sm text-richblack-400">Date Of Birth</p>
              <p className="text-sm font-semibold text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}