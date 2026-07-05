import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Settings() {
  let isSubRouteActive = useLocation().pathname.startsWith("/settings/");

  return (
    <main className="w-full pt-3 lg:pt-12 lg:px-2">
      {!isSubRouteActive && (
        <ul className="text-sm text-(--c-purple-tech-40)">
          <li className="border-y-1 border-(--c-purple-tech)">
            <Link
              to="/settings/profile"
              className="px-5 py-6 block cursor-pointer"
            >
              My user Profile
            </Link>
          </li>
          <li className="px-5 py-6 border-b-1 border-(--c-purple-tech)">
            Notifications
          </li>
          <li className="px-5 py-6 border-b-1 border-(--c-purple-tech)">
            Integrations
          </li>
          <li className="px-5 py-6 border-b-1 border-(--c-purple-tech)">
            Help Center
          </li>
        </ul>
      )}
      <Outlet />
    </main>
  );
}
