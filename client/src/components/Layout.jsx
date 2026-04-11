import { Link, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthLayout() {
  document.body.classList.add("bg-(--c-violet-void)");
  const locationPath = useLocation().pathname;
  const titles = {
    "/mission-control": "Mission Control",
    "/my-squad": "My Squad",
    "/evaluation": "Evaluation",
    "/train": "Train",
    "/settings": "Settings",
    "/profile": "Profile",
  };
  const pageTitle = titles[locationPath] || "Squad Goals";
  const { user } = useContext(AuthContext);
  const userName = user.userName;

  return (
    <>
      <title>{`${pageTitle}`}</title>
      <header className="text-purple-300 fixed top-0 left-0 w-full h-16 flex items-center lg:justify-between ">
        <img
          src="/imgs/SGShield.svg"
          alt="Squad Goals logo"
          className="w-[60px] lg:hidden"
        />
        <h1 className=" text-xl font-semibold lg:ml-[240px] lg:pl-6">
          {pageTitle}
        </h1>
        <ul className="flex gap-12 mr-6 items-center">
          <li>
            <img
              src="/imgs/icons/settings.png"
              alt="settings icon"
              className="inline mr-3"
            />
            Settings
          </li>
          {/*Preferences for colors, (low color, high contrast, simplified, preferences for evaluation question priority, notifications)*/}
          {/*Profile info, logout, change password, delete account*/}
          <li>
            <img
              src="/imgs/icons/profile.png"
              alt="profile icon"
              className="inline mr-3"
            />
            {userName}
          </li>
        </ul>
      </header>
      <div className="pt-16 flex">
        <aside className="text-purple-300 min-h-[calc(100vh-4rem)] hidden lg:flex flex-col w-[240px] shrink-0 border-r-1 border-inherit justify-between pb-16">
          <ul className="flex flex-col gap-12 pl-12 my-12">
            <li>
              <Link to="/mission-control">
                <img
                  src="/imgs/icons/mission-control.png"
                  alt="mission control icon"
                  className="inline mr-3"
                />
                Missions
              </Link>
            </li>
            <li>
              <Link to="/my-squad">
                <img
                  src="/imgs/icons/my-squad.png"
                  alt=""
                  className="inline mr-3"
                />
                My Squad
              </Link>
            </li>
            <li>
              <Link to="/evaluation">
                <img
                  src="/imgs/icons/evaluation.png"
                  alt="evaluation icon"
                  className="inline mr-3"
                />
                Evaluation
              </Link>
            </li>
            <li>
              <Link to="/train">
                <img
                  src="/imgs/icons/train.png"
                  alt="train icon"
                  className="inline mr-3 -translate-y-1"
                />
                Train
              </Link>
            </li>
          </ul>
          <img
            src="/imgs/SGShield.svg"
            alt="Squad Goals logo"
            className="w-[100px] self-center hidden lg:block"
          />
        </aside>
        <Outlet />
      </div>
    </>
  );
}
