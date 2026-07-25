import { useState, useContext, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function ConfirmLogoutModal({ closeModal }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout, user, isLoading } = useContext(AuthContext);

  async function submitLogout() {
    const response = await logout();
    if (response.user == null) {
      navigate("/login");
    }
  }
  useEffect(() => {
    if (!isLoading && !user) {
      setIsLoggingOut(true);
      navigate("/login");
    }
  }, [user, isLoading]);

  return (
    <PrimaryModal
      windowTitle="Confirm Logout"
      closeModal={closeModal}
      outsideClick={() => !isLoggingOut && closeModal()}
      isLoading={isLoggingOut}
      submitButtonText="Yes, Logout"
      confirmOnClick={() => {
        setIsLoggingOut(true);
        submitLogout();
      }}
    >
      {isLoggingOut ? (
        <CircularProgress color="#7D4C9F" />
      ) : (
        <p>Are you sure you want to log out?</p>
      )}
    </PrimaryModal>
  );
}

export function PrimaryModal({
  windowTitle,
  closeModal,
  formId,
  submitButtonText,
  confirmOnClick,
  allowSubmit = true,
  isLoading,
  outsideClick,
  showConfirmation,
  confirmationText,
  confirmationImg,
  children,
}) {
  const modalId = windowTitle.split(" ").join("-") + "-modal";
  return (
    <div
      id={modalId}
      aria-labelledby={modalId}
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div
        className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        onClick={outsideClick}
      ></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        {showConfirmation ? (
          <div
            className="z-50 bg-black/60 shadow-xl w-[100%]"
            onClick={closeModal}
          >
            <div className="bg-(--c-purple-tech-40) w-[100%] flex flex-col py-6 items-center">
              <h1 className="my-3 text-3xl">{confirmationText}</h1>
              <img src={confirmationImg} alt="" className="w-[40px] block" />
            </div>
          </div>
        ) : (
          <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
            <div className="bg-(--c-violet-void-40)/30  px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-5">
              <div className="mt-0 sm:ml-4 text-left">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-(--c-purple-tech-40) "
                >
                  {windowTitle}
                </h3>
                {isLoading ? (
                  <CircularProgress color="#7D4C9F" />
                ) : (
                  <div className="mt-2 text-purple-300 text-sm min-h-[200px] max-h-[500px] overflow-auto">
                    {/*form*/}
                    {children}
                  </div>
                )}
              </div>
            </div>
            {/*Window buttons*/}
            {!isLoading && (
              <div className="bg-(--c-violet-void-60) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {submitButtonText && allowSubmit && (
                  <button
                    form={formId}
                    type={confirmOnClick ? "button" : "submit"}
                    onClick={confirmOnClick}
                    className="inline-flex w-full justify-center items-center sm:ml-3 sm:w-auto h-[44px]"
                  >
                    <div className="px-3 py-2 w-full sm:w-auto text-sm shadow-xs action-button hover:bg-(--c-violet-void) rounded-md">
                      {submitButtonText}
                    </div>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center h-[44px]"
                >
                  <div className="px-3 py-2 text-sm font-semibold text-(--c-violet-void-40) shadow-xs inset-ring inset-ring-purple-300 hover:bg-(--c-violet-void-80) w-full sm:w-auto rounded-md bg-(--c-violet-void-60)">
                    Cancel
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
