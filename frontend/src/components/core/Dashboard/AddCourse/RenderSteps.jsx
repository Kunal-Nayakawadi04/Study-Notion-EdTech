import React from "react"
import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"
import EditCourse from './../EditCourse/EditCourse';


export default function RenderSteps() {

  const { step } = useSelector((state) => state.course)
  const { editCourse } = useSelector(state => state.course)


  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <>
      <div className="relative mb-2 flex w-full select-none items-center justify-center">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-[30px] sm:w-[34px] place-items-center rounded-full border-[1px] text-xs sm:text-sm font-semibold transition-all duration-200
                    ${step === item.id ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"}
                    ${step > item.id && "bg-yellow-50 text-richblack-900"} `}
              >
                {step > item.id ?
                  (<FaCheck className="font-bold text-xs" />)
                  : (item.id)
                }
              </div>
            </div>

            {/* dashes  */}
            {item.id !== steps.length && (
              <div
                className={`h-[1px] flex-1 max-w-[28%] sm:max-w-[33%] border-dashed border-b-2 ${step > item.id ? "border-yellow-50" : "border-richblack-500"} `}
              >
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mb-8 sm:mb-16 flex w-full select-none justify-between gap-1">
        {steps.map((item) => (
          <div className="flex flex-1 flex-col items-center text-center" key={item.id}>
            <p className={`text-[11px] sm:text-sm leading-tight max-w-[90px] sm:max-w-none ${step >= item.id ? "text-richblack-5 font-medium" : "text-richblack-500"}`}>
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  )
}