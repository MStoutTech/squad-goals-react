import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const loadingScreen = (
    <div id="preloader">
      <div id="loaderanimation"></div>
      <h2 className="text-white relative top-[55%] left-[45%]">Loading...</h2>
    </div>
  );
  return (
    <>
      {isLoading ? loadingScreen : user ? children : <Navigate to="/login" />}
    </>
  );
}
