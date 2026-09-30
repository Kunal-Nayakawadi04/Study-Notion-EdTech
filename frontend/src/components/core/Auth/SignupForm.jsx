import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  const validateField = (name, value, currentFormData = formData) => {
    let error = ""
    const nameRegex = /^[A-Za-z\s'-]+$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required"
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters"
        } else if (!nameRegex.test(value.trim())) {
          error = "Only alphabetic characters are allowed"
        }
        break

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required"
        } else if (!nameRegex.test(value.trim())) {
          error = "Only alphabetic characters are allowed"
        }
        break

      case "email":
        if (!value.trim()) {
          error = "Email address is required"
        } else if (!emailRegex.test(value.trim())) {
          error = "Please enter a valid email address"
        }
        break

      case "password":
        if (!value) {
          error = "Password is required"
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters"
        }
        break

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password"
        } else if (value !== currentFormData.password) {
          error = "Passwords do not match"
        }
        break

      default:
        break
    }
    return error
  }

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    const { name, value } = e.target
    const updatedFormData = {
      ...formData,
      [name]: value,
    }
    setFormData(updatedFormData)

    if (touched[name]) {
      const error = validateField(name, value, updatedFormData)
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }))
    }

    // Also re-validate confirmPassword if password changed and confirmPassword was touched
    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", updatedFormData.confirmPassword, updatedFormData)
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmError,
      }))
    }
  }

  const handleOnBlur = (e) => {
    const { name, value } = e.target
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }))
    const error = validateField(name, value)
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    }

    setErrors(newErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    return !Object.values(newErrors).some((error) => error !== "")
  }

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }

    const signupData = {
      ...formData,
      accountType,
    }

    // Setting signup data to state
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
    setTouched({})
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form noValidate onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        {/* Name Fields Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* First Name */}
          <div className="w-full">
            <label className="w-full block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                First Name <sup className="text-pink-200">*</sup>
              </p>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                placeholder="Enter first name"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none transition-all duration-200 ${
                  touched.firstName && errors.firstName
                    ? "border border-pink-400/80 focus:ring-1 focus:ring-pink-400"
                    : "border border-transparent focus:border-richblack-600"
                }`}
              />
            </label>
            {touched.firstName && errors.firstName && (
              <p className="mt-1 text-[0.75rem] text-pink-200 font-medium animate-fadeIn">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="w-full">
            <label className="w-full block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Last Name <sup className="text-pink-200">*</sup>
              </p>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                placeholder="Enter last name"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none transition-all duration-200 ${
                  touched.lastName && errors.lastName
                    ? "border border-pink-400/80 focus:ring-1 focus:ring-pink-400"
                    : "border border-transparent focus:border-richblack-600"
                }`}
              />
            </label>
            {touched.lastName && errors.lastName && (
              <p className="mt-1 text-[0.75rem] text-pink-200 font-medium animate-fadeIn">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div className="w-full">
          <label className="w-full block">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              placeholder="Enter email address"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none transition-all duration-200 ${
                touched.email && errors.email
                  ? "border border-pink-400/80 focus:ring-1 focus:ring-pink-400"
                  : "border border-transparent focus:border-richblack-600"
              }`}
            />
          </label>
          {touched.email && errors.email && (
            <p className="mt-1 text-[0.75rem] text-pink-200 font-medium animate-fadeIn">
              {errors.email}
            </p>
          )}
        </div>

        {/* Passwords Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Create Password */}
          <div className="w-full">
            <label className="w-full block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Create Password <sup className="text-pink-200">*</sup>
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  placeholder="Enter Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5 outline-none transition-all duration-200 ${
                    touched.password && errors.password
                      ? "border border-pink-400/80 focus:ring-1 focus:ring-pink-400"
                      : "border border-transparent focus:border-richblack-600"
                  }`}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-[10] cursor-pointer text-richblack-300 hover:text-richblack-100 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={22} />
                  ) : (
                    <AiOutlineEye fontSize={22} />
                  )}
                </span>
              </div>
            </label>
            {touched.password && errors.password && (
              <p className="mt-1 text-[0.75rem] text-pink-200 font-medium animate-fadeIn">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password  */}
          <div className="w-full">
            <label className="w-full block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  placeholder="Confirm Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5 outline-none transition-all duration-200 ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border border-pink-400/80 focus:ring-1 focus:ring-pink-400"
                      : "border border-transparent focus:border-richblack-600"
                  }`}
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-[10] cursor-pointer text-richblack-300 hover:text-richblack-100 transition-colors"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={22} />
                  ) : (
                    <AiOutlineEye fontSize={22} />
                  )}
                </span>
              </div>
            </label>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-1 text-[0.75rem] text-pink-200 font-medium animate-fadeIn">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-semibold text-richblack-900 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] hover:bg-yellow-100 active:scale-[0.98] transition-all duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm