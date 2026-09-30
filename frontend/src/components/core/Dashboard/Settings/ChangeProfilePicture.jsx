import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateUserProfileImage } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"
import Img from './../../../common/Img';



export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setProfileImage(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      // console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("profileImage", profileImage)

      dispatch(updateUserProfileImage(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (profileImage) {
      previewFile(profileImage)
    }
  }, [profileImage])


  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-4 sm:px-12 text-richblack-5 gap-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <Img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[72px] sm:w-[78px] rounded-full object-cover border-2 border-richblack-600"
          />

          <div className="space-y-3">
            <p className="font-semibold text-base sm:text-lg">Change Profile Picture</p>
            <div className="flex flex-row flex-wrap justify-center sm:justify-start gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg, image/jpg"
              />

              <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md py-2 px-5 font-semibold bg-richblack-200 text-richblack-900 hover:bg-richblack-900 hover:text-richblack-200 duration-300 text-sm"
              >
                Select
              </button>

              <IconBtn
                text={loading ? "Uploading..." : "Upload"}
                onclick={handleFileUpload}
              >
                {!loading && (
                  <FiUpload className="text-lg" />
                )}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}