import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface Props {
  hideSideBar: boolean;
  onLargeScreen: boolean;
  onUserLogout: () => void;
}

export function SideBar({ hideSideBar, onLargeScreen, onUserLogout }: Props) {
  const [showLogoutSuccessMessage, setShowLogoutSuccessMessage] =
    useState(false);
  const [showLogoutConfirmationBox, setShowLogoutConfirmationBox] =
    useState(false);
  const navigate = useNavigate();

  const handleLogoutButtonClick = () => {
    setShowLogoutConfirmationBox(false);
    localStorage.removeItem("dadinaut_blogging_platform_auth_token");
    setShowLogoutSuccessMessage(true);
    setTimeout(() => {
      setShowLogoutSuccessMessage(false);
      navigate("/login");
      onUserLogout();
    }, 2500);
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
      {showLogoutConfirmationBox && (
        <div className="fixed top-1/2 left-1/2 w-70 -translate-1/2 bg-gray-100 shadow rounded-md px-2 pt-8 pb-5 ">
          <p className="text-red-600 text-sm font-medium">
            Voulez-vous vraiment vous déconnecter ?
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={handleLogoutButtonClick}>Oui</Button>
            <Button onClick={() => setShowLogoutConfirmationBox(false)}>
              Non
            </Button>
          </div>
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
        onClick={() => setShowLogoutConfirmationBox(true)}
      >
        Déconnexion
      </Button>
    </aside>
  );
}
