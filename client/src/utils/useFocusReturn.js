import { useRef } from "react";
//custom hook for trapping focus
export default function useFocusReturn() {
  const previouslyFocused = useRef(null);

  const saveFocus = () => {
    previouslyFocused.current = document.activeElement;
  };

  const restoreFocus = () => {
    previouslyFocused.current?.focus();
  };

  return { saveFocus, restoreFocus };
}