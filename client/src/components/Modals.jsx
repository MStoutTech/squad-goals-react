import { useState, useContext, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function ConfirmLogoutModal({ closeModal }) {
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
    <div
      id="mission-debreif-modal"
      aria-labelledby="mission-debreif-modal"
      className="fixed inset-0 z-50 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        onClick={() => !isLoggingOut && closeModal()}
      ></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center sp-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-0 sm:ml-4 text-left ">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Confirm Logout
                </h3>
                <div className="mt-2 text-purple-300 text-sm">
                  {isLoggingOut ? (
                    <CircularProgress color="#7D4C9F" />
                  ) : (
                    <p>Are you sure you want to log out?</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          {!isLoggingOut && (
            <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setIsLoggingOut(true);
                  submitLogout();
                }}
                className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
              >
                Yes, Logout
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-(--c-violet-void-40) px-3 py-2 text-sm font-semibold text-purple-400 shadow-xs inset-ring inset-ring-purple-400 hover:bg-(--c-violet-void-20) sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
