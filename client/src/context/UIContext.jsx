import { createContext, useState } from "react";
import { useEffect } from "react";

export const UIContext = createContext({
  windowWidth: null,
});

export function UIProvider({ children }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // define a handler function that calls setWindowWidth
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }
    // add it as an event listener for "resize" on window
    window.addEventListener("resize", updateSize);
    // return a cleanup function that removes the listener
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <UIContext.Provider
      value={{
        windowWidth: windowWidth,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
