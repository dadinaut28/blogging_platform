import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface Props {
  hideSideBar: boolean;
  onLargeScreen: boolean;
}

export function SideBar({ hideSideBar, onLargeScreen }: Props) {
  const [showLogoutSuccessMessage, setShowLogoutSuccessMessage] =
    useState(false);

  const handleLogoutButtonClick = () => {
    localStorage.removeItem("dadinaut_blogging_platform_auth_token");
    setShowLogoutSuccessMessage(true);

    setTimeout(() => setShowLogoutSuccessMessage(false), 2500);
  };

  return (
    <aside
      className={`${hideSideBar && "-translate-x-full"} transition-transform  px-6 pt-10 flex flex-col gap-7 w-60 fixed bg-white z-40 min-h-screen ${!onLargeScreen && "shadow-xl"}`}
    >
      {showLogoutSuccessMessage && (
        <div className="fixed top-16 right-5 px-2.5 py-1 border border-blue-300 bg-blue-50 text-blue-500 text-sm rounded-sm font-medium">
          <p>Vous êtes déconnecté !</p>
        </div>
      )}
      <Link className="flex items-center gap-4.5 text-lg text-gray-600" to="/">
        <img className="w-6" src=".././icons/home.png" alt="Icone accueil" />
        <span>Accueil</span>
      </Link>
      <Link
        className="flex items-center gap-4.5 text-lg text-gray-600"
        to="/profile"
      >
        <img className="w-6" src=".././icons/user.png" alt="Icone accueil" />
        <span>Profil</span>
      </Link>
      <Button
        className="p-0 inline bg-red-100 text-black text-md"
        onClick={handleLogoutButtonClick}
      >
        Déconnexion
      </Button>
    </aside>
  );
}
