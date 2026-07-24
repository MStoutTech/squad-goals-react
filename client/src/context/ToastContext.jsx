import { createContext, useState } from "react";
import { useEffect } from "react";

export const ToastContext = createContext({
  showToast: () => {},
});
export function Toast({
  message,
  type,
  isEntering,
  isExiting,
  toastid,
  setToastQueue,
  dismissToast,
}) {
  //Need styling for type of toast

  //animate entrance
  useEffect(() => {
    setTimeout(() => {
      setToastQueue((prev) =>
        prev.map((element, index) =>
          index === 0 ? { ...element, isEntering: false } : element,
        ),
      );
    }, 100);
  }, []);

  //Remove toast after isexiting transition animation
  useEffect(() => {
    function checkTransitionEnd(e) {
      if (e.propertyName === "opacity" && isExiting) {
        document
          .getElementById(toastid)
          .removeEventListener("transitionend", checkTransitionEnd);
        setToastQueue((prev) =>
          prev.filter((toast) => toast.toastid != toastid),
        );
      }
    }
    const currentToast = toastid;
    document
      .getElementById(toastid)
      .addEventListener("transitionend", checkTransitionEnd);
    return () => {
      if (toastid != null) {
        document
          .getElementById(toastid)
          ?.removeEventListener("transitionend", checkTransitionEnd);
      }
    };
  }, [isExiting]);

  return (
    <div
      id={toastid}
      className={`${isEntering ? "opacity-0 scale-50" : isExiting ? "transition duration-300 ease-in-out opacity-0 -translate-y-10" : "transition duration-100 ease-in-out opacity-100 scale-100"} ${type === "error" ? "text-(--c-deep-cerise-20) font-bold" : "text-white"} fixed right-0 mr-6 z-100  text-xs bg-black/75 mt-20 rounded-lg shadow-md/20`}
    >
      <div
        className={`flex p-3 items-center gap-2  border rounded-lg ${type === "error" ? "border-(--c-light-coral) bg-(--c-light-coral-60)/40" : "border-purple-300 bg-(--c-violet-void-40)/30"}`}
      >
        <p>{message}</p>
        <button
          onClick={dismissToast}
          className="cursor-pointer p-1 font-normal"
        >
          X
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toastQueue, setToastQueue] = useState([]);

  function showToast(message, type) {
    setToastQueue((prev) => [
      ...prev,
      {
        toastid: Math.random().toString(16).slice(2),
        message: message,
        type: type,
        isEntering: true,
        isExiting: false,
      },
    ]);
  }

  function dismissToast() {
    setToastQueue((prev) =>
      prev.map((element, index) =>
        index === 0 ? { ...element, isExiting: true } : element,
      ),
    );
  }

  //auto dismiss timer
  useEffect(() => {
    let toastTimer;
    if (toastQueue.length > 0 && !toastQueue[0]?.isExiting) {
      let timeRemaining = 5;
      const currentToast = toastQueue[0].toastid;
      toastTimer = setInterval(() => {
        if (timeRemaining <= 0) {
          clearInterval(toastTimer);
          if (toastQueue[0].toastid === currentToast) {
            dismissToast();
          }
        } else {
          timeRemaining--;
        }
      }, 1000);
    }
    return () => clearInterval(toastTimer);
  }, [toastQueue[0]?.toastid, toastQueue[0]?.isExiting]);

  return (
    <ToastContext.Provider value={{ showToast: showToast }}>
      {toastQueue.length > 0 && (
        <Toast
          {...toastQueue[0]}
          setToastQueue={setToastQueue}
          dismissToast={dismissToast}
          key={toastQueue[0].toastid}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
}
