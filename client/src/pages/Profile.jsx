import { PrimaryButton } from "../components/Buttons";
import { AuthContext } from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ConfirmLogoutModal } from "../components/Modals";

export default function Profile() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <main className="text-(--c-purple-tech-40) lg:p-4">
        <Link to="/settings" className="text-xs">
          {"<- "}Back
        </Link>
        <h1 className="text-center text-xl mb-4">Profile</h1>
        <ul className="flex flex-col gap-3 mb-15 p-4">
          {/*Preferences for colors, (low color, high contrast, simplified, preferences for evaluation question priority,)*/}
          <li>User Name: Name</li>
          <li>User since: Date</li>
          <li>Email: Email</li>
          <li>
            <button>Change Password</button>
          </li>
        </ul>
        <ul className="flex flex-col gap-3 p-4">
          <li>
            <PrimaryButton
              innerText="Log out"
              onClick={() => setIsLogoutModalOpen(true)}
            />
          </li>
          <li>
            <button>Download contact data</button>
          </li>
          <li>
            <button className="text-(--c-light-coral-x2)">
              Delete contact data
            </button>
          </li>
        </ul>
        {isLogoutModalOpen && (
          <ConfirmLogoutModal closeModal={() => setIsLogoutModalOpen(false)} />
        )}
      </main>
    </>
  );
}
