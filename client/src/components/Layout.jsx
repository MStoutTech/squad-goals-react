import { Link, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ConfirmLogoutModal from "../components/Modals";

export function PageTab({ pageTitle, pageName, link, icon, iconAlt, text }) {
  const active = pageTitle === pageName;

  return (
    <li>
      <Link
        to={link}
        className={`
          ${
            active
              ? "text-white border-b-1 border-white p-2"
              : "hover:rounded-md hover:bg-(--c-violet-void-80) --c-purple-tech-40 border-b-1 border-(--c-violet-void) p-2 "
          } min-h-[44px] hover:text-white flex`}
      >
        <div className="mr-3 w-[28px]">
          <img src={icon} alt={iconAlt} />
        </div>
        {text || pageName}
      </Link>
    </li>
  );
}
function ThumbNav({
  pageTitle,
  pageName,
  link,
  icon,
  iconAlt,
  text,
  imageTranslate,
}) {
  const active = pageTitle === pageName;

  return (
    <li className="flex flex-col items-center grow basis-1">
      <Link
        to={link}
        className={
          active
            ? "text-white border-b-1 border-white flex flex-col p-2 gap-1 items-center size-[64px] justify-end"
            : "hover:rounded-md hover:bg-(--c-violet-void) hover:text-white border-b-1 border-(--c-violet-void-60)  flex flex-col items-center justify-end size-[64px] gap-1 p-2"
        }
      >
        <div className="size-[30px]">
          <img src={icon} alt={iconAlt} className={imageTranslate} />
        </div>

        <span className={`${active && "text-white"}  block text-xs`}>
          {text || pageName}
        </span>
      </Link>
    </li>
  );
}
export default function AuthLayout() {
  const locationPath = useLocation().pathname;
  const titles = {
    "/mission-control": "Mission Control",
    "/my-squad": "My Squad",
    "/evaluation": "Evaluation",
    "/train": "Train",
    "/settings": "Settings",
    "/profile": "Settings > Profile",
  };
  const pageTitle = titles[locationPath] || "Squad Goals";
  const { user } = useContext(AuthContext);
  const userName = user.userName;
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("bg-(--c-violet-void)");

    return () => {
      document.body.classList.remove("bg-(--c-violet-void)");
    };
  }, []);

  return (
    <>
      <title>{`${pageTitle}`}</title>
      <header className="text-purple-300 fixed top-0 left-0 w-full h-16 py-4 lg:py-0 px-10 lg:px-0 flex items-center justify-between bg-(--c-violet-void) z-100">
        <img
          src="/imgs/SGShield.svg"
          alt="Squad Goals logo"
          className="w-[60px] lg:hidden "
        />
        <h1 className=" text-xl font-semibold lg:ml-[240px]  pl-6">
          {pageTitle}
        </h1>

        <ul className="hidden lg:flex gap-12 mr-6 items-center">
          <PageTab
            pageTitle={pageTitle}
            pageName="Settings"
            link="/settings"
            icon="/imgs/icons/settings.png"
            iconAlt="settings icon"
            text="Settings"
          />
          <li
            className={
              pageTitle === "Profile"
                ? "text-white border-b-1 border-white p-2 flex items-center gap-2"
                : "hover:rounded-md hover:bg-(--c-violet-void-80) hover:text-white border-b-1 border-(--c-violet-void) p-2 flex items-center "
            }
          >
            <p
              onClick={() => setShowUserOptions(!showUserOptions)}
              className="flex gap-2 items-center justify-end h-full cursor-pointer"
            >
              <img
                src="/imgs/icons/profile.png"
                alt="profile icon"
                className="block"
              />
              <span className="block">{userName}</span>
            </p>
          </li>
          {showUserOptions && (
            <ul className="absolute z-50 bg-(--c-violet-void) border border-purple-300 w-26 rounded-md mt-26 ml-42 text-white max-h-40 text-sm">
              <li>
                <Link
                  to="/settings/profile"
                  onClick={() => setShowUserOptions(false)}
                  className="p-2 block hover:bg-purple-400 cursor-pointer"
                >
                  Profile
                </Link>
              </li>
              <li
                className="p-2 hover:bg-purple-400 cursor-pointer"
                onClick={() => {
                  setShowUserOptions(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                Logout
              </li>
            </ul>
          )}
          {isLogoutModalOpen && (
            <ConfirmLogoutModal
              closeModal={() => setIsLogoutModalOpen(false)}
            />
          )}
        </ul>
      </header>
      <div className="px-6 lg:px-0 pt-16 lg:pt-6 flex">
        <aside className="hidden lg:flex text-purple-300 min-h-[calc(100vh-2rem)] flex-col w-[210px] pr-6 shrink-0 border-r-1 border-inherit justify-between pb-16">
          <ul className="flex flex-col gap-12 pl-9 my-12">
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
              icon="/imgs/icons/squad.svg"
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
            className="w-[100px] self-center translate-x-3"
          />
        </aside>
        <div className="lg:h-[calc(100vh-2rem)] overflow-y-auto w-[100%]">
          <Outlet />
        </div>
      </div>
      <ul className="lg:hidden fixed bottom-0 left-0 w-full h-20 flex justify-end px-2 py-2 bg-(--c-violet-void-60) text-purple-300 z-100">
        <ThumbNav
          pageTitle={pageTitle}
          pageName="Mission Control"
          link="/mission-control"
          icon="/imgs/icons/mission-control.png"
          iconAlt="mission control icon"
          text="Missions"
          imageTranslate={"translate-x-1"}
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
          icon="/imgs/icons/squad.svg"
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
