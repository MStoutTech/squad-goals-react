import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GuestHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isIndexPage = useLocation().pathname == "/";

  return (
    <header className="inset-x-0 top-0 z-50 relative">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Squad Goals</span>
            <img
              src="/imgs/SGHalfShield.svg"
              alt="Squad Goals"
              className="h-10 w-auto font-bold"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              data-slot="icon"
              aria-hidden="true"
              className="size-6"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/*Desktop Screen*/}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            to="/human-connection"
            className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
          >
            Human Connection
          </Link>
          <Link
            to="/about"
            className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
          >
            About
          </Link>
          <Link
            to="/sg-blog"
            className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
          >
            Blog
          </Link>
          {!user ? (
            <Link
              to="/signup"
              className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
            >
              Sign Up
            </Link>
          ) : (
            <Link
              to="/mission-control"
              className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
            >
              Go to App
            </Link>
          )}
        </div>
        {!user && (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="/login"
              className={`text-lg/6 font-semibold ${isIndexPage ? "text-purple-300" : "text-gray-900"}`}
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>
      {/*Mobile Menu conditionally rendered*/}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white text-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Squad Goals</span>
              <img
                src="/imgs/SGHalfShield.svg"
                alt="Squad Goals"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="size-6"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/human-connection"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50"
                >
                  Human Connection
                </Link>
                <Link
                  to="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50"
                >
                  About
                </Link>
                <Link
                  to="/sg-blog"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50"
                >
                  Blog
                </Link>
                {!user ? (
                  <Link
                    to="/signup"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50"
                  >
                    Sign Up
                  </Link>
                ) : (
                  <Link
                    to="/mission-control"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50"
                  >
                    Go to app
                  </Link>
                )}
              </div>
              {!user && (
                <div className="py-6">
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold  hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
