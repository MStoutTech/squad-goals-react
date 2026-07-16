import { createContext, useState } from "react";
import { useEffect } from "react";

export const WalkthroughContext = createContext({
  dismissedIntros: null,
  dismissIntro: () => {},
});

export function WalkthroughProvider({ children }) {
  const [dismissedIntros, setDismissedIntros] = useState({
    mySquad: false,
    missions: false,
  });

  function dismissIntro(introName) {
    setDismissedIntros((prev) => ({ ...prev, [introName]: true }));
  }

  return (
    <WalkthroughContext.Provider
      value={{
        dismissedIntros: dismissedIntros,
        dismissIntro: dismissIntro,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}
