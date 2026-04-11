import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const loadingScreen = <h2>Loading...</h2>;
  return (
    <>
      {isLoading ? loadingScreen : user ? children : <Navigate to="/signup" />}
    </>
  );
}
