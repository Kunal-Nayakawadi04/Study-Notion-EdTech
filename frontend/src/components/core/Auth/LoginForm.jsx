import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const validateField = (name, value) => {
    let error = ""
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!value.trim()) {
        error = "Email address is required"
      } else if (!emailRegex.test(value.trim())) {
        error = "Please enter a valid email address"
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required"
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters"
      }
    }
    return error
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
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
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    }
    setErrors(newErrors)
    setTouched({
      email: true,
      password: true,
    })

    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    dispatch(login(email, password, navigate))
  }

  return (
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      {/* Email Field */}
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

      {/* Password Field */}
      <div className="w-full">
        <label className="w-full block">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Password <sup className="text-pink-200">*</sup>
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
        <Link to="/forgot-password" className="block max-w-max ml-auto">
          <p className="mt-1 text-xs text-blue-100 hover:underline">
            Forgot Password
          </p>
        </Link>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-semibold text-richblack-900 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] hover:bg-yellow-100 active:scale-[0.98] transition-all duration-200"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm