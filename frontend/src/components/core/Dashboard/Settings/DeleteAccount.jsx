import { useState } from "react";
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from './../../../common/ConfirmationModal';
import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [check, setCheck] = useState(false);

  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()



  return (
    <>
      <div className="my-6 sm:my-10 flex flex-col sm:flex-row gap-4 sm:gap-x-5 rounded-xl border-[1px] border-pink-700 bg-pink-900 p-4 sm:p-8 px-4 sm:px-12 items-start">
        <div className="flex aspect-square h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-pink-700 flex-shrink-0">
          <FiTrash2 className="text-2xl sm:text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col flex-1">
          <h2 className="text-lg font-semibold text-richblack-5">Delete Account</h2>

          <div className="w-full sm:w-4/5 text-pink-25 flex flex-col gap-2 mt-2 text-sm leading-relaxed">
            <p>Would you like to delete account?</p>
            <p className="text-xs sm:text-sm text-pink-100/80">
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="deleteAccountCheck"
              className="form-checkbox h-4 w-4 text-pink-600 rounded cursor-pointer"
              checked={check}
              onChange={() => setCheck(prev => !prev)}
            />

            <label
              htmlFor="deleteAccountCheck"
              className="w-fit italic text-pink-300 cursor-pointer text-sm"
              onClick={() => {
                if (check) {
                  setConfirmationModal({
                    text1: "Are you sure ?",
                    text2: "Delete my account...!",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                    btn2Handler: () => { setConfirmationModal(null); setCheck(false) },
                  })
                }
              }}
            >
              I want to delete my account.
            </label>
          </div>

        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}