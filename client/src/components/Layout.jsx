import { Link, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UIContext } from "../context/UIContext";

export function PageTab({ pageTitle, pageName, link, icon, iconAlt, text }) {
  const active = pageTitle === pageName;

  return (
    <li
      className={
        active
          ? "text-white border-b-1 border-white p-2"
          : "hover:rounded-md hover:bg-(--c-violet-void-80) hover:text-white border-b-1 border-(--c-violet-void) p-2"
      }
    >
      <Link to={link}>
        <img src={icon} alt={iconAlt} className="inline mr-3" />
        {text || pageName}
      </Link>
    </li>
  );
}
function ThumbNav({ pageTitle, pageName, link, icon, iconAlt, text }) {
  const active = pageTitle === pageName;

  return (
    <Link to={link} className="flex flex-col items-center justify-end h-full">
      <li
        className={
          active
            ? "text-white border-b-1 border-white p-2 flex flex-col items-center gap-2"
            : "hover:rounded-md hover:bg-(--c-violet-void) hover:text-white border-b-1 border-(--c-violet-void-60) p-2 flex flex-col items-center gap-2"
        }
      >
        <img src={icon} alt={iconAlt} className="block" />
        <span className="block text-xs">{text || pageName}</span>
      </li>
    </Link>
  );
}
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
  const { windowWidth } = useContext(UIContext);
  const userName = user.userName;

  return (
    <>
      <title>{`${pageTitle}`}</title>
      {windowWidth > 1024 ? (
        <DesktopNav pageTitle={pageTitle} userName={userName}>
          {" "}
          <Outlet />
        </DesktopNav>
      ) : (
        <MobileNav pageTitle={pageTitle} userName={userName}>
          <Outlet />
        </MobileNav>
      )}
    </>
  );
}

function DesktopNav({ pageTitle, userName, children }) {
  return (
    <>
      <header className="text-purple-300 fixed top-0 left-0 w-full h-16 flex items-center lg:justify-between bg-(--c-violet-void) ">
        <h1 className=" text-xl font-semibold ml-[240px] pl-6">{pageTitle}</h1>
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
        <aside className="text-purple-300 min-h-[calc(100vh-4rem)] flex flex-col w-[240px] pr-6 shrink-0 border-r-1 border-inherit justify-between pb-16">
          <ul className="flex flex-col gap-12 pl-12 my-12">
            <PageTab
              pageTitle={pageTitle}
              pageName="Mission Control"
              link="/mission-control"
              icon="/imgs/icons/mission-control.png"
              iconAlt="mission control icon"
              text="Missions"
            />
            <PageTab
              pageTitle={pageTitle}
              pageName="My Squad"
              link="/my-squad"
              icon="/imgs/icons/my-squad.png"
              iconAlt="my squad icon"
            />
            <PageTab
              pageTitle={pageTitle}
              pageName="Evaluation"
              link="/evaluation"
              icon="/imgs/icons/evaluation.png"
              iconAlt="evaluation icon"
            />
            <PageTab
              pageTitle={pageTitle}
              pageName="Train"
              link="/train"
              icon="/imgs/icons/train.png"
              iconAlt="train icon"
            />
          </ul>
          <img
            src="/imgs/SGShield.svg"
            alt="Squad Goals logo"
            className="w-[100px] self-center hidden lg:block"
          />
        </aside>
        {children}
      </div>
    </>
  );
}

function MobileNav({ pageTitle, userName, children }) {
  return (
    <>
      <header className="text-purple-300 fixed top-0 left-0 w-full h-16 flex items-center justify-between py-10 px-10 bg-(--c-violet-void) z-100">
        <img
          src="/imgs/SGShield.svg"
          alt="Squad Goals logo"
          className="w-[60px] "
        />
        <h1 className=" text-xl font-semibold ">{pageTitle}</h1>
      </header>
      <div className="mx-10 my-20">{children}</div>
      <ul className="fixed bottom-0 left-0 w-full h-20 flex justify-between px-6 py-2 bg-(--c-violet-void-60) text-purple-300 z-100">
        <ThumbNav
          pageTitle={pageTitle}
          pageName="Mission Control"
          link="/mission-control"
          icon="/imgs/icons/mission-control.png"
          iconAlt="mission control icon"
          text="Missions"
        />
        <ThumbNav
          pageTitle={pageTitle}
          pageName="Train"
          link="/train"
          icon="/imgs/icons/train.png"
          iconAlt="train icon"
        />
        <ThumbNav
          pageTitle={pageTitle}
          pageName="My Squad"
          link="/my-squad"
          icon="/imgs/icons/my-squad.png"
          iconAlt="my squad icon"
          text="Squad"
        />
        <ThumbNav
          pageTitle={pageTitle}
          pageName="Evaluation"
          link="/evaluation"
          icon="/imgs/icons/evaluation.png"
          iconAlt="evaluation icon"
          text="Eval"
        />
        <ThumbNav
          pageTitle={pageTitle}
          pageName="Settings"
          link="/settings"
          icon="/imgs/icons/settings.png"
          iconAlt="settings icon"
          text="Settings"
        />
      </ul>
    </>
  );
}
