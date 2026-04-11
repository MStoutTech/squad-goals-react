import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/Layout";

import Index from "./pages/Index";
import About from "./pages/About";
import SGBlog from "./pages/SGBlog";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HumanConnection from "./pages/HumanConnection";
import MissionControl from "./pages/MissionControl";
import MySquad from "./pages/MySquad";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Train from "./pages/Train";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/human-connection" element={<HumanConnection />} />
        <Route path="/about" element={<About />} />
        <Route path="/sg-blog" element={<SGBlog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/mission-control" element={<MissionControl />} />
          <Route path="/my-squad" element={<MySquad />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/train" element={<Train />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
