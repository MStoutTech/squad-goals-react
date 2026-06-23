import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./css/style.css";
//import "./js/animations.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { StyledEngineProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <UIProvider>
          <App />
        </UIProvider>
      </StyledEngineProvider>
    </AuthProvider>
  </BrowserRouter>,
);
